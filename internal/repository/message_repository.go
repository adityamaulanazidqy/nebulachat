package repository

import (
	"context"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type messageRepositoryImpl struct {
	db *pgxpool.Pool
}

func (m *messageRepositoryImpl) Create(ctx context.Context, chatID string, req request.SendMessageRequest) error {
	_, err := m.db.Exec(
		ctx,
		"INSERT INTO messages (chat_session_id, sender_id, sender_name, text, avatar, metadata, reply_to) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		chatID,
		req.SenderID,
		req.SenderName,
		req.Text,
		req.Avatar,
		req.Metadata,
		req.ReplyTo,
	)
	return err
}

func (m *messageRepositoryImpl) FindByChatID(ctx context.Context, chatID string) (
	[]response.MessageResponse,
	error,
) {
	rows, err := m.db.Query(
		ctx,
		`SELECT id::text, chat_session_id, COALESCE(sender_id::text, ''), sender_name, COALESCE(text, ''), 
		        timestamp, status::text, COALESCE(avatar, ''), metadata, COALESCE(reply_to::text, ''), created_at 
		 FROM messages WHERE chat_session_id = $1 ORDER BY timestamp ASC`,
		chatID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []response.MessageResponse
	for rows.Next() {
		var msg response.MessageResponse
		var timestamp, createdAt time.Time
		err := rows.Scan(
			&msg.ID, &msg.ChatSessionID, &msg.SenderID, &msg.SenderName, &msg.Text,
			&timestamp, &msg.Status, &msg.Avatar, &msg.Metadata, &msg.ReplyTo, &createdAt,
		)
		if err != nil {
			return nil, err
		}
		msg.Timestamp = timestamp.Format(time.RFC3339)
		msg.CreatedAt = createdAt.Format(time.RFC3339)
		messages = append(messages, msg)
	}
	return messages, nil
}

func NewMessageRepository(db *pgxpool.Pool) MessageRepository {
	return &messageRepositoryImpl{db: db}
}
