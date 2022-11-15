init:
	@cp .ddev/config.example.yaml .ddev/config.yaml
	$(eval PROJECT_NAME = $(shell bash -c 'read -p "Project name: " project_name; echo $$project_name'))
	ddev config --project-name=$(PROJECT_NAME) --project-type=craftcms
	ddev start
	ddev composer install
	ddev php craft setup/security-key
	ddev snapshot restore --latest
	ddev exec npm install
	$(eval PROJECT_URL = $(shell ddev describe | grep "Project: " | awk '{print $$5}'))
	@echo "\n——————————\n"
	@echo "🌎 $(PROJECT_URL)"
	@echo "🔒 $(PROJECT_URL)/admin"
	@echo "🔑 Username: admin, password: Ch@ngeTh1sASAP!"

destroy:
	ddev delete --omit-snapshot
