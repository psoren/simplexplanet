.PHONY: install dev build clean deploy preview screenshot

# Default target
all: install

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Preview production build
preview:
	npm run preview

# Deploy to GitHub Pages
deploy: build
	npm run deploy

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules

# Run tests
test:
	npm run test

# Format code
format:
	npm run format

# Lint code
lint:
	npm run lint

# Help command
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev       - Start development server"
	@echo "  make build     - Build for production"
	@echo "  make preview   - Preview production build"
	@echo "  make deploy    - Deploy to GitHub Pages"
	@echo "  make clean     - Clean build artifacts"
	@echo "  make test      - Run tests"
	@echo "  make format    - Format code"
	@echo "  make lint      - Lint code"
	@echo "  make help      - Show this help message"

# Take a screenshot
screenshot:
	node capture.js 