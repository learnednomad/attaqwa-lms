# =============================================================================
# Makefile - AttaqwaMasjid LMS
# =============================================================================
# Developer commands for Docker-based development and production.
# Usage: make <target>
# =============================================================================

.PHONY: help dev dev-down prod prod-down staging staging-down \
        monitoring monitoring-down backup restore health logs \
        logs-api logs-web logs-caddy clean clean-volumes build \
        ps restart shell-api shell-db validate

# Default compose files
COMPOSE_BASE    = docker-compose.yml
COMPOSE_DEV     = docker-compose.dev.yml
COMPOSE_PROD    = docker-compose.prod.yml
COMPOSE_STAGING = docker-compose.staging.yml
COMPOSE_MON     = docker-compose.monitoring.yml

# Shortcuts
DC_DEV     = docker compose -f $(COMPOSE_DEV)
DC_PROD    = docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_PROD)
DC_STAGING = docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) -f $(COMPOSE_STAGING)
DC_MON     = docker compose -f $(COMPOSE_MON)

# =============================================================================
# Help
# =============================================================================

help: ## Show this help message
	@echo ""
	@echo "AttaqwaMasjid LMS - Docker Commands"
	@echo "===================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

# =============================================================================
# Development
# =============================================================================

dev: ## Start development stack (hot-reload)
	$(DC_DEV) up -d
	@echo ""
	@echo "Development stack started:"
	@echo "  Website:  http://localhost:3001"
	@echo "  Admin:    http://localhost:3000"
	@echo "  API:      http://localhost:1337"
	@echo "  Ollama:   http://localhost:11434"
	@echo "  Postgres: localhost:5432"

dev-down: ## Stop development stack
	$(DC_DEV) down

# =============================================================================
# Production
# =============================================================================

build: ## Build all Docker images
	$(DC_PROD) build

prod: ## Start production stack (Caddy + Redis + network isolation)
	$(DC_PROD) up -d
	@echo ""
	@echo "Production stack started:"
	@echo "  Website:  http://localhost (via Caddy)"
	@echo "  Admin:    http://localhost/admin (via Caddy)"
	@echo "  API:      http://localhost/api (via Caddy)"

prod-down: ## Stop production stack
	$(DC_PROD) down

restart: ## Restart all production services
	$(DC_PROD) restart

# =============================================================================
# Staging
# =============================================================================

staging: ## Start staging stack (prod-shaped with debug ports)
	$(DC_STAGING) up -d --build
	@echo ""
	@echo "Staging stack started:"
	@echo "  Website:  http://localhost:3001 (direct) + via Caddy"
	@echo "  Admin:    http://localhost:3000 (direct) + via Caddy"
	@echo "  API:      http://localhost:1337 (direct) + via Caddy"
	@echo "  MinIO:    http://localhost:9001 (console)"
	@echo "  Postgres: localhost:5432"

staging-down: ## Stop staging stack
	$(DC_STAGING) down

# =============================================================================
# Monitoring
# =============================================================================

monitoring: ## Start monitoring stack (Prometheus + Grafana + Loki)
	$(DC_MON) up -d
	@echo ""
	@echo "Monitoring stack started:"
	@echo "  Grafana:    http://localhost:3300"
	@echo "  Prometheus: http://localhost:9090"
	@echo "  Loki:       http://localhost:3100"

monitoring-down: ## Stop monitoring stack
	$(DC_MON) down

# =============================================================================
# Backup & Restore
# =============================================================================

backup: ## Backup PostgreSQL database to ./backups/
	@mkdir -p backups
	$(DC_PROD) run --rm \
		-v $$(pwd)/backups:/backups \
		-v $$(pwd)/docker/backup:/backup:ro \
		postgres /bin/bash /backup/backup.sh

