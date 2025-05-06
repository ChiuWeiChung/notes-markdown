# Git Fetch & Git Pull

> 本文為 [The Git & Github Bootcamp
](https://www.udemy.com/course/git-and-github-bootcamp/
) 之學習筆記，內容經消化吸收後以筆記方式歸納記錄下來。

## Git Fetch

當我們只想確認 remote repo 的內容但不是真的想合併時，我們可以輸入 `git fetch < remote name >` 指令將 remote repo 內所有更新的資料 (含所有分支) 下載到 local repo ，這個動作僅會更新遠端追蹤分支 (Remote Checking Branch) 內的資料，也因此，"更新的內容不會自動整合到工作目錄內"，也就是說，我們能夠檢視 remote repo 內有哪些內容的改變，但不會合併 (merge) 到 local repo 之中。

```console
~$ git fetch <remote name>
```

若僅想要 fetch remote repo 上特定的分支，使用 `git fetch < remote name > < branch >`

```console
~$ git fetch <remote> <branch>
```

## 檢視 fetch 的內容

因為 fetch 不會進行合併動作，更新的內容不會出現在工作目錄內，若想要檢視 master 更新了哪些內容，可以使用 `git checkout origin/master` 指令。

```console
~$ git checkout <remote/branch>
```
---

## Git Pull

有別於 `git fetch` ， `git pull` 指令除了將 remote repo 的更新資料下載到 local repo 外，還會進行合併的動作。

```console
~$ git pull <remote> <branch>
```

因此 `git pull` 可以想像成 `git fetch` + `git merge` ，需注意的是，在執行 pull 時，所處的分支位置就是更新內容會合併進入的位置，假設我在 food branch 上輸入指令 `git pull origin master` ，這個操作會將 remote master branch 所更新的內容合併至目前所處的 food branch 上。

### git pull 的預設值

```console
~$ git pull
```

在沒有指定 remote 以及 branch 的情況下直接執行 `git pull` 的話， Git 會將 remote 名稱預設為 origin，branch name 則以當下所在的分支名稱作為預設值來執行指令。

# Git Fetch V. S Git Pull

Git Fetch                                                   | Git Pull                           |
:-----------------------------------------------------------|:-----------------------------------|
|   將更新的內容從遠端下載至本地端                    |   將更新的內容從遠端下載至本地端          |
| 僅更新遠端追蹤分支(Remote Tracking Branch)    |  更新內容會合併到所在的分支         |
|  不會進行合併衝突                                  |  有機會造成合併衝突                      |
|  不會弄亂當前工作目錄                              |  不建議在有 uncommitted changes 的情況使用  |
