package main

import (
	"context"
	"fmt"
	"log"
	"nebulachat-server/config"
	"nebulachat-server/internal/delivery/http"
	"nebulachat-server/internal/repository"
	"nebulachat-server/internal/usecase"
	stdhttp "net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Error loading .env file: %v\n", err)
	}

	cfg := config.LoadConfig()

	dbPool, err := pgxpool.New(context.Background(), cfg.DBURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer dbPool.Close()

	userRepo := repository.NewUserRepository(dbPool)
	chatRepo := repository.NewChatRepository(dbPool)
	messageRepo := repository.NewMessageRepository(dbPool)

	userUsecase := usecase.NewUserUsecase(userRepo)
	chatUsecase := usecase.NewChatUsecase(chatRepo)
	messageUsecase := usecase.NewMessageUsecase(messageRepo)

	userHandler := http.NewUserHandler(userUsecase)
	chatHandler := http.NewChatHandler(chatUsecase)
	messageHandler := http.NewMessageHandler(messageUsecase)

	mux := stdhttp.NewServeMux()
	mux.Handle("/users", userHandler)
	mux.Handle("/users/", userHandler)

	mux.HandleFunc(
		"/chats/", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
			if strings.HasSuffix(r.URL.Path, "/messages") {
				messageHandler.ServeHTTP(w, r)
			} else {
				chatHandler.ServeHTTP(w, r)
			}
		},
	)
	mux.Handle("/chats", chatHandler)

	fmt.Printf("Server starting on port %s...\n", cfg.Port)
	if err := stdhttp.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatal(err)
	}
}
