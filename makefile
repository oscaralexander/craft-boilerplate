PROJECT_NAME ?= $(shell bash -c 'read -p "Project name: " project_name; echo $$project_name')

init:
	ddev config --project-name=$(PROJECT_NAME) --project-type=craftcms
	ddev start
	ddev composer install
	ddev php craft setup/security-key
	ddev snapshot restore --latest
	ddev exec npm install
	NAME ?= $(shell ddev describe | grep "Project: " | awk '{print $3}')
	@echo "\n——————————\n"
	@echo "🚀 Project running at: https://${NAME}.ddev.site"
	@echo "🔒 Craft CMS admin at: https://${NAME}.ddev.site/admin"
	@echo "🔑 Username: admin - Password: Ch@ngeTh1sASAP!"

destroy:
	ddev delete --omit-snapshot