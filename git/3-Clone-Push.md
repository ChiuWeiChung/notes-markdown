# Git Clone & Git Push

> 本文為 [The Git & Github Bootcamp
](https://www.udemy.com/course/git-and-github-bootcamp/
) 之學習筆記，內容經消化吸收後以筆記方式歸納記錄下來。


## Git Clone

```console
~$ git clone <URL>
```

在 GitHub 上的專案只要是開放參觀、檢視的，都可以將該專案複製一份到自己的電腦，只需要得到該專案在 GitHub 的 URL ，並在自己電腦上輸入 `git clone < URL >` 指令，即可在當前目錄位置得到該專案內容的repo，因為複製下來的是整個 repo ，所以可直接檢視它的 commit history 。

---

## Git Push

```console
~$ git push <remote> <branch>
```

當我們想將 local repo 推送到 GitHub 上，可以先在 GitHub 建立一個新的 repo ，並複製 GitHub repo 的 URL ，透過透過 `git add < remote-name > < URL >` 告知目的地，再輸入 `git push < remote-name > < branch >` 即可將內容發布到 GitHub remote repo上。其中的 < branch > 指的是"要推送的 local branch 名稱"。

> 若不更動設定的前提下，推送到 GitHub 的指令通常是 git push origin main。

### **推送特定 branch**

```console
~$ git push <remote> <local-branch>:<remote-branch>
```

當我們在使用 `git push` 推送時，若沒有特別指名，預設上 remote branch 與 local branch 的名稱會一樣，但若想要 remote branch 的名稱不一樣時，可以透過 `git push < remote-name > < local-branch >:< remote-branch >` 指令來實現。

### **記住remote的設定**

```console
~$ git push -u origin master
```

在 `git push` 後放若加入 `-u` 時，在該 repo 內， Git 就會幫你記住 remote 的設定，幫你記住推送的目的地 (remote URL) ，以及要推送的 branch ，往後只要輸入 `git push` 指令即可完成推送。

---
