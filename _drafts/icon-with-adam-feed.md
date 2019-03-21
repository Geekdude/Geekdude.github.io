---
title: How to add a favicon to jekyll-feed
---

Script to add icon line to gem source.

https://github.com/jekyll/jekyll-feed

https://snook.ca/archives/rss/add_logo_to_feed/

```bash
#!/bin/bash
#-------------------------------------------------------------------------------
# Script to add an icon line to the feed template in jekyll-feed.
#-------------------------------------------------------------------------------

# Variables
FEED_FILE=~/gems/gems/jekyll-feed-0.11.0/lib/jekyll-feed/feed.xml

# Add icon line to jekyll-feed template file.
if [ -f $FEED_FILE ]; then
   if ! grep -q "<icon>{{ '/assets/favicons/favicon.ico' | absolute_url }}</icon>" $FEED_FILE ; then
      sed -i "11i\  <icon>{{ '/assets/favicons/favicon.ico' | absolute_url }}</icon>" $FEED_FILE
      echo "Added \"<icon>{{ '/assets/favicons/favicon.ico' | absolute_url }}</icon>\" to $FEED_FILE"
   else
      echo "Icon string already in gem."
   fi
else
   echo "Could not find the jekyll-feed template file at $FEED_FILE."
fi
```
