# ============================================================================
# Makefile for Markdown to ATS CV Generator
# Professional build automation and development workflow
# ============================================================================

# Project configuration
PROJECT_NAME := cv-generator
IMAGE_NAME := $(PROJECT_NAME)
CONTAINER_NAME := $(PROJECT_NAME)-app
PORT := 8081
VERSION := latest

# Docker configuration
DOCKER_REGISTRY := 
DOCKERFILE := Dockerfile
DOCKER_CONTEXT := .

# Build targets
PRODUCTION_TARGET := production
DEVELOPMENT_TARGET := development

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# ============================================================================
# Help and Information
# ============================================================================

.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)Markdown to ATS CV Generator - Build System$(NC)"
	@echo ""
	@echo "$(YELLOW)Available targets:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Configuration:$(NC)"
	@echo "  Project Name: $(PROJECT_NAME)"
	@echo "  Image Name:   $(IMAGE_NAME)"
	@echo "  Port:         $(PORT)"
	@echo "  Version:      $(VERSION)"

.PHONY: info
info: ## Show project information
	@echo "$(BLUE)Project Information:$(NC)"
	@echo "  Name:         $(PROJECT_NAME)"
	@echo "  Version:      $(VERSION)"
	@echo "  Port:         $(PORT)"
	@echo "  Image:        $(IMAGE_NAME):$(VERSION)"
	@echo "  Container:    $(CONTAINER_NAME)"
	@echo ""
	@echo "$(BLUE)Docker Status:$(NC)"
	@docker --version 2>/dev/null || echo "  Docker: Not installed"
	@docker-compose --version 2>/dev/null || echo "  Docker Compose: Not installed"

# ============================================================================
# Development Commands
# ============================================================================

.PHONY: install
install: ## Install Node.js dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

.PHONY: dev
dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(NC)"
	npm run server:dev

.PHONY: start
start: ## Start production server locally
	@echo "$(BLUE)Starting production server...$(NC)"
	npm run server

.PHONY: cli
cli: ## Show CLI help
	npm start

.PHONY: generate
generate: ## Generate CV from template (CLI)
	@echo "$(BLUE)Generating CV from template...$(NC)"
	npm run generate template.md

# ============================================================================
# Docker Build Commands
# ============================================================================

.PHONY: build
build: ## Build production Docker image
	@echo "$(BLUE)Building production Docker image...$(NC)"
	docker build \
		--target $(PRODUCTION_TARGET) \
		--tag $(IMAGE_NAME):$(VERSION) \
		--tag $(IMAGE_NAME):latest \
		--build-arg BUILD_DATE="$(shell date -u +'%Y-%m-%dT%H:%M:%SZ')" \
		--build-arg VCS_REF="$(shell git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
		$(DOCKER_CONTEXT)
	@echo "$(GREEN)Production image built successfully!$(NC)"

.PHONY: build-dev
build-dev: ## Build development Docker image
	@echo "$(BLUE)Building development Docker image...$(NC)"
	docker build \
		--target $(DEVELOPMENT_TARGET) \
		--tag $(IMAGE_NAME):dev \
		--build-arg BUILD_DATE="$(shell date -u +'%Y-%m-%dT%H:%M:%SZ')" \
		--build-arg VCS_REF="$(shell git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
		$(DOCKER_CONTEXT)
	@echo "$(GREEN)Development image built successfully!$(NC)"

.PHONY: rebuild
rebuild: clean build ## Clean and rebuild production image

.PHONY: rebuild-dev
rebuild-dev: clean build-dev ## Clean and rebuild development image

# ============================================================================
# Docker Run Commands
# ============================================================================

.PHONY: run
run: ## Run production container
	@$(MAKE) stop 2>/dev/null || true
	@echo "$(BLUE)Starting production container...$(NC)"
	@mkdir -p data/uploads
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart unless-stopped \
		-p $(PORT):8081 \
		-e NODE_ENV=production \
		-e PORT=8081 \
		-v "$(PWD)/data/uploads:/app/public/uploads" \
		-v "$(PWD)/template.md:/app/template.md:ro" \
		--security-opt no-new-privileges:true \
		--memory="512m" \
		--cpus="0.5" \
		$(IMAGE_NAME):latest
	@echo "$(GREEN)Container started successfully!$(NC)"
	@echo "$(BLUE)Application URL: http://localhost:$(PORT)$(NC)"

.PHONY: run-dev
run-dev: ## Run development container
	@$(MAKE) stop 2>/dev/null || true
	@echo "$(BLUE)Starting development container...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):8081 \
		-e NODE_ENV=development \
		-e PORT=8081 \
		-v "$(PWD)/src:/app/src:ro" \
		-v "$(PWD)/public:/app/public" \
		-v "$(PWD)/template.md:/app/template.md:ro" \
		$(IMAGE_NAME):dev
	@echo "$(GREEN)Development container started successfully!$(NC)"
	@echo "$(BLUE)Application URL: http://localhost:$(PORT)$(NC)"

# ============================================================================
# Docker Compose Commands
# ============================================================================

.PHONY: up
up: ## Start services with Docker Compose (production)
	@echo "$(BLUE)Starting production services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services started successfully!$(NC)"
	@echo "$(BLUE)Application URL: http://localhost:$(PORT)$(NC)"

