<!-- # Undoing Changes & Time Traveling -->

# Git Checkout

git checkout 指令的功能非常多，除了建立分支外，還可以還原文件內容、檢視歷史紀錄 (像時間旅行)。

## 檢視以前的Commit

```console
~$ git checkout <commit-hash>
```

我們可以透過 `git log --oneline` 得知特定的 commit-hash ，並使用 `git checkout < commit-hash >` 來檢視過去 commit 的內容。

### 什麼是Detached Head (斷頭!?)

所謂的 Detached Head 指的是 HEAD 位置不在目前分支的 root commit ，而是位於以前的 commit ，所以輸入指令回到過去 commit 時，會跳出下方訊息告知我們正處於 detached HEAD 狀態。

```console
~$ git checkout 9d12e43
Note: switching to '9d12e43'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.
```

此時的我們可以選擇:

1. 檢視舊 commit 的內容
2. 離開舊 commit ，輸入 `git checkout -` 將 HEAD 移動到上一個所處的位置
3. 在舊 commit 上建立新分支並移動，此時已不處於 detached HEAD 狀態，可以進行內容修改，

> 若要檢視目前位置的前一個 commit ，可以輸入 `git checkout HEAD~1` ，如此就不用再輸入 `git log --oneline` 檢視 commit-hash，同樣道理若想檢視回推 2 個 commit 的內容，則將 `HEAD~1` 內的 1 改成 2 。

## 還原已改變的內容

```console
git checkout HEAD <filename>
```

假設某個文件內容已進行修改並存檔，但事後反悔想"將文件還原到最後一次 commit 的模樣"，可以使用 `git checkout HEAD < filename >` 將特定文件進行還原作業。

> 輸入 `git checkout -- < file-name >` 也可以達到相同效果

---

# Git Restore

文章開頭有提到 git checkout 具備許多的功能， Git 為了不讓使用者產生混淆，推出了 `git restore` 指令，讓使用者避免特意去記 `git checkout blah blah blah` 的複雜指令。

## 還原已改變的內容

```console
git restore <file-name>
```

與 `git checkout HEAD < filename >` 效果相同，將某個以修改的文件還原至最後一次 commit 的模樣。

## 將文件還原至某個 commit 時期的模樣

```console
~$ git resotre --source HEAD~1 app.js
or
~$ git resotre --source <commit-hash> app.js
```

`git resotre < file-name >` 的指令是將 HEAD 作為還原的起點，若想要將文件還原至特定的 commit 時期，可以在 `resotre` 後方加入 `--source` 選項，並在選項後方加入要還原的位置 ( commit-hash 或是 HEAD~# )。

## 將暫存區 (Staging Area) 的文件還原

```console
~$ git resotre --staged <file-name>
```

如果某個文件內容已進行修改並存檔，甚至還透過 git add 將它加入暫存區內，若想將它還原至上一次 commit 的模樣，可以輸入 `git restore --staged < file-name >` 。

---

# Git Reset

## 撤銷 commit & 保留修改的內容

```console
git reset <commit-hash>
```

若想撤銷前幾次的 commits ，但又不希望內容消失，可以使用 `git reset < commit-hash >` ，此時 repository 會回到特定 commit ，"在其之後的 commits 都會消失，但內容仍會保留"。

## 撤銷 commit & 不保留修改的內容

```console
git reset --hard <coomit-hash>
```

若不想保留修改內容，可以在 `git reset` 後方加入 `--hard` 選項。

---

# Git Revert

```console
git revert <commit-hash>
```

`git revert` 功能與 `git reset --hard` 類似，都可以進行達到撤銷 commit 內容的功能，但在"歷史紀錄上"不一樣， `git reset` 實際上是將 HEAD 往前移動到特定位置，並刪除其後面的 commits ，而 `git revert` 則是仍會保留該 commit ，並在其後新增一個新的 commit 來撤銷另一個 commit 的內容，因此該 revert 指令後會跳出訊息要求加入新的 commit 。

## reset 與 revert 在使用後的 history 差異:

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

## Revert 使用時機

雖然 git reset 以及 git revert 都可將做到還原的功能，但如果是在進行多人共同開發的專案時，使用reset會影響到其他開發同仁的 history ，但 revert 的好處在於，可以達到與 reset 一樣的效果，因為是額外新增一個新的 commit 而非撤銷它。
