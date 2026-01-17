package usecase

import (
	"context"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
)

type UserUsecase interface {
	Register(ctx context.Context, req request.CreateUserRequest) error
	GetAllUsers(ctx context.Context) (
		[]response.UserResponse,
		error,
	)
	GetUserByID(ctx context.Context, id string) (
		response.DetailUserResponse,
		error,
	)
}

type ChatUsecase interface {
	CreateChat(ctx context.Context, req request.CreateChatSessionRequest) error
	GetAllChats(ctx context.Context) (
		[]response.ChatSessionResponse,
		error,
	)
	GetChatByID(ctx context.Context, id string) (
		response.ChatSessionResponse,
		error,
	)
	AddParticipant(ctx context.Context, chatID string, req request.AddParticipantRequest) error
	GetParticipants(ctx context.Context, chatID string) (
		[]response.ParticipantResponse,
		error,
	)
}

type MessageUsecase interface {
	SendMessage(ctx context.Context, chatID string, req request.SendMessageRequest) error
	GetChatMessages(ctx context.Context, chatID string) (
		[]response.MessageResponse,
		error,
	)
}
