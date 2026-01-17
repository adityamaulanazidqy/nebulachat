package http

import (
	"encoding/json"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/usecase"
	"net/http"
	"strings"
)

type MessageHandler struct {
	messageUsecase usecase.MessageUsecase
}

func NewMessageHandler(messageUsecase usecase.MessageUsecase) *MessageHandler {
	return &MessageHandler{messageUsecase: messageUsecase}
}

func (h *MessageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/chats/") && strings.HasSuffix(r.URL.Path, "/messages") {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) == 3 {
			chatID := parts[1]
			if r.Method == http.MethodGet {
				h.GetMessages(w, r, chatID)
				return
			}
			if r.Method == http.MethodPost {
				h.SendMessage(w, r, chatID)
				return
			}
		}
	}

	http.NotFound(w, r)
}

func (h *MessageHandler) SendMessage(w http.ResponseWriter, r *http.Request, chatID string) {
	var req request.SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.messageUsecase.SendMessage(r.Context(), chatID, req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Message sent successfully"})
}

func (h *MessageHandler) GetMessages(w http.ResponseWriter, r *http.Request, chatID string) {
	messages, err := h.messageUsecase.GetChatMessages(r.Context(), chatID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(messages)
}
