init: install info

info:
	$(eval PROJECT_URL = $(shell ddev describe | grep "Project: " | awk '{print $$5}'))
	@echo "\n——————————\n"
	@echo "🌎 https://$(PROJECT_NAME).ddev.site/"
	@echo "🔒 https://$(PROJECT_NAME).ddev.site/admin"
	@echo "🔑 Username: admin, password: Ch@ngeTh1sASAP!"

install:
	$(eval PROJECT_NAME = $(shell bash -c 'read -p "Project name: " project_name; echo $$project_name'))
	ddev config --project-name=$(PROJECT_NAME) --project-type=craftcms
	ddev start
	ddev composer install
	ddev php craft setup/security-key
	ddev snapshot restore --latest
	ddev exec npm install

destroy:
	ddev delete --omit-snapshot