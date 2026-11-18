.PHONY: up dev install build format lint check typecheck clean validate help

help:
	@echo "Available commands:"
	@echo "  up / dev       - Start development server"
	@echo "  install        - Install dependencies"
	@echo "  build          - Build the project"
	@echo "  format         - Format code with Biome"
	@echo "  lint           - Lint code with Biome"
	@echo "  check          - Format, lint and organize imports with Biome"
	@echo "  typecheck      - Run TypeScript type checking"
	@echo "  validate       - Run check and typecheck"
	@echo "  clean          - Clean build artifacts"

up dev:
	npm run dev

install:
	npm install

build:
	npm run build

format:
	npm run format

lint:
	npm run lint

check:
	npm run check

typecheck:
	npm run typecheck

clean:
	rm -rf .next
	rm -rf node_modules/.cache

validate:
	$(MAKE) check
	$(MAKE) typecheck
