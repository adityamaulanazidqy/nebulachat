DATABASE_URL := $(shell sed -n 's/^DATABASE_URL=//p' .env | tr -d '"' | tr -d "'")

run:
	go run ./app/main.go
check-db:
	@echo "Database URL: $(DATABASE_URL)"

migrate-up:
	migrate -path ./migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path ./migrations -database "$(DATABASE_URL)" down

migrate-force:
	migrate -path ./migrations -database "$(DATABASE_URL)" force 1