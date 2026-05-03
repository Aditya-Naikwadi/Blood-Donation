package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"github.com/segmentio/kafka-go"
)

type Donor struct {
	DonorID          string   `json:"donorId"`
	BloodType        string   `json:"bloodType"`
	Location         Location `json:"location"`
	IsAvailable      bool     `json:"isAvailable"`
	LastDonationDate string   `json:"lastDonationDate"`
}

type Location struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

var es *elasticsearch.Client
var rdb *redis.Client
var kafkaWriter *kafka.Writer

func initES() {
	var err error
	es, err = elasticsearch.NewDefaultClient()
	if err != nil {
		log.Fatalf("Error creating ES client: %s", err)
	}
}

func initRedis() {
	rdb = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
}

func initKafka() {
	kafkaWriter = &kafka.Writer{
		Addr:     kafka.TCP("localhost:9094"),
		Topic:    "match.found",
		Balancer: &kafka.LeastBytes{},
	}

	// Chain B: Consume request.created
	go func() {
		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers: []string{"localhost:9094"},
			Topic:   "request.created",
			GroupID: "match-engine-group",
		})
		for {
			m, _ := reader.ReadMessage(context.Background())
			var req struct {
				ID        string   `json:"id"`
				BloodType string   `json:"bloodType"`
				Location  Location `json:"location"`
				Radius    string   `json:"radius"`
			}
			json.Unmarshal(m.Value, &req)
			
			matches := performMatch(req.BloodType, req.Location.Lat, req.Location.Lon, req.Radius)
			
			if len(matches) > 0 {
				event := map[string]interface{}{
					"requestId": req.ID,
					"matches":   matches,
				}
				msg, _ := json.Marshal(event)
				kafkaWriter.WriteMessages(context.Background(), kafka.Message{Value: msg})
			}
		}
	}()

	// Chain A: Consume donor.registered / donor.updated
	go func() {
		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers: []string{"localhost:9094"},
			Topic:   "donor.updated",
			GroupID: "match-engine-upsert-group",
		})
		for {
			m, _ := reader.ReadMessage(context.Background())
			var donor Donor
			json.Unmarshal(m.Value, &donor)
			
			// Index in Elasticsearch
			var buf bytes.Buffer
			json.NewEncoder(&buf).Encode(donor)
			es.Index("donors", &buf, es.Index.WithDocumentID(donor.DonorID))
		}
	}()
}

func performMatch(bloodType string, lat, lon float64, radius string) []string {
	cacheKey := fmt.Sprintf("donors:cache:%s:%f:%f:%s", bloodType, lat, lon, radius)
	cached, _ := rdb.Get(context.Background(), cacheKey).Result()
	if cached != "" {
		var ids []string
		json.Unmarshal([]byte(cached), &ids)
		return ids
	}

	// Elasticsearch Query (simplified for brevity)
	// In reality, use the geo_distance query defined earlier
	log.Printf("Searching ES for %s near %f,%f", bloodType, lat, lon)
	
	matches := []string{"donor-1", "donor-2"} // Mocked result
	
	matchesJSON, _ := json.Marshal(matches)
	rdb.Set(context.Background(), cacheKey, matchesJSON, 2*time.Minute)
	
	return matches
}

func main() {
	initES()
	initRedis()
	initKafka()
	app := fiber.New()
	
	app.Get("/donors/nearby", func(c *fiber.Ctx) error {
		bt := c.Query("bloodType")
		lat := c.QueryFloat64("lat", 0)
		lon := c.QueryFloat64("lon", 0)
		rad := c.Query("radius", "10km")
		
		results := performMatch(bt, lat, lon, rad)
		return c.JSON(results)
	})

	log.Fatal(app.Listen(":3004"))
}
