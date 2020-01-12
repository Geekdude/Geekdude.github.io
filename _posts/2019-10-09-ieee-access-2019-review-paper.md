---
title: A Review of Spiking Neuromorphic Hardware Communication Systems
categories: [Tech]
tags: [Neuromorphic Computing, Research]
date: 2019-10-09 8:00:00
toc: true
toc_sticky: true
header:
    teaser: /assets/images/ieee-access-2019-graphical-abstract.png
---
Aaron R. Young, Mark E. Dean, James S. Plank, and Garrett S. Rose

September, 2019

*IEEE Access*

[https://ieeexplore.ieee.org/document/8843969](https://ieeexplore.ieee.org/document/8843969)

[View Article]({% link /assets/2019-Young-Review.pdf %}){: .btn .btn--info}

## Abstract
Multiple neuromorphic systems use spiking neural networks (SNNs) to perform computation in a way that is inspired by concepts learned about the human brain.
SNNs are artificial networks made up of neurons that fire a pulse, or spike, once the accumulated value of the inputs to the neuron exceeds a threshold.
One of the most challenging parts of designing neuromorphic hardware is handling the vast degree of connectivity that neurons have with each other in the form of synaptic connections.
This paper analyzes the neuromorphic systems Neurogrid, Braindrop, SpiNNaker, BrainScaleS, TrueNorth, Loihi, Darwin, and Dynap-SEL; and discusses the design of large scale spiking communication networks used in such systems.
In particular, this paper looks at how each of these systems solved the challenges of forming packets with spiking information and how these packets are routed within the system.
The routing of packets is analyzed at two scales: How the packets should be routed when traveling a short distance, and how the packets should be routed over longer global connections.
Additional topics, such as the use of asynchronous circuits, robustness in communication, connection with a host machine, and network synchronization are also covered.

{% include figure image_path="/assets/images/ieee-access-2019-graphical-abstract.png" alt="Graphical Abstract" caption="Graphical summary of neuromorphic hardware communication systems. The top half of this figure summarizes the routing schemes used by the neuromorphic systems, and the bottom half summarizes the routing methods." %}

## Citation Information
### Text

    author    A. R. Young and M. E. Dean and J. S. Plank and G. S. Rose
    title     A Review of Spiking Neuromorphic Hardware Communication Systems
    journal   IEEE Access
    volume    7
    pages     135606-135620
    year      2019
    doi       10.1109/ACCESS.2019.2941772
    url       http://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8843969&isnumber=8600701

### BibTex

    @ARTICLE{ydp:19:ars,
        author = "A. R. Young and M. E. Dean and J. S. Plank and G. S. Rose",
        title = "A Review of Spiking Neuromorphic Hardware Communication Systems",
        journal = "IEEE Access",
        volume = "7",
        pages = "135606-135620",
        year = "2019",
        doi = "10.1109/ACCESS.2019.2941772",
        url = "http://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8843969&isnumber=8600701"
    }

