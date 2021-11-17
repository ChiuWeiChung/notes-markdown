# Git Checkout
<!-- # Undoing Changes & Time Traveling -->

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
