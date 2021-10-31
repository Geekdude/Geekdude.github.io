---
title: Changing from Disqus to Utterances
toc: false
toc_sticky: false
categories: [Tech]
tags: [Website]
header:
    image: /assets/images/utterances-header.png
    teaser: /assets/images/utterances-teaser.png
---
I have been having an issue where [Disqus](https://disqus.com/) would not send me any emails when new comments are posted to the website.
After going through all the settings in Disqus, changing my email address, and testing adding comments using a guest login, I could not figure out how to get email notifications to work.
Because of this, I changed to using [Utterances](https://utteranc.es/) for my website's comments.
Utterances' is a great choice since it is open-source and uses the issues tracker of the GitHub repository to store the comments.
Each page is its own issue, and the comments are added to the issue.
Now email notification works just like GitHub's issue email notification system.
The main downside to Utterances is that you have to log in to a GitHub account in order to post a comment.
I liked the flexibility that Disqus provided in terms of login types and guest posting, but I need a commenting system that notifies me when new comments are added, and I like that comments are stored as issues in the issue tracker.