restore: ## Restore database from backup (usage: make restore FILE=backups/<file>.sql.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make restore FILE=backups/<backup_file>.sql.gz"; \
		echo ""; \
		echo "Available backups:"; \
		ls -lh backups/*.sql.gz 2>/dev/null || echo "  No backups found."; \
		exit 1; \
	fi
	$(DC_PROD) run --rm \
		-v $$(pwd)/backups:/backups \
		-v $$(pwd)/docker/backup:/backup:ro \
		postgres /bin/bash /backup/restore.sh /backups/$$(basename $(FILE))

# =============================================================================
# Health & Status
# =============================================================================

health: ## Check health of all services
	@echo "Service Health Check"
	@echo "===================="
	@echo ""
	@echo "--- Caddy (reverse proxy) ---"
	@curl -sf http://localhost/caddy-health 2>/dev/null && echo "  OK" || echo "  DOWN"
	@echo ""
	@echo "--- Website ---"
	@curl -sf -o /dev/null -w "  HTTP %{http_code}" http://localhost/ 2>/dev/null && echo " OK" || echo "  DOWN"
	@echo ""
	@echo "--- Admin ---"
	@curl -sf -o /dev/null -w "  HTTP %{http_code}" http://localhost/admin 2>/dev/null && echo " OK" || echo "  DOWN"
	@echo ""
	@echo "--- API ---"
	@curl -sf -o /dev/null -w "  HTTP %{http_code}" http://localhost/api/_health 2>/dev/null && echo " OK" || echo "  DOWN"
	@echo ""

ps: ## Show running containers and their status
	$(DC_PROD) ps

# =============================================================================
# Logs
# =============================================================================

logs: ## Tail logs from all production services
	$(DC_PROD) logs -f --tail=100

logs-api: ## Tail API logs
	$(DC_PROD) logs -f --tail=100 api

logs-web: ## Tail website logs
	$(DC_PROD) logs -f --tail=100 website

logs-caddy: ## Tail Caddy reverse proxy logs
	$(DC_PROD) logs -f --tail=100 caddy

# =============================================================================
# Shell Access
# =============================================================================

shell-api: ## Open shell in API container
	$(DC_PROD) exec api sh

shell-db: ## Open psql shell in PostgreSQL
	$(DC_PROD) exec postgres psql -U postgres -d attaqwa_lms

# =============================================================================
# Cleanup
# =============================================================================

clean: ## Remove all containers, volumes, and images
	@echo "WARNING: This will remove all containers, volumes, and built images."
	@echo "Press Ctrl+C within 5 seconds to abort..."
	@sleep 5
	$(DC_PROD) down -v --rmi local
	$(DC_DEV) down -v
	$(DC_MON) down -v
	@echo "Cleanup complete."

clean-volumes: ## Remove only Docker volumes (keeps images)
	$(DC_PROD) down -v
	$(DC_DEV) down -v

# =============================================================================
# Environment Setup
# =============================================================================

env-init: ## Generate .env from .env.example with random secrets
	@if [ -f .env ]; then \
		echo "ERROR: .env already exists. Remove it first or edit manually."; \
		exit 1; \
	fi
	@cp .env.example .env
	@echo "Generating secrets..."
	@sed -i '' \
		-e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$$(openssl rand -base64 32)|" \
		-e "s|^APP_KEYS=.*|APP_KEYS=$$(openssl rand -base64 16),$$(openssl rand -base64 16),$$(openssl rand -base64 16),$$(openssl rand -base64 16)|" \
		-e "s|^API_TOKEN_SALT=.*|API_TOKEN_SALT=$$(openssl rand -base64 32)|" \
		-e "s|^ADMIN_JWT_SECRET=.*|ADMIN_JWT_SECRET=$$(openssl rand -base64 32)|" \
		-e "s|^TRANSFER_TOKEN_SALT=.*|TRANSFER_TOKEN_SALT=$$(openssl rand -base64 32)|" \
		-e "s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=$$(openssl rand -base64 32)|" \
		-e "s|^JWT_SECRET=.*|JWT_SECRET=$$(openssl rand -base64 32)|" \
		-e "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$$(openssl rand -base64 32)|" \
		-e "s|^MINIO_ROOT_PASSWORD=.*|MINIO_ROOT_PASSWORD=$$(openssl rand -base64 32)|" \
		.env
	@echo ".env created with generated secrets."
	@echo "NOTE: STRAPI_API_TOKEN must be set manually after first Strapi login."

# =============================================================================
# Validation
# =============================================================================

validate: ## Validate all compose files
	@echo "Validating compose files..."
	@docker compose -f $(COMPOSE_BASE) config --quiet && echo "  $(COMPOSE_BASE): OK"
	@docker compose -f $(COMPOSE_DEV) config --quiet && echo "  $(COMPOSE_DEV): OK"
	@$(DC_PROD) config --quiet && echo "  $(COMPOSE_BASE) + $(COMPOSE_PROD): OK"
	@$(DC_STAGING) config --quiet && echo "  $(COMPOSE_BASE) + $(COMPOSE_PROD) + $(COMPOSE_STAGING): OK"
	@$(DC_MON) config --quiet && echo "  $(COMPOSE_MON): OK"
	@echo "All compose files valid."
