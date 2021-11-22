# Git Diff & Git Stash


## Git Diff

Git Diff 指令可以用來比對程式碼處於不同的 Commits、Branches 、工作目錄上的差異 (通常為了檢視過去與現在的歷程內容差異，因此常搭配 `git status` 以及 `git log` 一起使用)。

### **內容資訊**

在比較兩文件的差異時，假如指令先輸入 A 文件，再輸入 B 文件，則 Git 提供的資訊會是 `由 A 演變至 B 的沿革` (若先 B 再 A ，則 B -> A 的沿革)，其內容以減號 ( - , 被刪出的內容) 以及加號 ( + , 被加入的內容) 分別代表 A 及 B 的變化，其內容僅顯示有差異的地方及部分前後文。

如下方範例，若透過 `git diff`顯示 oldFruit 及 newFruit 的變化:

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

Git 所提供的資訊中，被@@前後包圍的內容( -1, 3 +1, 4 )表示:
* 在 oldFruit 內，擷取第 1 到第 3 行資訊 (apple, strawberry, grape)
* 在 newFruit 內，擷取第 1 到第 4 行資訊 (apple, orange, grape, guava)

```console
@@ -1,3 +1,4 @@ 
 apple
-strawberry
+orange
 grape
+guava
```

## Diff 指令

### **比較 Unstaged 文件與前次 Commit 的差異**

```console
~$ git diff
```

所謂的 Unstaged 代表 `已修改但尚未被放到暫存區 (Staging Area) 的文件` (沒被 git add 帶入的文件)，我們可以透過 `git diff` 觀察當前工作目錄下"文件在 Unstaged 狀態與前一次 Commit 的差異"。

> 文件若處於 Staged 的情況下， `git diff` 不會顯示差異

### **比較 Working Directory 與前次 Commit 的差異**

```console
git diff HEAD
```

此時 Unstaged 以及 Staged 文件都會被考慮到，並與前次 Commit 做比較 (意即 HEAD 與目前 Working Directory 的差異)，如下範例:

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

### **比較 Staged 文件與前次 Commit 差異**

```console
git diff --staged
git diff --cached
```

`git diff --staged` 以及 `git diff --cached` 都可以用來列出文件在 Staging Area 中與前次 Commit 的差異。

### **針對特定文件做比較**

```console
git diff HEAD [filename] 
git diff --staged [filename]
```

在後方加入文件名稱可以針對該文件做比較。

### **比較不同分支**

```console
git diff branch1..branch2
```

`git diff branch1..branch2` 會列出兩分支 `末端` 的差異。

### **比較不同 Commits**

```console
git diff commit1..commit2
```

`git diff commit1..commit2` 會列出兩 Commit `末端` 的差異。

### **與前次 Commit 比較**

```console
git diff HEAD~1
```

若要比較當前 HEAD 與前一次 Commit 的差異，如此一來就可以不用透過 git log 去查詢前一次的 commit hash 。

---

## Git Stash 

### **暫存**

當我們想要 Switch 到其他分支時，可能因工作目錄內的某些文件已被修改，但尚未被 commit 時，就會出現下方錯誤訊息:

```console
error: Your local changes to the following files would be overwritten by checkout: XXX.html
Please commit your changes or stash them before you switch branches.
```

若不想將文件馬上 commit ，可以透過 `git stash` 將未被 commit 內容"藏起來"，也就是回復到當初 HEAD 的狀態。

```console
~$ git stash
```

`git stash` 是非常有用的指令，可以將尚未準備被 commit 的內容存起來，該指令會將 `staged以及unstaged的內容都藏起來` 。

```console
~$ git stash save "message"
```

在指令後方加入 `save "message"`，後續以 `git stash list` 檢視 stash 時，就可透過 message 來辨別 stash 的不同。

### **復原**

```console
git stash pop
```

透過 `git stash pop` 可將 `暫存的內容從 stash 移出並將文件回復` 。

```console
git stash apply
```

`git statsh apply` 與 `git statsh pop` 不同的地方，在於使用 apply 後， stash 內仍保有資料，該方法有助於將資料使用在不同的分支上。

> 在進行多次的 Stash 後，回復的順序則會從最後一個被Stash的內容開始(Last In, First Out)

### **檢視 Stash 資訊**

```console
~$ git stash list
stash@{0}: WIP on master: 040d019 modified index.js file
stash@{1}: WIP on master: 040d019 modified index.js file
stash@{2}: WIP on master: 092ce08 modifex index.html file
```

### **回復指定的 Stash**

`git stash apply` 預設回復最近一次 stash 的內容，我們也可以在指令後方加入 `stash@{id}` 來指定要回復的內容。

```console
git stash apply stash@{2}
```

### **丟棄Stash**

將 Stash 內的暫存特定內容丟棄。

```console
~$ git stash drop stash@{2}
```

將 Stash 內所有內容全部丟棄。

```console
~$ git stash clear
```
