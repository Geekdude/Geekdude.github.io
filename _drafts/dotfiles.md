---
title: My Dotfiles Storage using Git and Shared Dotfile Repo
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

## README.md

The README file goes over the process on how to setup the dotfile configuration on a new system.
From the steps, you can see how the relatively simple process is made more difficult when I need to use ssh keys to pull from a private repository.

## makesymlinks.sh

This file creates the symlinks for the dotfiles back to the corresponding file in the dotfiles directory.
Over time this script was also extended to pull and update external submodules, to create other additional symlinks, and to link symlinks to folders.
This script is run to setup all the dotfiles.
I have more submodules listed in .gitmodules than I actually use.
That is why I explicitly list the submodules I want in the script.
This is primarily since it is much easier to add a new submodule than to remove it, and I might want to use it again.

## Ssh

In my private dotfiles repo, I keep passcode protected and also gpg encrypted ssh keys.
The makesymlinks.sh script will call the command to decrypt the keys as part of the setup.
In practice, I have to add the keys before I con clone the dotfiles directory and I have to then manually setup the symlink to .ssh.
That's is the problem with using a private dotfiles repo; the keys need to be in place before you can clone the repo.
I also use a .ssh/config file to configure connections to remote machines.
Since the information in .ssh is more sensitive, I have not included any of it in the public dotfiles repo.

## Git

The git configuration is stored in `gitconfig`, global git ignores are stored in `gitignore_global`, and my git hook templates are stored in `git_template`.
I removed the `user.name` and `user.email` config items from the `gitconfig`, but those can be easily added back when git prompts you to set them.

