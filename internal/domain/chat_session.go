package domain

import (
	"time"
)

type ChatType string

const (
	ChatTypeChannel ChatType = "channel"
	ChatTypeDirect  ChatType = "direct"
)

type ChatSession struct {
	ID          string
	Name        string
	Type        ChatType
	Description *string
	Avatar      *string
	Status      *string
	IsPublic    bool
	Metadata    map[string]interface{}
	CreatedAt   time.Time
}
