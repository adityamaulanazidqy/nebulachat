package usecase

import (
	"context"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
	"nebulachat-server/internal/repository"
)

type messageUsecaseImpl struct {
	messageRepo repository.MessageRepository
}

func (m *messageUsecaseImpl) SendMessage(ctx context.Context, chatID string, req request.SendMessageRequest) error {
	return m.messageRepo.Create(ctx, chatID, req)
}

func (m *messageUsecaseImpl) GetChatMessages(ctx context.Context, chatID string) (
	[]response.MessageResponse,
	error,
) {
	return m.messageRepo.FindByChatID(ctx, chatID)
}

func NewMessageUsecase(messageRepo repository.MessageRepository) MessageUsecase {
	return &messageUsecaseImpl{messageRepo: messageRepo}
}