I use [Beyond Compare 4](https://www.scootersoftware.com/) as my main difftool.
I also added other tools with aliases.
vimdiff, vimmerge, gvimdiff, and gvimmerge use vim and gvim respectively to perform the diff or merge.
I also found [difftastic](https://github.com/Wilfred/difftastic) which is a better terminal diff than `diff` and is aliased to difft.
My favorite alias, which I use all the time, is `tree`, which prints out a nice tree view of the git log. 
Other aliases are `sup` which updates recursively all submodules and `sfor` is a alias to run a for loop over all submodules.
I also have `hash` which prints out the current git hash, and `pwd` which prints out the top-level of the git repo. `pwd` is a miss-leading name, but I can remember it easily.
I also have `s` which prints the status of the current directory.

My template directory has the necessary hooks to setup ctags.
These ctags are then used by my vim configuration to easily jump to tags in my file.
Each time a git operation occurs the ctags are regenerated, which keeps them up-to-date.
My global `gitignore_global` ignores the generated ctag files.
Ctags are further discussed in my [Ctags blog post]({% link _posts/2021-03-05-ctags.md %})

I like to use fast-forward only so that I have to explicitly chose to make a merge.
That way it is easier for me to pick to merge or to rebase.

## Fish

I like to use the [fish](https://fishshell.com/) shell.
I think it is a well designed shell with an easy to understand configuration structure.
Out of the box, it has many of the feature by default that are a pain to setup in zsh.
I was also able to keep the same basic them as my previous shell configurations.
Some of my favorite features are:

- Automatic prediction and auto complete of commands base on previously used commands.
- Command completions based on man pages. (I also have a function, `fish_add_completions`, to generate a manpage from `--help` output, and reload the man completions so that programs I write can have easy command completions)
- Powerful prompt with git status, exit code, time, and the duration of the last command.
- Easy configuration with a conf.d for config files and functions for custom functions.

My config.fish has inline comments describing what everything does.
One thing to point out is that I call `setxkbmap` and `xcape` commands to replace capslock with control/escape and both shifts with capslock.

Inside `conf.d` I have configuration files broken down by the name of what they are configuring.
Any file in this directory will be include in the configuration of fish.
I use `ssh_agent.fish` to make sure I always have an ssh-agent running.

Inside functions, I have all my custom functiokns.
In fish the prompts are just a function that is called, so my prompt is defined in `fish_prompt.fish` and `fish_right_prompt.fish`.
`funcedsave.fish` combines the built in [funced](https://fishshell.com/docs/current/cmds/funced.html) and [funcsave](https://fishshell.com/docs/current/cmds/funcsave.html) functions.

`git-add-submodule.fish` adds an existing clone nested repository as a submodule of the parent.
`git-reload-hooks.fish` and `git-reload-hooks-all.fish` reload hooks based on the git template for either the current repo, or recursively into all the submodules.

Something new I am trying is the [fisher](https://github.com/jorgebucaran/fisher) fish plugin manager with [z](https://github.com/jethrokuan/z) for directory jumping.

## Tmux

My Tmux config is setup to work with nested local and remote tmux sessions. `tmux.conf` specifies the local tmux configuration and `tmux/tmux.remote.conf` adjusts the status bar on the remote tmux session.
\<F12\> is used to toggle disable/enable the outer tmux session so that the inner tmux session is easier to work with.

My tmux config also has mouse support, plugins to show resource monitoring, and more vim-like bindings.

I spend a while figuring out the full color range for both tmux and fish, and the color settings at the top of the file seem to work.
Since I use MobaXTerm which has some cool features that only work if bash is your default shell, I use tmux to set my default shell to fish.
That way fish is started anytime I start my tmux session.

In `bin`, I also have some helpful tmux scrips.
`tmuxes` opens or connects to a new single tmux session which has the same view as a previous connection.
This command only open on common tmux session and multiple sessions will follow the same cursor.
`tmuxs` also opens the same tmux session, but this time it creates a new view into it so that the cursor does not follow the previous window.
`tmux_allow` and `tmux_disallow` changes the permissions of the tmux socket to allow other users on the same machine to connect to the same tmux session.

## Vim

I use [Vim](https://www.vim.org/) and [Visual Studio Code](https://code.visualstudio.com/) as my main text editors.
Vim is still the editor that I am the most proficient with and also the one that I have customized the most.
With the various plugins I have, my Vim behaves more like a modern tool like Visual Studio Code, compared to vanilla VI editor.
I have and still use Vim as an code editor, word processor, note taker, and documentation writer, and various plugins make it more suited for these tasks.
To learn about the plugins I use see [My Favorite Vim Plugins]({% link _drafts/vim-plugins.md %}).
These plugins are install using [pathogen](https://github.com/tpope/vim-pathogen) and the plugins are added as submodules to my dotfiles repo. `makesymlinks.sh` is used to initiate and update the submodules.
Some of the plugins I have modified and the submodules point to my forks of the original repos.

Just like with my other config files, I have inline comments to explain my configuration.
However, I will mention here some specific features I have.
See my [Ctags blog post]({% link _posts/2021-03-05-ctags.md %}) for more information on how Ctags are setup.
I like to use 3 spaces by default, even though that seems like a chaotic-neutral choice on the alignment chart.
I have a check, which disables many features when the text file is over 10MB, with this setting vim is able to open humongous text files which break most other text editors.
I have a function which automatically strips training whitespace from files on save with the exception of when editing markdown files since trailing whitespace has meaning in markdown.
To help see trailing whitespace in those file formates, I add a $/cdot$ in place of the training space.
I created my own color scheme which is modification off of the default color scheme.
I also setup proper 256 and GUI colors so that the color scheme looks good.

I added two useful functions for when I edit text.
To make line diffing of text easier, and since LaTeX and Vim treat newlines without a blank as part of the same paragraph, I write one sentence per line in the source document. 

```vim
" Search for paragraphs that do no end in a newline.
nnoremap <leader>l<space> /[.!?]'\?'\?\zs\s\+\ze\(\w\\|\\\)<cr>
" Join lines and add a newline at the ends of sentences.
vnoremap <leader>l<space> :s/[.!?]'\?'\?\zs\s\+\ze\(\w\\|\\\)/\r/g<cr>
```

When `<leader>l<space>` is pressed, the sentance ending periods which are not followed by a newline are searched for and highlighted.
When a visual selection is made and `<leader>l<space>` is pressed, the newlines are added to the selected region.
This makes it easy to reformate text note in the one sentance per line format to this format.
Just use `J` to join all the lines in a paragraph, then press `<V>` then `<leader>l<space>`.

`:DuplicateTabpane` is useful for quickly duplicating your current window layout to a new tab. Then `:TabooRename` can be used to rename the tab to a new name.

Here are my keybindings I use with working with vim-zettel:

```text
Zettel Vim Keybindings

<leader>zs  ZettelSearchMap
<leader>zy  ZettelYankNameMap
<leader>z   ZettelNewSelectedMap
<leader>nv Notational Vim
:ZettelNew <title>
```

## Basic Apt Installs

This script is used to update and upgrade apt packages, then install a common set of apt packages that I expect every system to have.
Between the dotfiles repo, this script, and Synology drive, I can go from a fresh Ubuntu install to a configure system very quickly.
This is useful since I redo my computers frequently or setup a new virtual machine.

## Bin

`create-thumbnails` is used to reduce the resolution of images to create thumbnail versions.
I use this for my website to reduce the size of the smaller images in a gallery.

`pdf-shrink` reduces the size of PDFs by calling other commands with the correct arguments.

`esv` uses the [ESV](https://www.esv.org) API to create a terminal program to read or listen to the bible.
If you want to use this program, you will first have to generate a API token from [ESV.org](https://api.esv.org/).

Reorder is a program I wrote and is discussed in the [Reorder blog post]({% link _posts/2020-01-30-reorder.md %})

## Fonts

Here I store all the fonts I want to use across my machines.
Then, `makesymlinks.sh` will create a symlink to the local font location and run `fc-cache` to cache the fonts so that they are properly installed as locally installed fonts.
I did not include the fonts in the public repo since I didn't want to check the licensing on each font.

## Inkscape

I setup Inkscape with the extensions I use. I created my own addition to circuit symbols to make a black box symbol.

## Bonus: Zork

No system is complete without Zork, so as a bonus I install Zork by default.
