package usecase

import (
	"context"
	"errors"
	"nebulachat-server/internal/delivery/dto/request"
	"nebulachat-server/internal/delivery/dto/response"
	"nebulachat-server/internal/repository"
)

type userUsecaseImpl struct {
	userRepo repository.UserRepository
}

func (u *userUsecaseImpl) Register(ctx context.Context, req request.CreateUserRequest) error {
	if req.Username == "" {
		return errors.New("username is required")
	}
	return u.userRepo.Create(ctx, req)
}

func (u *userUsecaseImpl) GetAllUsers(ctx context.Context) (
	[]response.UserResponse,
	error,
) {
	return u.userRepo.FindAll(ctx)
}

func (u *userUsecaseImpl) GetUserByID(ctx context.Context, id string) (
	response.DetailUserResponse,
	error,
) {
	return u.userRepo.FindByID(ctx, id)
}

func NewUserUsecase(userRepo repository.UserRepository) UserUsecase {
	return &userUsecaseImpl{userRepo: userRepo}
}
