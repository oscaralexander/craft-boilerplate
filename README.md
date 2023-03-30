# Project initialization with DDEV

`ddev config --project-name={project_name} --project-type=craftcms`  
`ddev composer create -y --no-scripts --no-install craftcms/craft`  
`ddev start`  
`ddev composer install`  
`ddev snapshot restore --latest`  
`ddev craft setup/welcome`  
`ddev exec npm install`

# Database management

phpMyAdmin: https://{sitename}.ddev.site:8037 or ddev sequelpro

# Vite

Run `ddev exec npm run build` and `ddev exec npm run serve` to start the local development server with hot module reloading (HMR).

# S3 and Cloud Front setup

Consult [this tutorial](https://nystudio107.com/blog/using-aws-s3-buckets-cloudfront-distribution-with-craft-cms) for using Amazon S3 and Cloud Front for asset storage.
