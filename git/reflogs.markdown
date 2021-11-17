# Reflog

## 後悔剛才的 Git 操作嗎? 使用 Reflog 吧!

假設我們搞砸了某些事，例如不小心撤銷重要 commit 或是 Rebase 時弄亂了history ，此時反悔還來得及，因為 Git 總是記錄著我們在 Repo 內的各種操作 (在哪條分支、做了哪些事...)，因此可以透過 Git Reflog 指令來檢視我們的操作紀錄，並且用來恢復失誤的操作。

> Reflog = Reference + Log

## Reflog 只限於在本地端使用，而且會過期

Git總是記錄著我們在 Repo 內的各種操作，並將記錄存放在本地電腦  (Local) 的 . Git/logs 目錄內，也就是無法在遠端 (Remote) 透過 Reflog 來了解其他人在 Repo 內的 Git 操作紀錄。 此外，Reflog 會清除時間較久遠的紀錄 (約 90 天)。

## 檢視Git操作紀錄

```console 
~$ git reflog show HEAD

```

`git reflog show` 或是 `git reflog show HEAD` 會列出在 HEAD 中的操作紀錄，其中 `HEAD@{ 0 }` 代表最新的操作， `HEAD@{ }` 內數字越大，代表時間越久遠。

```console
637517f (HEAD -> master) HEAD@{0}: checkout: moving from the-truth to master
9b86012 (the-truth) HEAD@{1}: checkout: moving from master to the-truth
637517f (HEAD -> master) HEAD@{2}: checkout: moving from the-truth to master
9b86012 (the-truth) HEAD@{3}: checkout: moving from master to the-truth
637517f (HEAD -> master) HEAD@{4}: checkout: moving from the-truth to master
9b86012 (the-truth) HEAD@{5}: commit: modifed diary in truth
3764650 HEAD@{6}: checkout: moving from master to the-truth
637517f (HEAD -> master) HEAD@{7}: commit: love my boss
```

若要檢視在特定分支上的紀錄，也可以輸入 `git reflog show < branch-name >` 。

## Timed References

透過在 `reference@{ }` 內輸入時間點，並搭配 `diff` 、 `checkout` 等指令進行操作。

```console
~$ git diff HEAD HEAD@{2.days.ago}
~$ git diff master master@{yesterday}
~$ git checkout newfeature@{one.day.ago}
~$ git reflog newfeature@{two.days.ago}
~$ git reflog newfeature@{one.minute.ago}
~$ git reflog newfeature@{one.week.ago}
```

## 復原失誤的操作

要復原失誤的操作，首先可以先透過 `git reflog show < reference >` 來檢視該紀錄的位置 ( qualifier ，也就是 @{} 內的數字)，如下方示範如何將失誤的操作復原:

下方是 Git 最初的狀態:

```console
~$ git log --oneline

fb5072a (HEAD -> master) add apple
db727ba add orange
afe0b32 add watermelon
1f29fe9 create fruit.txt
```

假設我因為意外，不小心透過 `git reset --hard` 將 db727ba 後面的 commit 撤銷了 ( commit fb5072a 消失了)。

```console
~$ git reset --hard db727ba
~$ git log --oneline

db727ba add orange
afe0b32 add watermelon
1f29fe9 create fruit.txt
```

此時的我們可以透過 `git reflog show master` 檢視剛才的操作紀錄，其中 `master@{1}` 就是我們想要恢復的位置。

```console
~$ git reflog show master

db727ba (HEAD-> master) master@{0}: reset: moving to db727ba
fb5072a master@{1}: commit: add apple
db727ba (HEAD-> master) master@{2}: commit: add orange
afe0b32 master@{3}: commit: add watermelon
1f29fe9 master@{4}: commit (initial): create fruit.txt
```

透過 `git reset -hard master@{1}` 恢復

```console
~$ git reset --hard  master@{1}
~$ git log --oneline

fb5072a (HEAD -> master) add apple
db727ba add orange
afe0b32 add watermelon
1f29fe9 create fruit.txt
```
