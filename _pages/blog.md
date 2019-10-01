---
title: " "
layout: archive
pagination:
  enabled: true
permalink: /blog/
author_profile: true
---

[By Category]({{ site.baseurl }}{% link _pages/category-archive.md %}) &nbsp;&nbsp;&nbsp;
[By Tag]({{ site.baseurl }}{% link _pages/tag-archive.md %}) &nbsp;&nbsp;&nbsp;
[By Year]({{ site.baseurl }}{% link _pages/year-archive.md %})

<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% for post in paginator.posts %}
  {% include archive-single.html %}
{% endfor %}

{% include paginator.html %}
