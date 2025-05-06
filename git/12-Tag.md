# Git 標籤（Tags）

標籤是指向 Git 歷史中特定點的指標。我們可以透過標籤來標記某一時間點。標籤最常用來標記專案的版本發佈（如 v2.0.0、v2.1.0 等）。可以將標籤視為不會改變的分支參考。一旦建立標籤，它將永遠指向相同的提交（commit），僅作為該提交的標籤。


## 兩種類型的標籤

Git 提供兩種類型的標籤：輕量標籤（lightweight tag）和註解標籤（annotated tag）。

* 輕量標籤（lightweight tag）：
這只是簡單的名稱或標籤，用來指向特定的提交。

* 註解標籤（annotated tag）：
此類標籤會儲存額外的 meta data，包括作者姓名和電子郵件、日期，以及類似提交訊息的標籤訊息。

## 語意化版本控制（Semantic Versioning）


語意化版本控制規範提供了一種標準化的版本控制系統，讓開發者能為軟體發佈賦予意義（例如：這次發佈的變更程度如何？）。版本號由三個數字組成，以句點分隔。

> 通常，第一次發佈的版本號為 1.0.0。

1. 修補版本（Patch Release）：
修補版本（如：1.0.0 -> 1.0.1）通常不包含新功能或重大變更，只是進行一些錯誤修復或其他不影響使用方式的變更。

2. 次要版本（Minor Release）：
次要版本（如：1.0.0 -> 1.1.0）表示新增了新功能，但仍向下相容，不會造成破壞性變更。這些新增功能是可選的，不需要使用者重寫程式碼。

3. 主要版本（Major Release）：
主要版本（如：1.0.0 -> 2.0.0）表示有重大變更且不再向下相容。某些功能可能被移除或大幅變更。


## 查看標籤

```console
~$ git tag
```

此命令會列出當前儲存庫中的所有標籤。

```console
~$ git tag -l "*beta*"
```

我們可以使用 git tag -l 並傳入萬用字元模式來搜尋符合條件的標籤。例如：git tag -l *beta* 會列出名稱中包含 “beta” 的所有標籤。


## Checking out Tags

```console
~$ git checkout <tag>
```

要查看特定標籤時的專案狀態，可以使用 git checkout <tag>。這會使你進入分離的 HEAD 狀態。


## 建立輕量標籤

```console
~$ git tag <tagname>
```

使用 git tag <tagname> 來建立輕量標籤，該標籤會指向當前 HEAD 所指的提交。


## 建立註解標籤

```console
~$ git tag -a <tagname>
```
使用 git tag -a <tagname> 來建立新的註解標籤。Git 會開啟預設的文字編輯器，提示你輸入標籤訊息。類似於 git commit，也可以使用 -m 參數直接傳入訊息，省去編輯器的操作。


## 查看註解標籤的 metadata

```console
~$ git show <tagname>
```
此命令會顯示特定註解標籤的詳細元資料。


## 標記過去的提交

```console
~$ git tag <tagname> <commit>
```

我們可以不只標記當前 HEAD 的提交，也可以傳入提交雜湊值（commit hash）來標記較早的提交，例如：`git tag -a <tagname> <commit-hash>`。


## Forcing Tags

```console
~$ git tag -f <tagname>
```

如果嘗試重用已存在的標籤，Git 會拒絕並顯示錯誤訊息。使用 -f 參數可以強制覆蓋原標籤。


## 刪除標籤

```console
~$ git tag -d <tagname>
```

要刪除標籤，可以使用 git tag -d <tagname>。

## 推送標籤

```console
~$ git push --tags
```

預設情況下，git push 不會將標籤傳送到遠端伺服器。如果有大量標籤需要推送，可以使用 --tags 選項，將所有本地尚未推送的標籤傳送至遠端。

```console
~$ git push <remote> <tagname>
```

也可以只推送單一標籤，使用 `git push <remote> <tagname>`。

以上內容說明了如何使用 Git 標籤來管理專案的版本，並提供輕量和註解標籤的差異及使用方法。透過標籤，我們能有效標記和管理版本歷史，使開發流程更加有條理。
