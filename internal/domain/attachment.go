package domain

import (
	"time"

	"github.com/google/uuid"
)

type Attachment struct {
	ID          uuid.UUID
	MessageID   uuid.UUID
	Name        string
	ContentType *string
	Size        *int
	Data        []byte
	DataBase64  *string
	URL         *string
	CreatedAt   time.Time
}
