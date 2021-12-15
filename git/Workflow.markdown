# Git 的工作流程 (Git Workflows):

> 本文為 [The Git & Github Bootcamp
](https://www.udemy.com/course/git-and-github-bootcamp/
) 之學習筆記，內容經消化吸收後以筆記方式歸納記錄下來。

## 1. Centralized Workflow

Centralized Workflow ，白話一點就是"全部的人都在 master branch 進行開發"的一種工作流程，這種方法優點是運作起來直覺、簡單，較適合運用在小型且開發人數少的專案上，但缺點就在於合併 (merge) 過程中會花許多時間在解決衝突的問題上，尤其是當專案的規模越來越龐大時，所需要檢閱的衝突資訊越多。

--- 

## 2. Feature Branch Workflow

相對於 Centralized Workflow 而言， Feature Branch Workflow 則是將 master branch 奉為不可隨意侵犯的分支，開發夥伴必須在各自的 feature branch 進行開發，也因此透過這樣的工作流程，同仁可以在各自負責的 feature branch 分享程式碼，也不會搞亂 master branch 的內容。

### 合併 Feature Branch

專案開發到最後仍需將 feature branch 的內容合併到 master branch ，在合併之前，我們多少都會先與團隊討論 feature branch 是否已成熟到可以合併的時機，並且確認內部是否還有 bug 還沒清除，然而在專案規模變大的情況下可能會有許多的 features 等待著合併，也因此會耗上許多溝通以及時間成本。

## GitHub上的 Pull Request

 GitHub 以及 Bitbucket 都提供了 **Pull Request** 的功能 (簡稱 PR ) 來促進溝通的效率，使用者透過該功能可以"**通知**"團隊內的同仁(上司)，就像是在告訴他們「我認為我的修改內容準備好了，請你們 review 我的程式碼，確認是否可以合併至 master branch 」，若上司認為「很好! 沒問題~」，就會確認並進行合併，若認為內容可以再改進，會在平台上回饋一些意見並拒絕這次的 PR 。

### 流程:

1. 在負責的 feature branch 進行開發
2. 將修改後的 feature branch 推送 (PUSH) 到 GitHub 上
3. 在feature branch的位置按下Pull Request按鈕
4. 同仁(上司)Review你的程式碼
5. 接受並合併或是退回繼續修改

--- 

## 3. Forking Workflow: 

假如我們在 GitHub 上發現了一個開源專案非常有興趣，而且認為內容可以更好或想加入其他功能，想要奉獻自己的一份心力，但又礙於沒有開發權限或是專案作者對於開放權限有所疑慮的時候，我們可以透過 GitHub 提供的 Fork 機制來"間接參與"專案的開發。

本文章最初提到的兩種 (Centralized & Feature Branch) 都是在"原作者的 Repo 底下進行開發"， Forking Workflow 則是"複製 (Fork) 一份原作者的 Repo 到自己的 GitHub 內"。工作流程的示意圖如下:

### 流程:

1. 將原作 Repo 透過 Fork 複製到自己的 GitHub (Fork Repo)
2. 從 Fork Repo Clone 一分到自己的電腦 (Local Repo)
3. 在 Local Repo 進行修改，並 Push 到 Fork Repo 
4. 若想將改內容併入原專案，在 GitHub Fork Repo 向原作者提出 Pull Request 

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
//    (GitHub)    Clone     (我的電腦)

```

GitHub 允許我們透過 Fork 機制"複製"他人的 Repo ，並在自己的 GitHub Repo 上開發，而後再像原作者提出 Pull Request ，就像是在告訴原作者「 Hi ，我針對了某某功能進行了添加/優化，我認為這使該專案更加完善，如果你認為不錯，請收下它。」的概念。
