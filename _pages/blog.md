---
title: " "
layout: archive
pagination:
  enabled: true
permalink: /blog/
author_profile: true
---

<a href="{% link _pages/category-archive.md %}">By Category</a> &nbsp;&nbsp;&nbsp;
<a href="{% link _pages/tag-archive.md %}">By Tag</a> &nbsp;&nbsp;&nbsp;
<a href="{% link _pages/year-archive.md %}">By Year</a>

<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% for post in paginator.posts %}
  {% include archive-single.html %}
{% endfor %}

{% include paginator.html %}
