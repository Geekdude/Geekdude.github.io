---
title: Getting started with ctags with vim and git.
toc: true
toc_sticky: false
categories: [Tech]
tags: [Git, Vim, Ctags]
header:
    image: /assets/images/template-header.png
    teaser: /assets/images/template-teaser.png
---

[Ctags](http://ctags.sourceforge.net/) with vim are incredibly useful for quickly navigating around code.
With them vim is able to jump between symbols to quickly go to the definition of symbols or find keywords within the document.
Ctags + Vim end up working very similar to how [Visual Studio Code](https://code.visualstudio.com/) or other IDEs "go to definition" and "find all symbols works".

From the [ctags website](http://ctags.sourceforge.net/whatis.html):
> Ctags generates an index (or tag) file of language objects found in source files that allows these items to be quickly and easily located by a text editor or other utility. A tag signifies a language object for which an index entry is available (or, alternatively, the index entry created for that object).

## Ctags with Vim

Ctags can be annoying to use because you have to run the `ctags` program to generate a tag file, which then needs to be found by vim to be used.
If the code changes, then the tag file will need to be re-updated.
One way to setup ctags is to map a vim keypress to generate the ctags.
In my `vimrc`, I set it up to regenerate ctags when I press \<F5\> while not in a <img src="http://latex.codecogs.com/gif.latex?\LaTeX" border="0"/> file.
More on the ctags command later.

~~~ viml
" Set f5 to generate tags for non-latex files
augroup TexTags
autocmd! TexTags
autocmd FileType tex let b:latex=1
augroup end
if !exists("b:latex")
    nnoremap <f5> :!ctags -R<CR>
endif
~~~

In addition to generating the ctags you also need to tell vim where to find the generated tag files.

~~~ viml
" Ctags search
set tags=./.tags;$HOME
~~~

This tags string says to search for the file `.tags` in the current file's directory and also recursively search upward until the users home directory is reached.

## Ctags with Vim and Git

However, I do not manually generate the ctags file with \<F5\>.
I store all my source code in [Git](https://git-scm.com/), so instead of manually generating the ctags file I use [githooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to automatically generate the ctags files whenever I checkout, commit, merge, or rewrite.
To setup githooks to be added automatically to newly cloned or created git repos, you make a git template with the correct files.
The git template will be copied into the new repositories `.git` folder on creation.

First setup the `git_template` structure.

~~~
~/.git_template/
└── hooks
    ├── ctags
    ├── post-checkout
    ├── post-commit
    ├── post-merge
    └── post-rewrite

1 directory, 5 files
~~~

ctags:
~~~ bash
#!/bin/sh
set -e
dir="`git rev-parse --show-toplevel`"
trap 'rm -f "$dir/.$$.tags"' EXIT
ctags -R --tag-relative --extra=+f -f"$dir/.$$.tags" --languages=-javascript,sql
mv "$dir/.$$.tags" "$dir/.tags"
~~~

post-checkout:
~~~ bash
#!/bin/sh
dir=$(git rev-parse --git-dir)
$dir/hooks/ctags >/dev/null 2>&1 &
~~~

post-commit:
~~~ bash
#!/bin/sh
dir=$(git rev-parse --git-dir)
$dir/hooks/ctags >/dev/null 2>&1 &
~~~

post-merge:
~~~ bash
#!/bin/sh
dir=$(git rev-parse --git-dir)
$dir/hooks/ctags >/dev/null 2>&1 &
~~~

post-rewrite:
~~~ bash
#!/bin/sh
dir=$(git rev-parse --git-dir)
case "$1" in
  rebase) exec $dir/hooks/post-merge ;;
esac
~~~

You also have to add the template to your `.gitconfig`.
~~~
[init]
    templatedir = ~/.git_template
~~~

Now more about the ctags command.
To use the command you first have to install ctags.
I use [exuberant-ctags](http://ctags.sourceforge.net/) which can be installed with `sudo apt install exuberant-ctags` on Ubuntu or Debian based Linux.
The ctags command I use is 

    ctags -R --tag-relative --extra=+f -f"$dir/.$$.tags" --languages=-javascript,sql

The `-R` recurses into directories.
The `--tag-relative` sets file paths relative to the tag file.
The `--extra=+f` includes the entry for the base file name of every source file.
The `-f` specifies that the tag file should be saved at the root of the git repository as `.tags`.
Finally the `--languages` removes javascript and sql from the languages which get tagged.

As mentioned before, this template will only applies to new git repositories, therefore I also created two [fish](https://fishshell.com/) functions to reload git hooks based on the git template.
One which reloads hooks in a git repo without submodules and one which recursively update the hooks of all submodules.

`git-reload-hooks.fish`:

    function git-reload-hooks --description 'Reload git hooks'
    rm -f (git rev-parse --git-dir)/hooks/*
    git init
    end


`git-reload-hooks-all.fish`:

    function git-reload-hooks-all --description 'Reload all git hooks'
        git submodule foreach --recursive 'rm -f $(git rev-parse --git-dir)/hooks/*;git init'
    end

If all of this seems like a lot to setup, I recommend storing all your linux dotfiles in a git repository with a script to symlink the files to the right location.
I plan to create a future post with more detail on how this is done.


## References
I followed [https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html) when I was setting up ctags for the first time.
I have since modified my setup to work better with git submodules and other edge cases.

