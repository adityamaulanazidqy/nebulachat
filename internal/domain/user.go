package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID          uuid.UUID
	Username    string
	DisplayName *string
	Avatar      *string
	Status      *string
	CreatedAt   time.Time
	LastSeen    *time.Time
}
