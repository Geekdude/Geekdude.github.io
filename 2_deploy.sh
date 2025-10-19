#!/bin/bash
#-------------------------------------------------------------------------------
# Script to deploy the website to Github.
#-------------------------------------------------------------------------------

# Build Jekyll Site
JEKYLL_ENV=production bundle exec jekyll build
chmod -R a+rX _site

echo 'Deploy to Github using deploy_github.sh'
bash ./deploy_github.sh
