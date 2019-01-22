---
title: " "
layout: splash
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
  - image_path: assets/images/typewriter.svg
    title: "Resume"
    btn_label: "Read Me"
    btn_class: "btn--primary"
    url: "/resume/"
  - image_path: /assets/images/tennlab.svg
    alt: "TENNLab Logo"
    title: "TENNLab"
    excerpt: "We are a group of faculty, post-docs, graduate students and undergraduates researching a new paradigm of computing, inspired by the human brain. Our research encompasses nearly every facet of the area, including current and emergent hardware implementations, theoretical models, programming techniques and applications."
    url: "http://neuromorphic.eecs.utk.edu/"
    btn_label: ""
    btn_class: "btn--info"
  - image_path: /assets/images/envelope.svg
    title: "Contact Me"
    excerpt: "Feel free to send me an email at [ayoung48@vols.utk.edu](mailto:ayoung48@vols.utk.edu)"
graphics:
  - image_path: /assets/images/graphics_final.svg
    title: "Computer Graphics Final Project"
    excerpt: |
        Click here to view my final project for COSC 594 -- Computer Graphics.
        For my project, I created a 3D Dungeons and Dragons tabletop scene, similar to what can be found at my apartment on Saturday nights. I only wish I had minitures as cool as found in the demo.
    url: "/computer_graphics/finalproject"
    btn_label: "Launch"
    btn_class: "btn--info"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

{% include feature_row id="graphics" type="left" %}

