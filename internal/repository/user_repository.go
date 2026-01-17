package repository

import (
	"context"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type userRepositoryImpl struct {
	db *pgxpool.Pool
}

func (u *userRepositoryImpl) Create(ctx context.Context, req request.CreateUserRequest) error {
	_, err := u.db.Exec(ctx, "INSERT INTO users (username) VALUES ($1)", req.Username)
	if err != nil {
		return err
	}
	return nil
}

func (u *userRepositoryImpl) FindAll(ctx context.Context) (
	[]response.UserResponse,
	error,
) {
	rows, err := u.db.Query(
		ctx,
		"SELECT id, username, COALESCE(display_name, ''), COALESCE(avatar, ''), COALESCE(status::text, 'offline') FROM users",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []response.UserResponse
	for rows.Next() {
		var user response.UserResponse
		err := rows.Scan(&user.ID, &user.Username, &user.DisplayName, &user.Avatar, &user.Status)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (u *userRepositoryImpl) FindByID(ctx context.Context, id string) (
	response.DetailUserResponse,
	error,
) {
	var user response.DetailUserResponse
	var createdAt time.Time
	var lastSeen *time.Time
	if err := u.db.QueryRow(
		ctx,
		"SELECT id, username, COALESCE(display_name, ''), COALESCE(avatar, ''), COALESCE(status::text, 'offline'), created_at, last_seen FROM users WHERE id = $1",
		id,
	).Scan(
		&user.ID,
		&user.Username,
		&user.DisplayName,
		&user.Avatar,
		&user.Status,
		&createdAt,
		&lastSeen,
	); err != nil {
		return user, err
	}

	user.CreatedAt = createdAt.Format(time.RFC3339)
	if lastSeen != nil {
		user.LastSeen = lastSeen.Format(time.RFC3339)
	}

	return user, nil
}

func NewUserRepository(db *pgxpool.Pool) UserRepository {
	return &userRepositoryImpl{
		db: db,
	}
}
