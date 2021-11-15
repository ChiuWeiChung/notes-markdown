# Github

Github是一個基於Git的repository託管平台，可以用來存放repository，藉此我們可以隨時隨地存取或分享我們的repo，但它最大的賣點在於"與他人合作進行專案開發"。

1. 合作  
透過Github平台，我們可以自己開啟一項專案，並邀請志同道合的朋友一起進行開發。

2. 開源專案  
許多著名的開源專案都將repo部署在Github上，如[React](https://github.com/facebook/react)也將Github作為他們的家，在上面有許多來自世界各地的人都一起對這個專案進行開發。也可

3. 曝光  
我們可以將作品部署在Github上，藉此作為作品展示的平台

# 遠端 (Remote)

若我們想將repo從本地端(local)推送到Github，需先告知Git推送的"目的地"，目的地在Git內又被稱為remote(遠端)，"目的地"需包含兩個資訊，分別為1. 名稱(remote name)以及2. 地址(remote URL)。

## 檢視遠端

當我們已經從Github上複製一份repo到電腦中，此時就可以透過 `git remote` 或 `git remote -v` 來檢視該remote名稱以及URL。

```console
~$ git remote -v
origin  https://github.com/Chiuweichung/xxx (fetch)
origin  https://github.com/Chiuweichung/xxx (push)
```

## 新增遠端

若要將電腦中的repo推送到Github平台上，需先告知Git推送的目的地，就像是寄送貨物時告知貨運司機送貨地址一樣，透過 `git remote add < remote-name > < URL >` 指令，其中的origin是remote的名稱，< URL >則是remote的位置。

```console
~$ git remote add <remote-name> <URL>
```

```console
~$ git remote add origin https://github.com/ChiuWeiChung/xxx.git
```

### 什麼是Origin?

origin並非那麼特別，當我們從Github複製一項repo時，它的"預設remote名稱就是origin"，origin僅僅是remote名稱，用來代表該URL，事實上我們可以將origin改成任何名子。

# Git Clone

```console
~$ git clone <URL>
```

在Github上的專案只要是開放參觀、檢視的，都可以將該專案複製一份到自己的電腦，只需要得到該專案在Github的URL，並在自己電腦上輸入 `git clone < URL >` 指令，即可在當前目錄位置得到該專案內容的repo，因為複製下來的是整個repo，所以可直接檢視它的commit history。

# Git Push

```console
~$ git push <remote> <branch>
```

當我們想將local repo推送到Github上，可以先在Github建立一個新的repo，並複製Github repo的URL，透過透過 `git add < remote-name > < URL >` 告知目的地，再輸入 `git push < remote-name > < branch >` 即可將內容發布到Github remote repo上。其中的< branch >指的是"要推送的local branch名稱"。

> 若不更動設定的前提下，推送到github的指令通常是 git push origin main

### Push特定 branch

```console
~$ git push <remote> <local-branch>:<remote-branch>
```

當我們在使用 `git push` 推送時，若沒有特別指名，預設上remote branch與local branch的名稱會一樣，但若想要remote branch的名稱不一樣時，可以透過 `git push < remote-name > < local-branch >:< remote-branch >` 指令來達成。

### 記住remote的設定

```console
~$ git push -u origin master
```

在 `git push` 後放若加入-u時，在該repo內，Git就會幫你記住remote的設定，幫你記住推送的目的地(remote URL)，以及要推送的branch，往後只要輸入 `git push` 指令即可完成推送。

# 遠端分支 (Remote Branch)與本地分支(Local Branch)

## 什麼是遠端追蹤分支(Remote Tracking Branches)?

遠端追蹤分支是作為local branch與remote branch的橋樑，標記如< remote >/< branch >，稱為remote reference。例如origin/master表示remote repo的master branch。如下方示意:

在Github上的remote repo (又稱origin)

```js        
//                       master
//  de4a8f0---b158d7a---3e6a4c9
// 

```

從Github Clone下來的local repo，起初head與remote reference(origin/master)都指向同一個commit(3e6a4c9)。

```js        
//                    master(HEAD)   
//  de4a8f0---b158d7a---3e6a4c9
//                   (origin/master)
```

若我們在local repo下了一個commits，此時local repo內的HEAD移至新commit(1e5a6df)，但remote reference仍不變。

```js        
//                              Master(HEAD)   
//  de4a8f0---b158d7a---3e6a4c9---1e5a6df
//                   (origin/master)

```

輸入git status可以看到下方資訊，其中的"Your branch is ahead of 'origin/master' by 1 commits."，這是因為remote reference起到了"書籤"的作用，Git此時知道local repo相較remote repo多出了1個commit。

```console
~$ git status
On branch current
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

> Remote Tracking Branch可以想像成"書籤"的概念，作為本地與遠端之間的標記

## 檢視Remote Checking Branch內容

```console
~$ git checkout origin/master
```

透過 `git checkout origin/master` 可以達到Detached HEAD的效果，用來檢視當初從remote repo複製下來時的模樣。

## 檢視remote repo有多少Branches

當我們從Github複製repo時，僅會出現存在這master(or main) branch，其他branch並不會馬上出現在local repo內，若輸入 `git branch` 也只會出現master branch存在。但若輸入 `git branch -r` 則可檢視remote repo有多少branches。

```console
~$ git branch 
master

~$ git branch -r
origin/HEAD -> origin/master
origin/ master
origin/ food 
origin/ music
```

## 連結remote與local的Branch

若僅僅要檢視remote repo內的food branch內容，可以只輸入 `git chekcout origin/food` 來做到detached HEAD，但若要在local repo內建立一個如remote repo的food branch，可以輸入 `git switch food` 指令。

```console
~$ git switch <remote branch name>
```

# Git Fetch

當我們只想確認remote repo的內容但不是真的想合併時，我們可以輸入 `git fetch < remote name >` 指令將remote repo內所有更新的資料(含所有分支)下載到local repo，這個動作僅會更新遠端追蹤分支(Remote Checking Branch)內的資料，也因此，"更新的內容不會自動整合到工作目錄內"，也就是說，我們能夠檢視remote repo內有哪些內容的改變，但不會合併(merge)到local repo之中。

```console
~$ git fetch <remote name>
```

若僅想要fetch remote repo上特定的分支，使用 `git fetch < remote name > < branch >`

```console
~$ git fetch <remote> <branch>
```

## 檢視fetch的內容

因為fetch不會進行合併動作，更新的內容不會出現在工作目錄內，若想要檢視master更新了哪些內容，可以使用 `git checkout origin/master` 指令。

```console
~$ git checkout <remote/branch>
```

# Git Pull

有別於 `git fetch` ， `git pull` 指令除了將remote repo的更新資料下載到local repo外，還會進行合併的動作。

```console
~$ git pull <remote> <branch>
```

因此 `git pull` 可以想像成 `git fetch` + `git merge` ，需注意的是，在執行pull時，所處的分支位置就是更新內容會合併進入的位置，假設我在food branch上輸入指令 `git pull origin master` ，這個操作會將remote master branch所更新的內容合併至目前所處的food branch上。

### git pull的預設值

```console
~$ git pull
```

在沒有指定remote以及branch的情況下直接執行 `git pull` 的話，Git會將remote名稱預設為origin，branch name則以當下所在的分支名稱作為預設值來執行指令。

# Git Fetch V. S Git Pull

Git Fetch                                                   | Git Pull                           |
:-----------------------------------------------------------|:-----------------------------------|
|   將更新的內容從遠端下載至本地端                    |   將更新的內容從遠端下載至本地端          |
| 僅更新遠端追蹤分支(Remote Tracking Branch)    |  更新內容會合併到所在的分支         |
|  不會進行合併衝突                                  |  有機會造成合併衝突                      |
|  不會弄亂當前工作目錄                              |  不建議在有uncommitted changes的情況使用  |
