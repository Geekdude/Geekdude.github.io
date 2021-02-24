---
title: Moving Website from web.eecs.utk.edu to Github.io
toc: false
toc_sticky: false
categories: [Tech]
tags: [Website]
header:
    image: /assets/images/website-move-header.png
    teaser: /assets/images/website-move-teaser.png
---

After graduating last May, I decided to migrate [my website]({% post_url 2019-01-24-new-website %}) from hosting on the EECS servers at UTK to [GitHub Pages](https://pages.github.com/).
I always planned on migrating to GitHub pages post-graduation; that was one reason I chose to build my website using [Jekyll](https://jekyllrb.com/).
GitHub pages can host any static website, but it is designed to build and work with Jekyll sites automatically.
I wanted to migrate my website properly with correct redirection and Search Engine Optimization (SEO).
Overall the process was relatively easy, but I did run into some issues, primarily with the customizations I have done to the website.
This post will cover the overall steps I took and also the issues and workarounds I encountered.

## Moving the site to GitHub
Previously I have been hosting my repository as a private repo in [bitbucket](https://bitbucket.org/).
I decided to move the repository to a public [GitHub](https://github.com/) repo since I used GitHub pages for hosting.
At first, I tried just to move my repository over directly and use GitHub's built-in building of Jekyll.
However, this auto-building feature only supports a [subset of Jekyll plugins](https://docs.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll#plugins).
The plugin I use for pagination, [Jekyll Paginate V2](https://github.com/sverrirs/jekyll-paginate-v2), is not one of the supported plugins.
This limitation means that the built-in building would not work for my site without changing the plugins I use.

I then tried to build the site automatically with GitHub Actions, but I had trouble getting the site to build using a docker image with the build action.
While looking into the build issues, I realized my website would not build with the newest versions of Jekyll and [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/).
By finding a copy of the Gemfile.lock file I used to build the website with last, I was able to roll back to the old versions and build my website correctly again.
Again, the issue was related to the custom template files I created to use Paginate V2 for my home pages and article pages.
The trouble with Jekyll and extension versions leads me to an important lessons learned:
**Store the Gemfile.lock in version control so that you can diagnose issues caused by building with newer versions of the tools and extensions.**
I was lucky and could just pull the lock file from my backups which saved me extra debugging time.

Since I like the way my website looks and I didn't want to spend extra time porting my template to the newer version, I decided to keep building the website locally and uploading the static site for hosting.
Luckily GitHub Pages supports this flow.
The static website can be uploaded to the main branch or a branch called gh-pages.
Actually, the branch and path can be chosen under Settings -> Options -> GitHub Pages, so any location can be used for the source.
At first, I tested uploading the built website to the main branch, and the website was hosted as expected.
But I then decided to host the website's source in the main branch and a gh-pages branch to host the built website.
To make the whole process simpler, I wanted to update my deploy script to build and deploy the website to a branch in the repository.
At first, I was hesitant to store the built files in the repo, but since the files are in an orphaned branch, they are separate from the main branch.
The orphan branch (as opposed to a folder in the main branch) will make cleaning the files up easier, if they get too large.

Luckily updating the build script was easy since I found a [Git Directory Deploy](https://github.com/X1011/git-directory-deploy) script that I could leverage to copy the built site directory to a separate orphaned git branch.
Now [my deploy script](https://github.com/Geekdude/Geekdude.github.io/blob/master/deploy.sh) just calls a [customized version of the git deploy script](https://github.com/Geekdude/Geekdude.github.io/blob/master/deploy_github.sh) with the variables filled in for my site.
Previously it would use rsync to copy the build files to the EECS servers website folder.

Since I decided to use the same local build then deploy setup, minimal changes were needed to the site itself.
I updated the site URL in [_config.yml](https://github.com/Geekdude/Geekdude.github.io/blob/master/_config.yml) as well as updated the previously mentioned deploy scripts.
That was all that was required to migrate the site and start hosting on GitHub Pages. The source code for the site can be found at [https://github.com/Geekdude/Geekdude.github.io](https://github.com/Geekdude/Geekdude.github.io).

## Setting up redirection
The next step was to set up redirection from the old URL to the new URL.
After looking into redirection, I discovered that I wanted to use redirection with the permanent redirection status (301) which indicates that the resource has moved permanently.
From various posts, I learned that a `.htaccess` file is used on linux servers to specify server-level redirects.
I had trouble finding the correct redirect commands until I read the [Apache Documentation for Redirect](https://httpd.apache.org/docs/2.4/mod/mod_alias.html#redirect) and [RedirectMatch](https://httpd.apache.org/docs/2.4/mod/mod_alias.html#redirectmatch).
The trouble I ran into was how to correctly map from a folder on a domain to a domain (i.e. /~ayoung48 to /).

The `.htaccess` file that ended up working properly is 

    RedirectMatch 301 "/~ayoung48/(.*)" "https://Geekdude.github.io/$1"

This redirect match command would correctly redirect pages from the old site to the new site.
I will leave up this redirection until I lose access to the UTK servers.

## Search Engine Optimization
Since the redirection was setup in the previous section, updating the search optimization is easier.
I added the new site to [Google Search Console](https://search.google.com/search-console/about) and [Microsoft Webmaster Tools](https://www.bing.com/webmasters).
There did not seem to be an explicit place to let them know about the move[^1], but with redirection and having both sites listed under my account, I hope their web crawler will figure it out.
I do not even need to redo the website verification method since it was already done for the old address.

[^1]: There was one for google but it required Domain level property types, not URL Prefix like I am using.

## Moving Comments
Moving comments with Discus was easy as well.
Since I have 301 redirection set up, I could just go into Admin -> Moderate Comments -> Tools -> Migration Tools and use the Redirect Crawler.
Then Discus ported the two comments I had on my old site to the new site.
I also discovered that I am not getting email notifications when people comment.
I will need to look into why.
The settings are correctly set.

