# Aaron's Personal Website

This repository contains the source for a Jekyll powered personal website for 
Aaron Young hosted at [Geekdude.github.io](Geekdude.github.io). If you have any questions about the source please contact me at 
[ayoung3210@gmail.com](mailto:ayoung3210@gmail.com).

## Prerequisites

[Jekyll](https://jekyllrb.com/docs/installation/) must be install first before building the website.

Next the gems used by the site must be installed with 

    bundle install

## Serving the website locally for testing

In order to serve the website locally on a test server, with draft posts 
included, and with live reloading, use the command:

    bundle exec jekyll serve --drafts --livereload

## Deploying the website

In order to deploy the website, use the helper script `deploy.sh`.

## Add icon line to gem source

In order to add the icon line into the gem source, so that favicons display 
correctly, run the script title `update_feed_gem.sh`. Run this script before 
testing and deploying the website so that the favicon appears correctly.

Note: There still seems to be an issue with this approach with RSS Feed Reader.

## Updating Jekyll

In order to update Jekyll use `bundle update`

## Tools

- A create-thumbnails script is found in tools/create-thumbnails. It 
  can be used to create lower resolution thumbnails for use in a Jekyll 
  gallery.
