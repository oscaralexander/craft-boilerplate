PROJECT_NAME=$(shell ddev describe | grep "Project: " | awk '{ print $$3 }')

init: install info

info:
	@echo "\n"
	@echo "Site       : https://$(PROJECT_NAME).ddev.site"
	@echo "Craft CMS  : https://$(PROJECT_NAME).ddev.site/admin (admin / Ch@ngeTh1sASAP!)"
	@echo "phpMyAdmin : https://$(PROJECT_NAME).ddev.site:8037"

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