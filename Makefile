.PHONY: test test\:e2e

test:
	@npm run smartart:pipeline

test\:e2e:
	@if [ ! -d node_modules/@playwright/test ]; then \
		echo "Installing @playwright/test..."; \
		npm install --no-save --no-package-lock @playwright/test@1.52.0; \
	fi
	@if [ "$$CI" = "true" ]; then \
		npx playwright install --with-deps chromium; \
	else \
		npx playwright install chromium; \
	fi
	@npm run smartart:smoke
