# Git Tags

Tags are pointers that refer to particular points in Git history. We can mark a particular moment in time with a tag. Tags are most often used to mark version releases in projects(v2.0.0, v.2.1.0, etc.) Think of tags as branch references that do NOT CHANGE. Once a tag is created, it always refers to the same commit. It's just a label for a commit.

## The Two Types

There are two types of Git tags we can use: lightweight and annotated tags

* lightweight tags:  
They are just a name/label that points to a particular commit.

* annotated tags:  
They store extra meta data including the author's name and email, the date, and a tagging message(like a commit message)

## Semantic Versioning

The semantic versioning spec outlines a standardized versioning system for software releases. It provides a consistent way for developers to give meaning to their software releases(how big of a change is this release??) Versions consist of three numbers separated by periods.

> Typically, The first release is 1.0.0

1. Patch Release:  
Patch release (ex:1.0.0 -> 1.0.1) normally don't contain new features or significant changes. They typically **signify bug fixes and other changes that don't impact how the code is used**.

2. Minor Release:  
Minor releases (ex:1.0.0 -> 1.1.0) signify that new features or functionality have been added, but the project is still backwards compatible. No breaking changes. The new functionality is optional and should not force users to rewrite their code.

3. Major Release:  
Major release (ex:1.0.0 -> 2.0.0) signify significant changes that is no longer backwards compatible. Features may be removed or changed substantially.

## Viewing Tags  

```console
~$ git tag
```

git tag will print a list of all the tags in the current repository.

```console
~$ git tag -l "*beta*"
```

We can search for tags that match a particular pattern by using **"git tag -l"** and then passing in a wildcard pattern. For example, **"git tag -l * beta * "** will print a list of tags that include "beta" in their name.

## Checking out Tags

```console
~$ git checkout <tag>
```

To view the state of a repo at a particular tag, we can use **"git checkout < tag >"**. This purts us in detached HEAD!

## Creating Lightweight Tags

```console
~$ git tag <tagname>
```

to create a lightweight tag, use **"git tag < tagname >"**. By default, Git will create the tag referring to the commit that HEAD is referencing.

## Creating Annotated Tags

```console
~$ git tag -a <tagname>
```

Use **"git tag -a < tagname >** to create a new annotated tag. Git will then open your default text editor and prompt you for additional information. Similar to git commit, we can also use the -m option to pass a message directly and forgo the opening of the text editor.

## View Annotated Tag MetaData

```console
~$ git show <tagname>
```

## Tagging Previous Commits

```console
~$ git tag <tagname> <commit>
```

So far we've seen how to tag the commit that HEAD references. We can also tag an older commit by providing the commit hash: **"git tag -a < tagname > < commit-hash >"**

## Forcing Tags

```console
~$ git tag -f <tagname>
```

Git will yell at us if we try to reuse a tag that is already referring to a commit. If we use the -f option, we can force our tag through.

## Deleting Tags

```console
~$ git tag -d <tagname>
```

To delete a tag, use **"git tag -d < tagname > "**

## Pushing Tags

```console
~$ git push --tags
```

By default, the **"git push"** command doesn't transfer tags to remote servers. If you have a lot of tags that you want to push up at once, you can use the --tags option to the **"git push"** command. This will transfer all of your tags to the remote server that are not already there.

```console
~$ git push <remote> <tagname>
```

We can only push one tag by using **"git push < remote > < tagname >"**
