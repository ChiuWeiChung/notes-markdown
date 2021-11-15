# Git

Git是一種版本控制系統，目前世上有許多版本控制系統，但Git是世上最有名 (最多人使用)的那一個，而所謂的版本控制系統，是指程式在開發過程中其內容會有所改變，因此我們可以透過版控系統來追蹤以及管理程式碼隨著時間推移而變化的內容。 該軟體可以讓使用著回顧程式碼早期版本的樣貌或是比較不同版本的內容差異等等...

## Git可以達到

* 追蹤文件在不同時期的內容差異
* 追蹤專案在不同版本的差異
* 將程式碼回溯到較早期的版本
* 與他人共同開發程式碼

## Git ≠ Github

Git是在自身電腦運行的版本控制系統，而Github是在網路上託管Git儲存庫(Git Repository)的服務，Git使用者可以將他們的Repository上傳至Github，藉由Github與其他人共同開發、維護、分享程式碼。

> 與Github有著相同功能的服務有許多，如Gitlab、Bitbucket，但Github的使用者較多 

## 儲存庫(Repository)

又可以稱為"Repo"，是指在一個資料夾內，可以透過Git進行程式碼追蹤、維護的工作區域(Workspace)，每當進行一個專案的開發時，會創立一個該專案的資料夾，並在該資料夾內建立新的Repo。每個專案應擁有自己專屬的Repo，Repo與Repo之間是獨立的，不會互相干涉其內容。

## Git Bash

Bash是一種命令列介面(Command Line Interface, CLI)，能執行使用者在窗口輸入的命令，由於Git最初是用於Linux核心開發的版本控制工具，因此被設計成能在Unix-based interface(如Bash)執行的軟體，然而Windows使用的是非Unix-base的CLI(叫做Command Prompt, 命令提示字元)，因此無法直接在Windows系統中進行Git的操作，幸虧Git Bash的出現，讓Windows使用者可以在一個類Bash的環境下執行Git的命令操作。

# Git 工作流程(Git WorkFlow)

Git Workflow可以想像成單機遊戲的存檔流程，謹慎的玩家會在關卡的初期、中期、後期進行存檔的動作，過程中死亡時還可以讀檔避免之前的努力都白費了，而要讓Git追蹤文件在不同時期的變化，也必須在不同時期進行"存檔"的作業，也就是暫存(Stage)以及提交(Commit)的動作。其流程如下:

1. `工作目錄(Working Directory)`:  
在工作目錄下我進行資料的建立、修改、刪除的作業

2. `暫存區域(Staging Area)`:  
將工作目錄下更動的所有(或是部分)內容加入暫存區域

3. `提交(Commit)`:  
將暫存區域的內容提交給Repo，如此一來就完成存檔的作業

```js
//  _________         _______          ______
// |         |  git  |       |  git   |      |
// | Working |  add  |Staging| commit |      | 
// |Directory| ----->| Area  |------->| Repo |  
// |         |       |       |        |      |
// |_________|       |_______|        |______|
```

> 只要在Repo底下，內部的文件、資料夾(包括資料夾中的資料夾及文件)都會被Git追蹤

# Git 基礎指令

## 設定Git Name & Email

```console
~$ git config --global user.name "Rick Chiu"

~$ git config --global user.email <email-name>@gmail.com
```

> --global為全域選項，使用該指令後，只要在該電腦內，即使不同Repo都會套用user name="Rick"以及user email=< email-name >@gmail.com。

## 建立Git Repo

```console
~$ git init
```

在進行Git操作之前，需透過 `git init` 建立一個新的Repo，後續才可以進行Git操作

## 確認狀態

```console
~$ git status
```

`git status` 指令可以提供在工作區域(Working Directory)內的狀態，下方為輸入該指令後出現的資訊:

* Changes to be committed:  
存放的是 **已更動(新增、刪除、修改)的內容，但尚未被放置暫存區(Staging Area)**

* Changes not staged for commit:
存放的是 **已更動(新增、刪除、修改)的內容，且已存放在暫存區，但尚未被提交(Commit)**

```console
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage) 
        modified:   apple.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   banana.txt
```

## 加入暫存區(Staging)

```console
~$ git add 文件名稱
```

透過 `git add 文件名稱` 將特定的文件加入暫存區，也可以透過 `git add .` 將所有更動的內容一次全部加入暫存區。

> 加入暫存區(Staging)這個動作可以想像成提交(commit)的必要前置作業

## 提交(Commit)

```console
~$ git commit -m 'message'
```

透過 `git commit -m message` 指令可以將暫存區內的內容提交給Repo，也就完成了"存檔"的動作，在-m後可以加入此次更動的訊息內容，如fix bugs、add xxx function、...

## 修正上次的提交訊息

若在commit之後才發現Commit Message有錯字，或是忘記將另一個文件加入暫存區時，但又不想要而外加入新commit，可以透過 `git commit --amend` 來進行修正，指令輸入後會跳出一個文件視窗，讓你修正上一次的Commit Message。

```console
~$ git commit -m "some commit"
~$ git add forgotten_file
~$ git commit --amend
```

> 該方法僅能修正最近一次的commit

## 檢視提交的歷史紀錄

```console
~$ git log
```

`git log` 指令可以檢視過去所提交的commit資訊，其中 `git log --oneline` 則是將每則commit資訊簡化，方便閱讀:

```console
54948ab (HEAD -> master) add grape in fruit.txt
1a37821 add banana in fruit.txt
8542b04 add apple in fruit.txt
22a645a create fruit.txt
```

---

## 提交的一些細節

### 原子提交(Atomic Commits)

盡可能地在程式碼經歷獨立事件(功能)的更動後即進行commit的動作，如此一來，當我們檢視每個commit( `git log` )時，每個commit都代表著單一獨立的更動事件，在進行該commit的撤銷或是回溯時不會出現混淆的情況，也可以方便檢視。

**盡量避免下方的commit出現** (下方三個commit都與Toggle Function有關)

```console
f715058 Finish Toggle Function Finally Finished
5aa0893 Toggle Function almost finished
5b4006f add Toggle Function but not finished yet
```

### 以現在式敘述

在[Git官方文件](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)中有提到:  
 Write your commit message in the imperative: "Fix bug" and not "Fixed bug"
or "Fixes bug." 也就是盡量以現在式的動詞來撰寫Commit Message。

---

## 忽略文件

我們可以告訴Git在我們的Repo內，有哪些文件或資料夾不要進行追蹤，這些文件大多是包含重要的機密資訊(如API keys)，只要在Repo的根目錄位置建立.gitignore文件，並把不想被追蹤加入.gitignore內，如此一來，這些機密文件就不會被提交。如下方範例:

```console

apple.txt
忽略名稱為apple.txt的文件

*.txt
忽略所有附檔名是.txt的文件

fruit/
忽略名稱為fruit的資料夾以及在其內部的文件

fruit/banana.txt
# 忽略 fruit目錄下的banana.txt文件

/fruit/*.txt
忽略fruit目錄下附檔名是.txt的文件
```
