package domain

import (
	"time"

	"github.com/google/uuid"
)

type MessageStatus string

const (
	MessageStatusSending MessageStatus = "sending"
	MessageStatusSent    MessageStatus = "sent"
	MessageStatusError   MessageStatus = "error"
)

type Message struct {
	ID            uuid.UUID
	ChatSessionID string
	SenderID      *uuid.UUID
	SenderName    string
	Text          *string
	Timestamp     time.Time
	Status        MessageStatus
	Avatar        *string
	Metadata      map[string]interface{}
	ReplyTo       *uuid.UUID
	CreatedAt     time.Time
}
