---
title: " "
layout: home
pagination:
  enabled: true
  title: " "
  per_page: 5
permalink: /
excerpt: "Welcome to my website."
header:
  overlay_color: "#808080"
  overlay_filter: "0.0"
  overlay_image: /assets/images/rio.jpg
  caption: "Rio de Janeiro &copy; Aaron Young"
  actions:
    - label: "About Me"
      url: "/about/"
intro:
  - excerpt: '*"Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that."* --- Martin Luther King Jr.'
feature_row:
  - image_path: assets/images/typewriter.png
    title: "Curriculum Vitae (CV)"
    btn_label: "Read Me"
    btn_class: "btn--primary"
    url: "/cv/"
  - image_path: /assets/images/apg.png
    alt: "APG Logo"
    title: "APG"
    excerpt: "Evaluating emerging computing architectures for scientific discoveries"
    url: "https://csmd.ornl.gov/group/architectures-and-performance"
    btn_label: ""
    btn_class: "btn--info"
  - image_path: /assets/images/envelope.png
    title: "Contact Me"
    excerpt: "Feel free to send me an email at [ayoung48@vols.utk.edu](mailto:ayoung48@vols.utk.edu)"
graphics:
  - image_path: /assets/images/graphics_final.png
    title: "Computer Graphics Final Project"
    excerpt: |
        Click here to view my final project for COSC 594 -- Computer Graphics.
        For my project, I created a 3D Dungeons and Dragons tabletop scene, similar to what can be found at my apartment on Saturday nights. I only wish I had miniatures as cool as found in the demo.
    url: "/computer_graphics/finalproject"
    btn_label: "Launch"
    btn_class: "btn--info"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

{% include feature_row id="graphics" type="left" %}
