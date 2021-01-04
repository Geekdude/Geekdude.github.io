#!/bin/bash
#-------------------------------------------------------------------------------
# Script to deploy the website to hydra.
#-------------------------------------------------------------------------------

# Variables
instancehost="hydra10.eecs.utk.edu"
remotewebroot="www-home"

# Build Jekyll Site
JEKYLL_ENV=production bundle exec jekyll build
chmod -R a+rX _site

echo "rsync to SSH host $instancehost ..."

# Long form of rsync options
# rsync --verbose --recursive --compress --checksum --human-readable --perms --delete-after
rsync -vrzchp --delete-after _site/ $instancehost:$remotewebroot
