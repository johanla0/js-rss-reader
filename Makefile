BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

branch:
	git checkout $(ARGS) > /dev/null 2>&1 || git checkout -b $(ARGS)
build:
	npm run build
dev:
	npm run dev
history:
	git log
install:
	install-deps
install-deps:
	npm ci
lint:
	npx eslint .
publish:
	npm publish --dry-run
pull:
	git pull origin $(BRANCH)
push:
	git push origin $(BRANCH)
test:
	npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
uncommit:
	git reset --soft HEAD^
upd:
	git merge master --no-edit

.PHONY: test