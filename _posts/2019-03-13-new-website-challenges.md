---
title: Challenges with New Website Deployment (Jekyll and Subdomains)
categories: [Tech]
tags: [Website]
---

When I was deploying my website to the web server, I ran into a few challenges. 
I will talk about them here in case anyone happens to run into similar 
challenges.

## SVG Graphical Issues
One issue that stood out was how chrome was rendering my SVG graphics. I 
created the graphics with Inkscape and when they were displayed through Chrome, 
some of the graphics had noticeable issues. The main problem was unsupported 
fonts and Inkscape specific SVG features. I assumed the problems would only be 
worse if I tested with multiple browsers, so to fix the issue, I converted all 
of my SVG graphics to PNG images. I figured that the PNG images would be able 
to be rendered properly regardless of the browser. Although this means that the 
quality of the vector graphics is reduced, I think it is still a better 
solution than having graphics that look incorrect. I could take the effort make 
sure I only use standard SVG elements, that any viewer should recognize, but 
that seemed like too much work to get right when PNG images already work well 
enough.

## Deploying to a Subdomain of a Site
The biggest issue came from the fact that I deployed the website to a subdomain 
of the site (i.e. my site lives at `http://web.eecs.utk.edu/~ayoung48/` and not 
`http://web.eecs.utk.edu/`). This resulted in all of my assets referenced from 
markdown pages resulting in broken links, as the browser would try to find the 
asset at the root of the site and not at the root of the subdomain 
`/~ayoung48/`. However, I couldn't just append the subdomain to each of the 
hyperlinks, as doing so would break the ability to test the site locally. 
Luckily Jekyll already has a solution for this problem. Since the situation of 
deploying to a subdomain is less common, it was harder to find good information 
explaining the solution.

The first website I used to fix the issue was the [Minimal Mistakes 
Configuration Documentation](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#site-base-url).
The configuration setting I needed to set was the site-base-url. This setting 
specifies the subdomain of the site the website is deployed to. In my case, the 
site-base-url is `/~ayoung48`. With this configuration change, the correct 
subdomain is used when I serve the website locally for testing. 
[Parker](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/) 
provides a brief explanation into base url, if you would like further 
clarification. This change still didn't fix the links, but resolved the local 
deployment testing.

To fix the links, I had help from the [liquid 
filters](https://jekyllrb.com/docs/liquid/filters/) and [liquid 
tags](https://jekyllrb.com/docs/liquid/tags/) documentation pages. To 
summarize, there are multiple was to have liquid fill in the correct url (with 
the baseurl) for you. I'm going to explain each method using the old website 
image found in the previous post. One method is to use the prepend filter:
{% raw %}
```liquid
![Old Website]({{ '/assets/images/old_website.png' | prepend:site.baseurl }})
```
This method is OK, it just prepends the string found in site.baseurl to the 
url, but there are better ways. Another way is to use the relative_url or 
absolute_url filters.
```liquid
![Old Website]({{ '/assets/images/old_website.png' | relative_url }})
![Old Website]({{ '/assets/images/old_website.png' | absolute_url }})
```
With these filters relative_url will generate
```txt
/~ayoung48/assets/images/old_website.png
```
and absolute_url will generate
```txt
https://web.eecs.utk.edu/~ayoung48/assets/images/old_website.png
```
I like these filters better than the prepend filter, since they give a clearer 
intent on what you are trying to accomplish.

The last way I found to generate the links is with the link tag.
```liquid
![Old Website]({% link /assets/images/old_website.png %})
```
Although this syntax is the worst looking, it gives the added benefit of 
correctly generating the permalink of the file you are trying to link to. This 
means that it is the preferred method for linking to other generated pages, 
such as posts, since the permalink generation style could change. With this 
method the link will still work correctly if the permalink style is changed. 
This method also has the added benefit of performing link validation when 
Jekyll builds the site. If you use the `link` or `post_url` tags, Jekyll will 
check to make sure the link or post exists during the build process and throw 
an error if the link is bad. Since tags provide correct generation of 
permalinks and perform link validation, they are my preferred method for 
specifying local links in my website.
{% endraw %}

## Width Issue of Facebook Comments
Another issue I ran into was that on one computer, for whatever reason, the 
Facebook comments would not take up the correct width. The fix for this problem 
was to copy some css code I found on the internet to `/assets/css/main.scss`. 
This solution was found on 
[stackoverflow](https://stackoverflow.com/questions/22243233/how-to-make-facebook-comment-box-width-100-2014).
```css
// Fix width issues of Facebook comments.
// https://stackoverflow.com/questions/22243233/how-to-make-facebook-comment-box-width-100-2014
.fb_iframe_widget_fluid_desktop, .fb_iframe_widget_fluid_desktop span, .fb_iframe_widget_fluid_desktop iframe {
            max-width: 100% !important;
            width: 100% !important;
 }
```

## Deploy Script
This last section isn't really a deployment issue, but a way to make deploying 
the website easier. I created a simple script to build the Jekyll site and copy 
the files to the server.
```bash
#!/bin/bash
#-------------------------------------------------------------------------------
# Script to deploy the website to the server.
#-------------------------------------------------------------------------------

# Variables -- Change to the correct values before use.
instancehost="machine_address"
remotewebroot="webroot_folder"

# Build Jekyll Site
JEKYLL_ENV=production bundle exec jekyll build
chmod -R a+rX _site

echo "rsync to SSH host $instancehost ..."

# Long form of rsync options
# rsync --verbose --recursive --compress --checksum --human-readable --perms --delete-after`
rsync -vrzchp --delete-after _site/ $instancehost:$remotewebroot
```
