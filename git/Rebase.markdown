# Rebase

Git Rebase 使一個使用時必須謹慎但又實用的指令， Rebase 有兩種功用:
1. 用來合併
2. 用來重塑 Git History (將 commit  刪除、改寫、重新命名、重新排序)

## 1. 用來合併

以 Feature Branch Workflow 為例，如下方示意圖，當我們專心在自己的分支 (Feat 分支) 努力工作時，厲害的同仁已完成負責的項目並合併到 main 分支(多出 Main3 merge commit )，此時的我們希望以最新的main commit 為基礎進行開發，所以將其合併到自己負責的分支內，也因此讓分支多出一個合併 commit (Feat3) 。

隨著時間的推移，倘若main的合併越活躍，就會越多合併 commit 出現在所負責的分支 History ，多次合併動作 (main branch->feature branch) ，會導致冗長的 commit History (如 Feat 3 、 Feat 5 ) ，許多的commit僅僅代表合併的操作，而非該分支內容的開發歷程，所幸 Git Rebase 可以幫我們將分支內的歷史重新整理，此舉僅僅是將 commit History 內的 commit 重新排列組合，不會改變程式碼內容，但又可以讓 commit History 看起來更有條理。

```js
//          Before Rebase
//         
//                                (main branch)
//  Main1--- -Main2---------Main3---------Main4
//              |             |            |
//              |            Merge       Merge
//              |             |            |
//              v             v            v
//            Feat1--Feat2--Feat3--Feat4--Feat5
//                                    (feature branch)
```

將位置移動到要重整 History 的分支位置，並輸入 `git rebase main` 。

```console
~$ git switch feature
~$ git rebase main
```

Rebase 會將與 main 有關的 commit (包含合併 commit ，如 Main 3 以及 Main 4 )移到 feature branch 之前，將原本存在於 feature branch 內的合併 commit (如上方的Feat3以及Feat5) 移除，剩餘尾端的就是真正與 feature branch 內容有關的 commit 。該方法僅會讓 feature branch 內的 commit hash 改變，但不會改變其內容。

```js
//          After Rebase
//         
//                       (main)                   
//  Main1--Main2--Main3--Main4--Feat1--Feat2--Feat4
//                                           (feature)
```

> Rebase 前後 的Feat 1 、 Feat 2 、 Feat 4 內容一樣， **但 commit-hash 已經完全不同，因為 Git Rebase 替它們建立新的 commit hash** 。

## 直接幫你合併

事實上，我們也可以直到負責的 feature branch 內容完工後，直接在 feature branch 執行 `git rebase main` 的指令，此時 Git 會幫你直接進行合併、整理的動作，如下方範例:

feature branch 一路上都沒有進行合併的動作，直到完工 (Feat 5 )

```js
//          Before Rebase
//                                        main
//  Main#1----Main#2-------Main#3--------Main#4
//              \
//               \
//                \
//             Feat#1--Feat#2--Feat#3--Feat#4--Feat#5
//                                             feature
```

在 feature branch 位置進行 Rebase 作業

```console
~$ git rebase main
```

執行指令後， commit history 已經被重整，且 main branch 被合併至 feature branch 內部。

```js
//          After Rebase
//         
//                              main
//  Main#1---Main#2---Main#3---Main#4---Feat#1---Feat#2---Feat#3
//                                                        feature
```

## Rebase 的好處

Rebase 的好處在於可以使我們負責的分支有簡潔明瞭的 Hisotry ，並撇除沒那麼重要的合併 commit 。

## 何時不該使用 Rebase

切勿將已經 Push 出去的 Github Repo 進行 Rebase，由於 Rebase 會修改 History ，會讓開發同仁非常困擾。因此我們應該盡量在 Push 之前(與他人共享前)執行 Reabse 。

## Rewriting History

除了作為合併的用途，Rebase 也可以用來將 commit 達到1. 刪除 2. 改寫 3. 重新命名 4. 重新排序 的用途。

```console
~$ git rebase -i HEAD~4
```

在 `git rebase -i HEAD~4` 中的 `-i` 代表 interactive mode ， `HEAD~4` 代表要重塑前 4 個 commits (含 HEAD )。

```console
pick bd1bcc8 add blue in color
pick 562cdff add red in color
pick f20c933 create color.txt
pick 4ee208b initial commit
```

指令輸入後會挑出一個視窗列出各個 commit 的 commit hash 以及 commit message ，其排序由上到下為最舊到最新，在 commit-hash 前方的" `pick` "代表保留該 commit 的意思，" `pick` "可以替換成不同指令。

### 常用的指令有

1. pick:  
"保留該 commit "
2. rework  
"保留該 commit ，但重新修改它的 commit message " 

> 替換成 rework 後儲存並離開該視窗後，會跳出另一個視窗，並要我們修改該 commit message 的內容。

3. edit  
"保留該 commit ，並修改其內容"

4. fixup  
"去除該 commit ，並將其內容合併入前一個 commit (較舊的 commit ) " ; 
5. drop  
"去除該 commit 以及其內容"
