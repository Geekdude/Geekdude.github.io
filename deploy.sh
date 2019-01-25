#!/bin/bash
#-------------------------------------------------------------------------------
# Script use to deploy the website to hydra.
#-------------------------------------------------------------------------------

# Variables
instancehost="hydra"
remotewebroot="www-home"

# Build Jekyll Site
JEKYLL_ENV=production bundle exec jekyll build
chmod -R a+rX _site

echo "rsync to SSH host $instancehost ..."

# rsync --verbose --recursive --compress --checksum --human-readable --perms --delete-after
rsync -vrzchp --delete-after _site/ $instancehost:$remotewebroot
