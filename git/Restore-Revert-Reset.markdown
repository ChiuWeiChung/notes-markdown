# Git Restore & Git Revert & Git Reset

> 本文為 [The Git & Github Bootcamp
](https://www.udemy.com/course/git-and-github-bootcamp/
) 之學習筆記，內容經消化吸收後以筆記方式歸納記錄下來。

## Git Resotre

由於 `git checkout` 具備許多的功能， Git 為了不讓使用者產生混淆，推出了 `git restore` 指令，讓使用者避免特意去記 `git checkout blah blah blah` 的複雜指令。

### **還原已改變的內容**

```console
git restore <file-name>
```

與 `git checkout HEAD < filename >` 效果相同，將某個以修改的文件還原至最後一次 commit 的模樣。

### **將文件還原至某個 commit 時期的模樣**

```console
~$ git resotre --source HEAD~1 app.js
or
~$ git resotre --source <commit-hash> app.js
```

`git resotre < file-name >` 的指令是將 HEAD 作為還原的起點，若想要將文件還原至特定的 commit 時期，可以在 `resotre` 後方加入 `--source` 選項，並在選項後方加入要還原的位置 ( commit-hash 或是 HEAD~# )。

### **將暫存區 (Staging Area) 的文件還原**

```console
~$ git resotre --staged <file-name>
```

如果某個文件內容已進行修改並存檔，甚至還透過 git add 將它加入暫存區內，若想將它還原至上一次 commit 的模樣，可以輸入 `git restore --staged < file-name >` 。

---

## Git Reset

### **撤銷 commit & 保留修改的內容**

```console
git reset <commit-hash>
```

若想撤銷前幾次的 commits ，但又不希望內容消失，可以使用 `git reset < commit-hash >` ，此時 repository 會回到特定 commit ，"在其之後的 commits 都會消失，但內容仍會保留"。

### **撤銷 commit & 不保留修改的內容**

```console
git reset --hard <coomit-hash>
```

若不想保留修改內容，可以在 `git reset` 後方加入 `--hard` 選項。

---

## Git Revert

```console
git revert <commit-hash>
```

`git revert` 功能與 `git reset --hard` 類似，都可以進行達到撤銷 commit 內容的功能，但在"歷史紀錄上"不一樣， `git reset` 實際上是將 HEAD 往前移動到特定位置，並刪除其後面的 commits ，而 `git revert` 則是仍會保留該 commit ，並在其後新增一個新的 commit 來撤銷另一個 commit 的內容，因此該 revert 指令後會跳出訊息要求加入新的 commit 。

### **reset 與 revert 的 history 差異:**

目前的 commit 歷史紀錄:

```js        
//  (target)         Master(HEAD)   
//  de42dc7---be2dde---7a0926

```
若使用 `git reset --hard de42dc7` 之後:

```js        
//  Master(HEAD)                   
//    de42dc7---X---X
//    (de42dc7後方的commit都已不存在)
```

若使用 `git revert de42dc7` 之後:

```js        
//                           Master(HEAD)   
//  de42dc7---be2dde---7a0926---d3e6f0
// (在該分支末端新增新commit(d3e6f0)，但僅保留de42dc7的內容)
```

### **Revert 使用時機**

雖然 git reset 以及 git revert 都可將做到還原的功能，但如果是在進行多人共同開發的專案時，使用reset會影響到其他開發同仁的 history ，但 revert 的好處在於，可以達到與 reset 一樣的效果，因為是額外新增一個新的 commit 而非撤銷它。
