---
title: My Favorite Vim Plugins
toc: true
toc_sticky: false
toc_max_header: 2
categories: [Tech]
tags: [Vim]
header:
    image: /assets/images/vim-plugin-header.png
    teaser: /assets/images/vim-plugin-teaser.png
---

I use [Vim](https://www.vim.org/) and [Visual Studio Code](https://code.visualstudio.com/) as my main text editors, and I have found multiple plugins to both which add nice features to the respective program.
In this post, I will go over my favorite Vim plugins. I install these plugins as part of [my dotfiles setup]({% link _drafts/dotfiles.md %}), so it is easy to setup vim with plugins on each system I use.

## Core Plugins

These plugins are ones that I highly recommend and add what I would consider core features to vim.

### vim-commentary

url:  <https://github.com/tpope/vim-commentary.git>

Comment stuff out. Use `gcc` to comment out a line and `gc` to comment out a motion.

### vim-gitgutter

url:  <https://github.com/airblade/vim-gitgutter.git>

Show the file's git diff status in the gutter.

### vim-vinegar

url:  <https://github.com/tpope/vim-vinegar.git>

Makes netrw work much better. Main addition is `-` to go up a directory.

### vim-unimpaired

url:  <https://github.com/tpope/vim-unimpaired.git>

Pairs of handy bracket mappings. They allow `[` or `]` followed by a character to jump forward or backward. `]q` is `:cnext`. `[q` is `:cprevious`. `]a` is `:next`. `[b` is `:bprevious`. See the documentation for the full set of 20 mappings and mnemonics.

### vim-rename

url:  <https://github.com/wojtekmach/vim-rename.git>

Rename a buffer within vim and on disk. Use `:saveas <newfile>` to rename the file and remove the old file from disk.

### vim-textobj-entire

url:  <https://github.com/kana/vim-textobj-entire.git>

Provides text objects `ae` and `ie` which represent the entire buffer.

### vim-capslock

url:  <https://github.com/tpope/vim-capslock.git>

Press `<C-G>c` in insert mode to toggle a temporary software caps lock. I used this when I didn't have a caps lock since I rebound it to control. Now I don't use this as much since pressing both shift keys is my caps lock.

### vim-textobj-user

url:  <https://github.com/kana/vim-textobj-user.git>

Create your own text objects easily. Used by other plugins.

### vim-repeat

url:  <https://github.com/tpope/vim-repeat.git>

Enables repeating supported plugin maps with `..`

### vim-surround

url:  <https://github.com/tpope/vim-surround.git>

Adds surround text mapping with s. I.e., `cs"'` to change `"` to `'` surrounding text.

### vim-visual-star-search

url:  <https://github.com/nelstrom/vim-visual-star-search.git>

Start a `*` or `#` search from a visual block.

### vim-abolish

url:  <https://github.com/tpope/vim-abolish.git>

Easily search for, substitute, and abbreviate multiple variants of a word.

### calendar-vim

url:  <https://github.com/mattn/calendar-vim.git>

Open a calendar within vim. Use `:Calendar` to open.

### vim-exchange

url:  <https://github.com/tommcdo/vim-exchange.git>

Easy text exchange operator for vim.

#### Mappings

`cx`

On the first use, define the first `{motion}` to exchange. On the second use, define the second `{motion}` and perform the exchange.

`cxx`

Like `cx`, but use the current line.

`X`

Like `cx`, but for Visual mode.

`cxc`

Clear any `{motion}` pending for exchange.

#### Some notes

If you're using the same motion again (e.g. exchanging two words using `cxiw`), you can use `.` the second time.
If one region is fully contained within the other, it will replace the containing region.

### vim-textobj-sentence

url:  <https://github.com/reedes/vim-textobj-sentence.git>

Improving on Vim's native sentence text object and motion.

### Taboo

url:  <https://github.com/gcmt/taboo.vim>

Few utilities for pretty tabs. `:TabooRename <name>` to rename a tab.

## Awesome Added Features

These plugins add cool new features to Vim.

### tabular

url:  <https://github.com/godlygeek/tabular.git>

Vim script for text filtering and alignment. Amazing plugin for aligning LaTeX tables and assignment lists.

### ctrlp.vim

url:  <https://github.com/ctrlpvim/ctrlp.vim.git>

Use `<c-p>` for a fuzzy finder. Easily search for files.

### vim-buffergator

url:  <https://github.com/jeetsukumaran/vim-buffergator.git>

List, select, and switch between buffers. Use `<Leader>b` to open the buffer side panel.

### tagbar

url:  <https://github.com/majutsushi/tagbar.git>

Display tags in a window, ordered by scope. Used to navigate quickly within a file. Use `<Leader>cc` to open.

### supertab

url:  <https://github.com/ervandew/supertab.git>

Perform all your vim insert mode completions with Tab.

### undotree

url:  <https://github.com/mbbill/undotree.git>

Undo history visualizer for Vim. Use `:UndotreeToggle` to start. This has saved me in the cases where I undid some changes, then accidentally made a new change but wanted to redo to the previous state.

### vim-autocorrect

url:  <https://github.com/panozzaj/vim-autocorrect.git>

Correct common typos and misspellings as you type in Vim.
Note: this plugin is slow to load, but I still find it super helpful and less annoying than Word's autocorrect.

### Cheat.sh-vim

url: <https://github.com/dbeniamine/cheat.sh-vim>

Browse cheat sheets from [cheat.sh](http://cheat.sh/) directly from vim.

## Note-taking

These are plugins which go alone with taking notes in vim. See [Personal Knowledge Base and Productivity Presentation]({% link _posts/2022-04-07-productivity.md %}) for more information on note-taking.

### vimwiki

url:  <https://github.com/geekdude/vimwiki.git>

A Personal Wiki for vim. I used this as my primary note-taking tool before switching to OneNote. See [Personal Knowledge Base and Productivity Presentation]({% link _posts/2022-04-07-productivity.md %}) for more information on my note-taking system.

### vim-zettel

url:  <https://github.com/michal-h21/vim-zettel>

Vim plugin to implement Zettelkasten with Vimwiki.

### fzf

url:  <https://github.com/junegunn/fzf.vim>

fzf wrappers for vim.

### notational-fzf-vim

url:  <https://github.com/alok/notational-fzf-vim>

Notational Velocity for vim. Used to fuzzy search through a Vimwiki.

## Writing Tools

This are the plugins which help with the paper writing process in vim.

### vimtex

url:  <https://github.com/lervag/vimtex.git>

A vim plugin for editing LaTeX files. This is my favorite of the many LaTeX plugins.

### vim-dict

url:  <https://github.com/szw/vim-dict.git>

Dictionary lookup inside vim. To lookup a work use the `:Dict` command.

### vim-online-thesaurus

url:  <https://github.com/Ron89/thesaurus_query.vim>

Online thesaurus lookup. Use `<Leader>cs` to query and replace the current word.

### vim-instant-markdown

url:  <https://github.com/suan/vim-instant-markdown.git>

Instant Markdown previews with vim. Use `:InstantMarkdownPreview` to start.

### LanguageTool

url:  <https://github.com/vim-scripts/LanguageTool.git>

Grammar checker using LanguageTool for vim.

### vim-pencil

url:  <https://github.com/reedes/vim-pencil>

Plugin to help vim be more friendly for writing prose. Handles automatic wrapping of text.

### goyo.vim

url:  <https://github.com/junegunn/goyo.vim.git>

Distraction-free writing in Vim.

## Coding or Language Support

### vim-flake8

url:  <https://github.com/nvie/vim-flake8.git>

Verify python syntax with flake8. To use press `<F7>`.

### vim-scala

url:  <https://github.com/derekwyatt/vim-scala.git>

Add Scala programming language support to vim.

### vim-fish

url:  <https://github.com/dag/vim-fish.git>

Vim support for editing fish scripts.

### DoxygenToolkit.vim

url:  <https://github.com/vim-scripts/DoxygenToolkit.vim.git>

Simplify Doxygen documentation in C, C++, Python.

### vim-gdscript3

url:  <https://github.com/calviken/vim-gdscript3>

Support syntax for Godot script.

## Plugins used for code and colorscheme debugging

### vim-HiLinkTrace

url:  <https://github.com/gerw/vim-HiLinkTrace.git>

Trace highlighting with `\hlt`.

### xterm-color-table.vim

url:  <https://github.com/guns/xterm-color-table.vim.git>

Displays all 256 terminal colors with the command `:XtermColorTable.`

### hexHighlight

GVim plugin to highlight hex codes to help with tweaking colors.

### Conque-GDB

url:  <https://github.com/vim-scripts/Conque-GDB.git>

GDB command line interface and terminal emulator in Vim.

## Color Themes

Note: I don't use these color schemes, since I created my own color scheme.

### palenight.vim

url:  <https://github.com/drewtempelmeyer/palenight.vim.git>

Soothing color scheme for vim. Recommended by  <https://blog.pabuisson.com/2018/06/favorite-color-schemes-modern-vim-neovim/>

### vim-one

url:  <https://github.com/rakr/vim-one.git>

Adaptation of one-light and one-dark (Atom) colorschemes for vim. Recommended by  <https://blog.pabuisson.com/2018/06/favorite-color-schemes-modern-vim-neovim/>

### molokai

url:  <https://github.com/tomasr/molokai.git>

Molokai color scheme for Vim. Recommended by  <https://www.slant.co/topics/480/~best-vim-color-schemes>

### gruvbox

url:  <https://github.com/morhetz/gruvbox.git>

Retro groove color scheme for Vim. Recommended by  <https://www.slant.co/topics/480/~best-vim-color-schemes>

## Unused but still might be helpful

These are plugins the I no longer use.

### vim-fugitive

url:  <https://github.com/tpope/vim-fugitive.git>

A git wrapper for vim.

### YouCompleteMe

url:  <https://github.com/Valloric/YouCompleteMe.git>

A code-completion engine for vim.
Note: I don't use this one anymore since it was a bigger pain to setup then the benefit to use it.

### vim-smooth-scroll

url:  <https://github.com/terryma/vim-smooth-scroll.git>

Makes scrolling in vim nice and smooth. (Currently I do not have this plugin mapped.)

### vim-qargs

url:  <https://github.com/nelstrom/vim-qargs.git>

Adds a Qargs utility command to populate the argument list from the files in the quickfix list.
Note: The functionality provided by this project has been made largely obsolete in recent versions of vim.
