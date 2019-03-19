#!/bin/bash
#-------------------------------------------------------------------------------
# Script to add an icon line to the feed template in jekyll-feed gem.
#-------------------------------------------------------------------------------

# Variables
FEED_FILE=~/gems/gems/jekyll-feed-0.11.0/lib/jekyll-feed/feed.xml

# Add icon line to jekyll-feed template file.
if [ -f $FEED_FILE ]; then
   # Add Icon Line
   if ! grep -q "<icon>{{ '/assets/favicons/favicon.ico' | absolute_url }}</icon>" $FEED_FILE ; then
      sed -i "11i\  <icon>{{ '/assets/favicons/favicon.ico' | absolute_url }}</icon>" $FEED_FILE
      echo "Added \"<icon>{{ '/assets/favicons/favicon.ico' | absolute_url }}</icon>\" to $FEED_FILE"
   else
      echo "Icon string already in gem."
   fi

   # Add Logo Line
   if ! grep -q "<logo>{{ '/assets/images/logo88x88.png' | absolute_url }}</logo>" $FEED_FILE ; then
      sed -i "12i\  <logo>{{ '/assets/images/logo88x88.png' | absolute_url }}</logo>" $FEED_FILE
      echo "Added \"<logo>{{ '/assets/images/logo88x88.png' | absolute_url }}</logo>\" to $FEED_FILE"
   else
      echo "Logo string already in gem."
   fi
else
   echo "Could not find the jekyll-feed template file at $FEED_FILE."
fi
