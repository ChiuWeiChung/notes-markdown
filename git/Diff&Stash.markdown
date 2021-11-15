# Git Diff

Git Diff指令可以用來比對程式碼處於不同的Commits、Branches、工作目錄上的差異 (通常為了檢視過去與現在的歷程內容差異，因此常搭配git status以及git log一起使用)。

## 內容資訊

在比較兩文件的差異時，假如指令先輸入A文件，再輸入B文件，則Git提供的資訊會是 `由A演變至B的沿革` (若先B再A，則B->A的沿革)，其內容以減號(-, 被刪出的內容)以及加號(+, 被加入的內容)分別代表A及B的變化，其內容僅顯示有差異的地方及部分前後文。

如下方範例，若透過git diff顯示oldFruit及newFruit的變化:

```console
 ________________________________
| oldFruit.txt      newFruit.txt |
|                                |
|   apple              apple     |
|   strawberry ----->  orange    |
|   grape              grape     |
|                      guava     |
|________________________________|                      
```

Git所提供的資訊中，被@@前後包圍的內容( -1, 3 +1, 4 )表示:
* 在oldFruit內，擷取第1到第3行資訊(apple, strawberry, grape)
* 在newFruit內，擷取第1到第4行資訊(apple, orange, grape, guava)

```console
@@ -1,3 +1,4 @@ 
 apple
-strawberry
+orange
 grape
+guava
```

# Git Diff 指令

## 比較Unstaged文件與前次Commit的差異

```console
~$ git diff
```

所謂的Unstaged代表 `已修改但尚未被放到暫存區(Staging Area)的文件` (沒被git add帶入的文件)，我們可以透過 `git diff` 觀察當前工作目錄下"文件在Unstaged狀態與前一次Commit的差異"。

> 文件若處於Staged的情況下， `git diff` 不會顯示差異

## 比較Working Directory與前次Commit的差異

```console
git diff HEAD
```

此時Unstaged以及Staged文件都會被考慮到，並與前次Commit做比較 (意即HEAD與目前Working Directory的差異)，如下範例:

```console
~$ echo 'baseball' >sports.txt
~$ git add sports.txt
~$ git diff HEAD

diff --git a/sports.txt b/sports.txt
new file mode 100644
index 0000000..a6472b7
--- /dev/null
+++ b/sports.txt
@@ -0,0 +1 @@
+baseball
```

>  

## 比較Staged文件與前次Commit差異

```console
git diff --staged
git diff --cached
```

`git diff --staged` 以及 `git diff --cached` 都可以用來列出文件在Staging Area中與前次Commit的差異。

## 針對特定文件做比較

```console
git diff HEAD [filename] 
git diff --staged [filename]
```

在後方加入文件名稱可以針對該文件做比較。

## 比較不同分支

```console
git diff branch1..branch2
```

`git diff branch1..branch2` 會列出兩分支 `末端` 的差異。

## 比較不同Commits

```console
git diff commit1..commit2
```

`git diff commit1..commit2` 會列出兩Commit `末端` 的差異。

### 與前次Commit比較

```console
git diff HEAD~1
```

若要比較當前HEAD與前一次Commit的差異，如此一來就可以不用透過git log去查詢前一次的commit hash。

---

# Git Stash 

## 暫存

當我們想要Switch到其他分支時，可能因工作目錄內的某些文件已被修改，但尚未被commit時，就會出現下方錯誤訊息:

```console
error: Your local changes to the following files would be overwritten by checkout: XXX.html
Please commit your changes or stash them before you switch branches.
```

若不想將文件馬上commit，可以透過 `git stash` 將未被commit內容"藏起來"，也就是回復到當初HEAD的狀態。

```console
~$ git stash
```

`git stash` 是非常有用的指令，可以將尚未準備被commit的內容存起來，該指令會將 `staged以及unstaged的內容都藏起來` 。

```console
~$ git stash save "message"
```

在指令後方加入save "message"，後續以 `git stash list` 檢視stash時，就可透過message來辨別stash的不同。

## 復原

```console
git stash pop
```

透過 `git stash pop` 可將 `暫存的內容從stash移出並將文件回復` 。

```console
git stash apply
```

`git statsh apply` 與 `git statsh pop` 不同的地方，在於使用apply後，stash內仍保有資料，該方法有助於將資料使用在不同的分支上。

> 在進行多次的Stash後，回復的順序則會從最後一個被Stash的內容開始(Last In, First Out)

## 檢視Stash資訊

```console
~$ git stash list
stash@{0}: WIP on master: 040d019 modified index.js file
stash@{1}: WIP on master: 040d019 modified index.js file
stash@{2}: WIP on master: 092ce08 modifex index.html file
```

### 回復指定的Stash

git stash apply預設回復最近一次stash的內容，我們也可以在指令後方加入stash@{id}來指定要回復的內容。

```console
git stash apply stash@{2}
```

## 丟棄Stash

將Stash內的暫存特定內容丟棄。

```console
~$ git stash drop stash@{2}
```

將Stash內所有內容全部丟棄。

```console
~$ git stash clear
```
