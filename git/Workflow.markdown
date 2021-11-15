# Git 的工作流程 (Git Workflows):

## 1. Centralized Workflow

Centralized Workflow，白話一點就是"全部的人都在master branch進行開發"的一種工作流程，這種方法優點是運作起來直覺、簡單，較適合運用在小型且開發人數少的專案上，但缺點就在於合併(merge)過程中會花許多時間在解決衝突的問題上，尤其是當專案的規模越來越龐大時，所需要檢閱的衝突資訊越多。

--- 

## 2. Feature Branch Workflow

相對於Centralized Workflow而言，Feature Branch Workflow則是將master branch奉為不可隨意侵犯的分支，開發夥伴必須在各自的feature branch進行開發，也因此透過這樣的工作流程，同仁可以在各自負責的feature branch分享程式碼，也不會搞亂master branch的內容。

### 合併Feature Branch

專案開發到最後仍需將feature branch的內容合併到master branch，在合併之前，我們多少都會先與團隊討論feature branch是否已成熟到可以合併的時機，並且確認內部是否還有bug還沒清除，然而在專案規模變大的情況下可能會有許多的features等待著合併，也因此會耗上許多溝通以及時間成本。

## Github上的 Pull Request

Github以及Bitbucket都提供了**Pull Request**的功能(簡稱PR)來促進溝通的效率，使用者透過該功能可以"**通知**"團隊內的同仁(上司)，就像是在告訴他們「我認為我的修改內容準備好了，請你們review我的程式碼，確認是否可以合併至master branch」，若上司認為「很好! 沒問題~」，就會確認並進行合併，若認為內容可以再改進，會在平台上回饋一些意見並拒絕這次的PR。

### 流程:

1. 在負責的feature branch進行開發
2. 將修改後的feature branch推送(PUSH)到Github上
3. 在feature branch的位置按下Pull Request按鈕
4. 同仁(上司)Review你的程式碼
5. 接受並合併或是退回繼續修改

--- 

## 3. Forking Workflow: 

假如我們在Github上發現了一個開源專案非常有興趣，而且認為內容可以更好或想加入其他功能，想要奉獻自己的一份心力，但又礙於沒有開發權限或是專案作者對於開放權限有所疑慮的時候，我們可以透過Github提供的Fork機制來"間接參與"專案的開發。

本文章最初提到的兩種(Centralized & Feature Branch)都是在"原作者的Repo底下進行開發"，Forking Workflow則是"複製(Fork)一份原作者的Repo到自己的GitHub內"。工作流程的示意圖如下:

### 流程:

1. 將原作Repo透過Fork複製到自己的Github(Fork Repo)
2. 從Fork Repo Clone一分到自己的電腦(Local Repo)
3. 在Local Repo進行修改，並Push到Fork Repo
4. 若想將改內容併入原專案，在Github Fork Repo向原作者提出Pull Request

```js        
//             原作者的Repo
//               /   \        
//              /     \        
//             /       \        
//          Fork &      \        
//      Pull Request    Pull
//          /             \
//         /               \
//        /       Push      \
//  Fork Repo------ & ------Local Repo
//    (Github)    Clone     (我的電腦)

```

Github 允許我們透過Fork機制"複製"他人的Repo，並在自己的Github Repo上開發，而後再像原作者提出Pull Request，就像是在告訴原作者「Hi，我針對了某某功能進行了添加/優化，我認為這使該專案更加完善，如果你認為不錯，請收下它。」的概念。
