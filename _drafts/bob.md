---
title: The Big Orange Bramble
categories: [Tech]
tags: [High Performance Computing]
toc: true
toc_sticky: true
header:
    image: /assets/images/bob-header.png
    teaser: /assets/images/bob-hardware-diagram.png
bob:
    - url: /assets/images/bob-system.jpeg
      image_path: /assets/images/bob-system-th.jpeg
      alt: "bob-system"
      title: "BOB system running a distributed fluid simulation application."
    - url: /assets/images/bob-front-view.jpg
      image_path: /assets/images/bob-front-view-th.jpg
      alt: "bob-front-view"
      title: "BOB and ALICE systems side by side. BOB is on the left. ALICE is on the right."
    - url: /assets/images/bob-rack-zoom.jpg
      image_path: /assets/images/bob-rack-zoom-th.jpg
      alt: "bob-rack-zoom"
      title: "Close-up on one tower of 8 Raspberry Pis."
    - url: /assets/images/bob-development-team.jpeg
      image_path: /assets/images/bob-development-team-th.jpeg
      alt: "bob-development-team"
      title: "The team that built BOB."
    - url: /assets/images/bob-router-zoom.jpg
      image_path: /assets/images/bob-router-zoom-th.jpg
      alt: "bob-router-zoom"
      title: "Close-up on BOB's router."
    - url: /assets/images/bob-back-view-zoom.jpg
      image_path: /assets/images/bob-back-view-zoom-th.jpg
      alt: "bob-back-view-zoom"
      title: "Close-up on the headnode and storage nodes."
    - url: /assets/images/bob-zoom.jpg
      image_path: /assets/images/bob-zoom-th.jpg
      alt: "bob-zoom"
      title: "BOB Rack—Front View."
    - url: /assets/images/bob-back-view.jpg
      image_path: /assets/images/bob-back-view-th.jpg
      alt: "bob-back-view"
      title: "BOB Rack—Back View."

---
This year marks the three year anniversary of the 64 node Raspberry Pi cluster known as the Big Orange Bramble or BOB.
I am happy to report that BOB is still running strong and there have been no major downtimes or issues with the system.
BOB is still occasionally used to train neuromorphic networks using EONS, which you can read more about [here](http://neuromorphic.eecs.utk.edu/raw/files/publications/2018-Plank-Framework.pdf).
BOB was build as part of the special topics class [ECE599 Supercomputer Design and Analysis, Summer 2016]({{ site.baseurl }}{% link /assets/ECE599-Supercomputer-Design-and-Analysis-Syllabus-v6.pdf %}) of which I was part of.
This post includes images of the system and copies of the reports and presentations in case you want to read more about the system.
The reports are also posted on [Dr. Mark Dean's website](http://web.eecs.utk.edu/~markdean/).
Dr. Dean taught the course.
Also included are the reports for the follow-up project named A Linux Integrated Computing Environment or ALICE which used Pine64 boards and Nvidia TX1 GPUs.

## Abstract

This project involved the design and construction of a high performance cluster composed of 68 quad-core ARMv8 64-bit Raspberry Pi 3s.
The primary intent of the project was to establish the operating environment, communication structure, application frameworks, application development tools, and libraries necessary to support the effective operation of a high performance computer model for the students and faculty in the Electrical Engineering and Computer Science Department of the University of Tennessee to utilize.
As a foundation, the system borrowed heavily from the Tiny Titan system constructed by the Oak Ridge National Laboratory, which was a similar but smaller-scale project consisting of 9 first generation Raspberry Pis.
Beyond the primary target of delivering a functional system, efforts were focused on application development, performance benchmarking, and delivery of a comprehensive build/usage guide to aid those who wish to build upon the efforts of this project.

## Picture Gallery
{% include gallery id="bob" caption="BOB Gallery." %}

## Project Reports
[BOB Documentation]({{ site.baseurl }}{% link /assets/bob-documentation.pdf %})

[Applications for 68 Node Raspberry Pi 3 Education Cluster]({{ site.baseurl }}{% link /assets/applications-for-68-node-raspberry-pi-3-education-cluster.pdf %})

[Performance, Management, and Monitoring of 68 Node Raspberry Pi 3 Education Cluster: Big Orange Bramble (BOB)]({{ site.baseurl }}{% link /assets/bob-performance.pdf %})

[ALICE Documentation]({{ site.baseurl }}{% link /assets/alice-documentation.pdf %})

## Project Presentations
[BOB Presentation]({{ site.baseurl }}{% link /assets/bob-presentation.pdf %})

[Big Orange Bramble (BOB) HW SW Systems Presentations](https://www.youtube.com/watch?v=l71lbh8Lz0U)

[Big Orange Bramble (BOB) App Presentations](https://www.youtube.com/watch?v=gnGCjMEXjdo)

[ALICE Presentation]({{ site.baseurl }}{% link /assets/alice-presentation.pdf %})
