package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"sync"
	"time"

	"github.com/mmcloughlin/geohash"
)

// Donor scoring constants
const (
	DistanceWeight = 0.6
	RecencyWeight  = 0.3
	ResponseWeight = 0.1
)

func calculateDonorScore(distance float64, lastDonationDays int, responseRate float64) float64 {
	// Recency factor: 1 if >180d, 0.7 if >90d
	recencyFactor := 0.7
	if lastDonationDays > 180 {
		recencyFactor = 1.0
	}

	// Score formula: (1/distance) * recency * response_rate
	// Use 1/(distance + 1) to avoid division by zero
	return (1.0 / (distance + 1)) * recencyFactor * responseRate
}

func (m *MatchEngine) performParallelSearch(bloodType string, lat, lon float64) []string {
	radii := []float64{5, 10, 25, 50}
	var wg sync.WaitGroup
	resultChan := make(chan []string, len(radii))
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// Geohash pre-filtering
	gh := geohash.Encode(lat, lon)
	prefix := gh[:4] // 4 chars ~ 20km precision

	for _, r := range radii {
		wg.Add(1)
		go func(radius float64) {
			defer wg.Done()
			
			// In a real app, this would be an ES query with geohash prefix filter
			fmt.Printf("Searching radius %f km with geohash prefix %s\n", radius, prefix)
			
			// Mock results
			matches := []string{fmt.Sprintf("donor-at-%fkm", radius)}
			resultChan <- matches
		}(r)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	var allMatches []string
	for matches := range resultChan {
		allMatches = append(allMatches, matches...)
		if len(allMatches) > 5 {
			break // Return first sufficient result set
		}
	}

	return allMatches
}
