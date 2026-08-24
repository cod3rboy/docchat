install-tools:
	@echo "Install: wails"
	go install github.com/wailsapp/wails/v2/cmd/wails@latest
	@echo "Done: wails"
	@echo "Install: sqlc"
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	@echo "Done: sqlc"
	@echo "Install: goose"
	go install github.com/pressly/goose/v3/cmd/goose@latest
	@echo "Done: goose"
	@echo "All tools are installed!"

migration:
ifdef name
	goose -dir internal/db/migrations create ${name} sql
else
	@echo "name=<migration_name> is not specified"
endif
