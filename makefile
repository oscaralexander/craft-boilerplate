init:
	ddev config --project-type=craftcms
	ddev start
	ddev composer install
	ddev snapshot restore --latest
	ddev exec npm install