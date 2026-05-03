package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID               string    `bson:"_id,omitempty" json:"id"`
	Name             string    `bson:"name" json:"name"`
	Email            string    `bson:"email" json:"email"`
	BloodType        string    `bson:"bloodType" json:"bloodType"`
	IsAvailable      bool      `bson:"isAvailable" json:"isAvailable"`
}

var client *mongo.Client
var collection *mongo.Collection
var rdb *redis.Client

func initDB() {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://admin:password@localhost:27017"
	}
	var err error
	client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}
	collection = client.Database("blood_donation").Collection("users")
}

func initRedis() {
	addr := os.Getenv("REDIS_URL")
	if addr == "" {
		addr = "localhost:6379"
	}
	rdb = redis.NewClient(&redis.Options{Addr: addr})
}

func main() {
	initDB()
	initRedis()
	app := fiber.New()

	app.Get("/donors/me", func(c *fiber.Ctx) error {
		userId := c.Query("userId")
		
		var user User
		err := collection.FindOne(context.TODO(), bson.M{"_id": userId}).Decode(&user)
		if err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}

		return c.JSON(user)
	})

	log.Fatal(app.Listen(":3002"))
}
