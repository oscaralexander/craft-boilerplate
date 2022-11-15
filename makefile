init:
	PROJECT_NAME ?= $(shell bash -c 'read -p "Project name: " project_name; echo $$project_name')
	ddev config --project-name=$(PROJECT_NAME) --project-type=craftcms
	ddev start
	ddev composer install
	ddev php craft setup/security-key
	ddev snapshot restore --latest
	ddev exec npm install
	@echo "\n——————————\n"
	@echo "🚀 Project running at: https://${PROJECT_NAME}.ddev.site"
	@echo "🔒 Craft CMS admin at: https://${PROJECT_NAME}.ddev.site/admin"
	@echo "🔑 Username: admin, password: Ch@ngeTh1sASAP!"

destroy:
	ddev delete --omit-snapshot