package config

import (
	"os"
)

type Config struct {
	DBURL string
	Port  string
}

func LoadConfig() Config {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/nebulachat?sslmode=disable"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return Config{
		DBURL: dbURL,
		Port:  port,
	}
}
