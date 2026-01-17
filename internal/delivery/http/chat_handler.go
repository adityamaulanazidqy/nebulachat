package http

import (
	"encoding/json"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/usecase"
	"net/http"
	"strings"
)

type ChatHandler struct {
	chatUsecase usecase.ChatUsecase
}

func NewChatHandler(chatUsecase usecase.ChatUsecase) *ChatHandler {
	return &ChatHandler{chatUsecase: chatUsecase}
}

func (h *ChatHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/chats" || r.URL.Path == "/chats/" {
		if r.Method == http.MethodGet {
			h.FindAll(w, r)
			return
		}
		if r.Method == http.MethodPost {
			h.Create(w, r)
			return
		}
	}

	if strings.HasPrefix(r.URL.Path, "/chats/") {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) == 2 {
			// /chats/:id
			if r.Method == http.MethodGet {
				h.FindByID(w, r, parts[1])
				return
			}
		}
		if len(parts) == 3 && parts[2] == "participants" {
			// /chats/:id/participants
			if r.Method == http.MethodGet {
				h.FindParticipants(w, r, parts[1])
				return
			}
			if r.Method == http.MethodPost {
				h.AddParticipant(w, r, parts[1])
				return
			}
		}
	}

	http.NotFound(w, r)
}

func (h *ChatHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req request.CreateChatSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.chatUsecase.CreateChat(r.Context(), req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Chat created successfully"})
}

func (h *ChatHandler) FindAll(w http.ResponseWriter, r *http.Request) {
	chats, err := h.chatUsecase.GetAllChats(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(chats)
}

func (h *ChatHandler) FindByID(w http.ResponseWriter, r *http.Request, id string) {
	chat, err := h.chatUsecase.GetChatByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(chat)
}

func (h *ChatHandler) AddParticipant(w http.ResponseWriter, r *http.Request, chatID string) {
	var req request.AddParticipantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.chatUsecase.AddParticipant(r.Context(), chatID, req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Participant added successfully"})
}

func (h *ChatHandler) FindParticipants(w http.ResponseWriter, r *http.Request, chatID string) {
	participants, err := h.chatUsecase.GetParticipants(r.Context(), chatID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(participants)
}