.PHONY: up-dev
up-dev: ## Start services with Docker Compose (development)
	@echo "$(BLUE)Starting development services...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
	@echo "$(GREEN)Development services started successfully!$(NC)"
	@echo "$(BLUE)Application URL: http://localhost:$(PORT)$(NC)"

.PHONY: down
down: ## Stop all Docker Compose services
	@echo "$(BLUE)Stopping all services...$(NC)"
	docker-compose down
	@echo "$(GREEN)All services stopped!$(NC)"

.PHONY: restart
restart: down up ## Restart all services

.PHONY: restart-dev
restart-dev: down up-dev ## Restart development services

# ============================================================================
# Container Management
# ============================================================================

.PHONY: stop
stop: ## Stop and remove the container
	@echo "$(BLUE)Stopping container...$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(GREEN)Container stopped and removed!$(NC)"

.PHONY: logs
logs: ## Show container logs
	@echo "$(BLUE)Container logs:$(NC)"
	docker logs $(CONTAINER_NAME) --tail 50 -f

.PHONY: logs-compose
logs-compose: ## Show Docker Compose logs
	@echo "$(BLUE)Services logs:$(NC)"
	docker-compose logs -f

.PHONY: shell
shell: ## Open shell in running container
	@echo "$(BLUE)Opening shell in container...$(NC)"
	docker exec -it $(CONTAINER_NAME) /bin/sh

.PHONY: status
status: ## Show container status
	@echo "$(BLUE)Container status:$(NC)"
	@docker ps -f name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "No containers running"

# ============================================================================
# Health and Testing
# ============================================================================

.PHONY: health
health: ## Check application health
	@echo "$(BLUE)Checking application health...$(NC)"
	@curl -s http://localhost:$(PORT)/api/health | jq '.' 2>/dev/null || \
		curl -s http://localhost:$(PORT)/api/health || \
		echo "$(RED)Health check failed - is the application running?$(NC)"

.PHONY: test-endpoints
test-endpoints: ## Test all API endpoints
	@echo "$(BLUE)Testing API endpoints...$(NC)"
	@echo "Health check:"
	@curl -s http://localhost:$(PORT)/api/health || echo "$(RED)Failed$(NC)"
	@echo ""
	@echo "API info:"
	@curl -s http://localhost:$(PORT)/api || echo "$(RED)Failed$(NC)"
	@echo ""
	@echo "Template download:"
	@curl -s -I http://localhost:$(PORT)/api/template | head -1 || echo "$(RED)Failed$(NC)"

# ============================================================================
# Cleanup Commands
# ============================================================================

.PHONY: clean
clean: ## Remove Docker images and containers
	@echo "$(BLUE)Cleaning up Docker resources...$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(VERSION) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):latest 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):dev 2>/dev/null || true
	@echo "$(GREEN)Cleanup completed!$(NC)"

.PHONY: clean-all
clean-all: ## Remove all Docker resources including volumes
	@echo "$(BLUE)Performing deep cleanup...$(NC)"
	@$(MAKE) down 2>/dev/null || true
	@$(MAKE) clean 2>/dev/null || true
	@docker system prune -f
	@docker volume prune -f
	@echo "$(GREEN)Deep cleanup completed!$(NC)"

.PHONY: clean-uploads
clean-uploads: ## Clean uploaded files
	@echo "$(BLUE)Cleaning uploaded files...$(NC)"
	@rm -rf data/uploads/*
	@mkdir -p data/uploads
	@echo "$(GREEN)Upload directory cleaned!$(NC)"

# ============================================================================
# Production Deployment
# ============================================================================

.PHONY: deploy-prod
deploy-prod: ## Deploy to production
	@echo "$(BLUE)Deploying to production...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)Production deployment completed!$(NC)"

.PHONY: deploy-down
deploy-down: ## Stop production deployment
	@echo "$(BLUE)Stopping production deployment...$(NC)"
	docker-compose -f docker-compose.prod.yml down
	@echo "$(GREEN)Production deployment stopped!$(NC)"

# ============================================================================
# Utility Commands
# ============================================================================

.PHONY: setup
setup: ## Initial project setup
	@echo "$(BLUE)Setting up project...$(NC)"
	@mkdir -p data/uploads
	@chmod 755 data/uploads
	@$(MAKE) install
	@echo "$(GREEN)Project setup completed!$(NC)"

.PHONY: check-deps
check-deps: ## Check if required dependencies are installed
	@echo "$(BLUE)Checking dependencies...$(NC)"
	@command -v docker >/dev/null 2>&1 || (echo "$(RED)Docker is not installed$(NC)" && exit 1)
	@command -v docker-compose >/dev/null 2>&1 || (echo "$(RED)Docker Compose is not installed$(NC)" && exit 1)
	@command -v node >/dev/null 2>&1 || (echo "$(YELLOW)Node.js is not installed (optional for Docker)$(NC)")
	@command -v npm >/dev/null 2>&1 || (echo "$(YELLOW)npm is not installed (optional for Docker)$(NC)")
	@echo "$(GREEN)Dependencies check completed!$(NC)"

# ============================================================================
# Development Workflow
# ============================================================================

.PHONY: dev-setup
dev-setup: check-deps setup build-dev ## Complete development setup

.PHONY: quick-start
quick-start: build run ## Quick start for production

.PHONY: quick-dev
quick-dev: build-dev run-dev logs ## Quick start for development with logs