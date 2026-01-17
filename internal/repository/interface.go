package repository

import (
	"context"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
)

type UserRepository interface {
	Create(ctx context.Context, req request.CreateUserRequest) error
	FindAll(ctx context.Context) (
		[]response.UserResponse,
		error,
	)
	FindByID(ctx context.Context, id string) (
		response.DetailUserResponse,
		error,
	)
}

type ChatRepository interface {
	Create(ctx context.Context, req request.CreateChatSessionRequest) error
	FindAll(ctx context.Context) (
		[]response.ChatSessionResponse,
		error,
	)
	FindByID(ctx context.Context, id string) (
		response.ChatSessionResponse,
		error,
	)
	AddParticipant(ctx context.Context, chatID string, req request.AddParticipantRequest) error
	FindParticipants(ctx context.Context, chatID string) (
		[]response.ParticipantResponse,
		error,
	)
}

type MessageRepository interface {
	Create(ctx context.Context, chatID string, req request.SendMessageRequest) error
	FindByChatID(ctx context.Context, chatID string) (
		[]response.MessageResponse,
		error,
	)
}
