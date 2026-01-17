package http

import (
	"encoding/json"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/usecase"
	"net/http"
	"strings"
)

type UserHandler struct {
	userUsecase usecase.UserUsecase
}

func NewUserHandler(userUsecase usecase.UserUsecase) *UserHandler {
	return &UserHandler{userUsecase: userUsecase}
}

func (h *UserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/users" || r.URL.Path == "/users/" {
		if r.Method == http.MethodGet {
			h.FindAll(w, r)
			return
		}
		if r.Method == http.MethodPost {
			h.Create(w, r)
			return
		}
	}

	if strings.HasPrefix(r.URL.Path, "/users/") {
		if r.Method == http.MethodGet {
			h.FindByID(w, r)
			return
		}
	}

	http.NotFound(w, r)
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req request.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.userUsecase.Register(r.Context(), req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func (h *UserHandler) FindAll(w http.ResponseWriter, r *http.Request) {
	users, err := h.userUsecase.GetAllUsers(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"users":   users,
		"message": "Users retrieved successfully",
	})
}

func (h *UserHandler) FindByID(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/users/")
	user, err := h.userUsecase.GetUserByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user)
}
