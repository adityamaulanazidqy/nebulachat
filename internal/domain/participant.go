package domain

import (
	"time"

	"github.com/google/uuid"
)

type ChatParticipant struct {
	ID            uuid.UUID
	ChatSessionID string
	UserID        uuid.UUID
	IsAdmin       bool
	JoinedAt      time.Time
}
