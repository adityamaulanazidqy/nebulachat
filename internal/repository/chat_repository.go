package repository

import (
	"context"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type chatRepositoryImpl struct {
	db *pgxpool.Pool
}

func (c *chatRepositoryImpl) Create(ctx context.Context, req request.CreateChatSessionRequest) error {
	_, err := c.db.Exec(
		ctx,
		"INSERT INTO chat_sessions (id, name, type, description, is_public) VALUES ($1, $2, $3, $4, $5)",
		req.ID, req.Name, req.Type, req.Description, req.IsPublic,
	)
	return err
}

func (c *chatRepositoryImpl) FindAll(ctx context.Context) (
	[]response.ChatSessionResponse,
	error,
) {
	rows, err := c.db.Query(
		ctx,
		"SELECT id, name, type, COALESCE(description, ''), COALESCE(avatar, ''), COALESCE(status, 'offline'), is_public, created_at FROM chat_sessions",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chats []response.ChatSessionResponse
	for rows.Next() {
		var chat response.ChatSessionResponse
		var createdAt time.Time
		err := rows.Scan(
			&chat.ID,
			&chat.Name,
			&chat.Type,
			&chat.Description,
			&chat.Avatar,
			&chat.Status,
			&chat.IsPublic,
			&createdAt,
		)
		if err != nil {
			return nil, err
		}
		chat.CreatedAt = createdAt.Format(time.RFC3339)
		chats = append(chats, chat)
	}
	return chats, nil
}

func (c *chatRepositoryImpl) FindByID(ctx context.Context, id string) (
	response.ChatSessionResponse,
	error,
) {
	var chat response.ChatSessionResponse
	var createdAt time.Time
	err := c.db.QueryRow(
		ctx,
		"SELECT id, name, type, COALESCE(description, ''), COALESCE(avatar, ''), COALESCE(status, 'offline'), is_public, created_at FROM chat_sessions WHERE id = $1",
		id,
	).Scan(&chat.ID, &chat.Name, &chat.Type, &chat.Description, &chat.Avatar, &chat.Status, &chat.IsPublic, &createdAt)
	if err != nil {
		return chat, err
	}
	chat.CreatedAt = createdAt.Format(time.RFC3339)
	return chat, nil
}

func (c *chatRepositoryImpl) AddParticipant(ctx context.Context, chatID string, req request.AddParticipantRequest) error {
	_, err := c.db.Exec(
		ctx,
		"INSERT INTO chat_participants (chat_session_id, user_id, is_admin) VALUES ($1, $2, $3)",
		chatID, req.UserID, req.IsAdmin,
	)
	return err
}

func (c *chatRepositoryImpl) FindParticipants(ctx context.Context, chatID string) (
	[]response.ParticipantResponse,
	error,
) {
	rows, err := c.db.Query(
		ctx,
		`SELECT cp.user_id, u.username, cp.is_admin, cp.joined_at 
		 FROM chat_participants cp 
		 JOIN users u ON cp.user_id = u.id 
		 WHERE cp.chat_session_id = $1`,
		chatID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var participants []response.ParticipantResponse
	for rows.Next() {
		var p response.ParticipantResponse
		var joinedAt any
		err := rows.Scan(&p.UserID, &p.Username, &p.IsAdmin, &joinedAt)
		if err != nil {
			return nil, err
		}
		participants = append(participants, p)
	}
	return participants, nil
}

func NewChatRepository(db *pgxpool.Pool) ChatRepository {
	return &chatRepositoryImpl{db: db}
}
