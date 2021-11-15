# Useful terminal command

## List 

Use **ls** to list the contents of your current directory

```console
~$ ls
'Advanced CSS and Sass'/   Git-Github/  'image slider'/   NodeJS/           React/   TypeScript/      
 blognote/                 Icon/         markdown/        notes-markdown/   test/
```

## Open Folder

Use **start** (In Mac, use **open** ) to open directory

```console
~$ start .
~$ open .
```

## Print Working Directory

Use **pwd** to prints the path to the working directory

## Change Directory

Use **cd** to change and move between folders

```console
~$ pwd
/c/Users/Jumo/Desktop/FrontEnd
~$ cd Git-Github/
~$ pwd
/c/Users/Jumo/Desktop/FrontEnd/Git-Github
~$ cd ..
/c/Users/Jumo/Desktop/FrontEnd/
```

## Touch

Use **touch** to create a file(or multiples)

```console
~$ touch index.js
~$ ls
index.js
~$ touch app.js index.html style.css
~$ ls
index.js index.html style.css app.js
```

## Make directory

Use **mkdir** to create a new directory

```console
~$ mkdir src
~$ ls
src
```

## Remove file

Use **rm** will delete a file or files. It permanently remove them!

```console
~$ ls
index.js
~$ rm index.js
```

## Remove a directory

Use **rm -rf** to delete a directory (r = recursive, f= force)

```console
~$ ls
src
~$ ls src
index.html index.js style.css
~$ rm -rf src
```

## Create a File and Write Some Content Inline

```console
~$ echo "something else" > filename.txt
```
