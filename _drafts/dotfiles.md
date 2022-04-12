---
title: My Dotfiles Storage using Git and Shared Dotfile Repo.
toc: true
toc_sticky: false
categories: [Tech]
tags: [Linux]
header:
    image: /assets/images/template-header.png
    teaser: /assets/images/template-teaser.png
---

## Introduction and Dotfile Storage Method
When I started heavily using Linux in collage and started customizing and creating configuration files, I quickly need a way to store, backup, and setup my various configuration dotfiles. 
A logical place to store configuration files is in git, since you can see modifications to the dotfiles, easily commit new changes, and you can even make multiple branches if you need different versions of the dotfiles.
I do not remember the exact tutorial I followed, but a form of the method I used seems to be floating around on the internet in multiple blog posts.
[Managing Your Dotfiles With Git](https://betterprogramming.pub/managing-your-dotfiles-with-git-4dee603a19a2) from 2020 seems to use the same method as me, and credits [Using Git and Github to Manage Your Dotfiles](http://blog.smalleycreative.com/tutorials/using-git-and-github-to-manage-your-dotfiles/) from 2012 for the method.
Given the age of the older post and how closely [his example on GitHub](https://github.com/michaeljsmalley/dotfiles) matches the first commit of my dotfiles repo, I would guess that this is the template I followed.

I started with a simple base, and then proceeded to build up the dotfiles and configuration over many years.
My dotfiles repository currently has 623 commits and was started in 2016.
Much of the original structure from the example can still be found in my setup.
Therefore, instead of reproducing the same content as [Using Git and Github to Manage Your Dotfiles](http://blog.smalleycreative.com/tutorials/using-git-and-github-to-manage-your-dotfiles/), I will recommend you pause reading this blog and read about this method of storing dotfiles from the original source.

**Read [Using Git and Github to Manage Your Dotfiles](http://blog.smalleycreative.com/tutorials/using-git-and-github-to-manage-your-dotfiles/)**

## My Public Dotfiles

Now that you have read about the dotfile setup, you know that a dotfile directory is stored in git, and a setup script is used to create symlinks located in the location of the configuration files in the home directory which point back to configuration files in the dotfiles folder.
I have multiple branches in my dotfiles repo.
I have one main branch which I use on my personal Linux machines, then I also have a branch which I used on the University machines at school, a branch that I use on machines at work, and a branch that I use on WSL machines.
Each of these types of machines have some deviations from the main branch, but I periodically compare the contents back to the main branch to make sure that all the good features are present in all and to make sure that the places they diverge still apply.
Since some of these configuration files are specific to work or to my own machines, I decided to make a public dotfiles repo, where I will copy the content of my dotfiles which is not sensitive, and which is generic across the branches and that I think will be of general use and interest.
**This public dotfiles repository can be found at <https://github.com/Geekdude/dotfiles>**.
I hope that you find my dotfiles interesting and helpful as you create your own dotfiles repository.

As you create your own dotfiles repository, I recommend that you start from a simple base and go through example configurations and make sure you understand what the configuration lines are doing.
Then you can copy in the lines which change the configuration in a way that you like. *Don't just use public configuration examples without taking the time to understand what the configuration is doing.*
Some of my configuration, you probably don't want, but some of it you might find useful.
I enjoy learning about the features of other people configurations and potentially incorporating some of the configuration into my own config.
My configurations started simple and grew over time as I wanted my system to behave differently and searched for a solution, or saw a cool configuration on the internet or from colleagues.
Sometimes I ran into a specific problem and find the solution in a configuration change, then incorporated the change into my configuration files.

Over time I also changed the programs I use, so I have some older configuration files for these programs, even though I do not use these programs as much.
I also changed which shell I use primarily.
I started with Bash, then switch to zsh for the added features, now I am currently using fish.
I still keep my bash and zsh config in case I go back to these shells, but I primarily use fish now.
One downside to fish, is that it is not compatible with bash, so I still find myself going back to bash or zsh frequently to run bash scripts.
I liked the general look I had for bash so as I configured zsh and fish, I kept the same general look.

Now that you know the general dotfile setup, and have access to my public dotfiles, I will talk in more detail about my dotfiles and as I do, you are free to look through the dotfile repository as well.
I tried to be clear in the comments of the dotfiles what the configuration lines do, and in this blog post I will give more broader information about the features and reasoning behind the setup.

## makesymlinks.sh

## Git

## Fish

## Tmux

## Vim

## Basic Apt Installs

## Bin

## Fonts

## Inkscape

## Bonus: Zork