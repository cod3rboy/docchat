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

# Updates application version in the configuration
define prepare_version
	@echo "Prepare DocChat Version: $(1)"
	@jq '.info.productVersion = "$(1)" | .mac.bundle.version = "$(1)"' wails.json > wails.tmp.json
	@mv wails.tmp.json wails.json
endef

APP_VERSION := dev
APP_BUILD := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

build-app:
ifdef version
	$(eval APP_VERSION = $(version))
endif
	$(call prepare_version,$(APP_VERSION))
	wails build -tags=webkit2_41 -ldflags="-X main.version=$(APP_VERSION) -X main.build=$(APP_BUILD)"

build-run: build-app
	build/bin/DocChat
