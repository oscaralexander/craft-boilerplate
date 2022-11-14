# Project initialization with DDEV
ddev config --project-type=craftcms
ddev composer create -y --no-scripts --no-install craftcms/craft
ddev start
ddev composer install
ddev snapshot restore --latest
// ddev craft setup/welcome
ddev exec npm install

# Database management
phpMyAdmin: https://{sitename}.ddev.site:8037
or ddev sequelpro

# Vite
Run `ddev exec npm run build` and `ddev exec npm run serve` to start the local development server with hot module reloading (HMR).