package usecase

import (
	"context"
	"errors"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
	"nebulachat-server/internal/repository"
)

type chatUsecaseImpl struct {
	chatRepo repository.ChatRepository
}

func (c *chatUsecaseImpl) CreateChat(ctx context.Context, req request.CreateChatSessionRequest) error {
	if req.ID == "" || req.Name == "" {
		return errors.New("id and name are required")
	}
	return c.chatRepo.Create(ctx, req)
}

func (c *chatUsecaseImpl) GetAllChats(ctx context.Context) (
	[]response.ChatSessionResponse,
	error,
) {
	return c.chatRepo.FindAll(ctx)
}

func (c *chatUsecaseImpl) GetChatByID(ctx context.Context, id string) (
	response.ChatSessionResponse,
	error,
) {
	return c.chatRepo.FindByID(ctx, id)
}

func (c *chatUsecaseImpl) AddParticipant(ctx context.Context, chatID string, req request.AddParticipantRequest) error {
	return c.chatRepo.AddParticipant(ctx, chatID, req)
}

func (c *chatUsecaseImpl) GetParticipants(ctx context.Context, chatID string) (
	[]response.ParticipantResponse,
	error,
) {
	return c.chatRepo.FindParticipants(ctx, chatID)
}

func NewChatUsecase(chatRepo repository.ChatRepository) ChatUsecase {
	return &chatUsecaseImpl{chatRepo: chatRepo}
}
