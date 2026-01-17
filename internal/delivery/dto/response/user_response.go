package response

import (
	"github.com/google/uuid"
)

type UserResponse struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	DisplayName string    `json:"display_name"`
	Avatar      string    `json:"avatar"`
	Status      string    `json:"status"`
}

type FindAllUsersResponse struct {
	Users   []UserResponse `json:"users"`
	Message string         `json:"message"`
}

type DetailUserResponse struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	DisplayName string    `json:"display_name"`
	Avatar      string    `json:"avatar"`
	Status      string    `json:"status"`
	CreatedAt   string    `json:"created_at"`
	LastSeen    string    `json:"last_seen"`
}
