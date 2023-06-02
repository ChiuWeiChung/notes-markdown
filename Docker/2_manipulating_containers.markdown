# Docker 指令筆記 

## 指定特定 Image 並執行 Container 

```console
$ docker run <name of image>
```
在 `docker run <name of image>` 命令中，每個部分的含義如下：

```console
           用於執行 Container
                  ▲
                  │
┌────────────┬────┴──────┬─────────────────┐
│            │           │                 │
│   docker   │    run    │ <name of image> │
│            │           │                 │
└─────┬──────┴───────────┴─────────┬───────┘
      │                            │
      ▼                            ▼
Docker 引擎的命令行工具。     Image 的名稱或標籤
```
當我們執行 `docker run <name of image>` 指令時，Docker 將下載對應的 Image（如果尚未下載），下載完成後，Docker 將使用該 Image 創建和執行 Container。

>如果 Docker 在本地端找不到指定名稱或標籤的 Image ，它將嘗試從 Docker Hub（https://hub.docker.com）發出請求，下載對應的 Image 到本地端。Docker Hub 是由 Docker 公司提供的一個網路服務，用於存儲、分享和管理 Docker 映像。Docker Hub 提供了一個集中化的平台，讓開發人員可以方便地找到、下載和使用他人創建的 Image，同時也可以將自己創建的 Image 上傳到 Docker Hub。


## **啟動 Container 並執行特定的命令**

下方的例子中，`docker run busybox` 這個指令會基於 busybox Image 來啟動 Container。`由於沒有指定啟動 Container 後要做什麼事，因此 Container 在啟動後立即退出`。這是因為 busybox Image 本身只提供了基本的命令行工具，而沒有預設的應用程序運行。

```console
$ docker run busybox
```
如果我們希望在 busybox Container 內執行特定命令，我們可以執行 `docker run <image name> <command>`，例如：

```console
$ docker run busybox echo "Hello, World!"
```

這將在 busybox Container 內執行 `echo "Hello, World!"` 命令，並輸出 "Hello, World!"。

>BusyBox 是一個開源的輕量級工具集合，旨在為嵌入式系統和輕量級 Container 提供一個小巧而高效的 Unix 工具集。它將許多常用的 Unix 工具（如 shell 命令、文件工具、網絡工具等）整合到一個單一的可執行文件中。

## **在背景中執行 Container**
在 Docker 中，-d 是 docker run 命令的一個選項，代表 "detached" 或 "daemon" 模式。使用 -d 選項運行 Container 表示將 Container 在背景中運行，並將其與終端解除關聯。

```console
docker run -d <image name> 
```

## **列出正在執行的 Docker Container**

`docker ps` 的主要用途是查看目前正在執行的 Container ，以便監視 Container 的狀態、資源使用情況和執行狀態。

```console
docker ps
```

### 顯示所有 Container 的資訊
`docker ps --all` 命令將顯示所有 Container 的資訊，包括正在執行的 Container 和已停止的 Container 。它會列出 Container 的相同資訊，但包括已經結束執行的 Container 。這對於查看所有 Container 的執行歷史以及檢查停止的 Container 的詳細資訊很有用。

```console
docker ps --all 
```

## **Container 的生命週期**

`docker run <image-id>` 事實上可以視為 `docker create <image-id>` 和 `docker start <container-id>` 的結合操作，下方的範例中，我們透過 `create` 以及 `start`，來介紹 Container 的生命週期。下方是一個描述 Docker Container 生命週期圖示。

```console
                                   ┌──────Docker Container──────┐
                                   │ ┌────────────────────────┐ │
                                   │ │  Running process       │ │
                                   │ └───────┬────────────────┘ │
                                   │         ▼                  │
                                   │ ┌──────────────────────────┼───┐
┌───────────────────────────────┐  │ │     Kernel               │   │
│         Docker Image          │  │ └───────┬──────────────────┼───┘
├───────────────┬───────────────┤  │         ▼                  │
│  File System  │ Start Command │  │ ┌─────┐ ┌─────┐ ┌─────────┐│
├───────────────┼───────────────┤  │ │ CPU │ │ RAM │ │ Network ││
│               │               │  │ └─────┘ └─────┘ └─────────┘│
│    busybox    │   >Run echo   │  │                            │    
│               │ "hello world" │  │                            │ 
│               │               │  │                            │ 
└───────────────┴───────────────┘  └────────────────────────────┘
```

* Docker Image：Docker Image 是 Container 的基礎，它包含了運行 Container 所需的所有文件系統、程式碼、工具和依賴項。Docker Image 是靜態且不可更改的。
* File System：在 Container 運行之前，Docker會根據Docker Image 創建一個 Container 文件系統。該文件系統是一個獨立且可讀寫的環境， Container 在其中運行。
* Start Command：啟動命令指定 Container 的執行方式。在此示例中，啟動命令是執行echo "hello world"。
* Running process：啟動 Container 後，Docker會在 Container 內部運行指定的命令。在這裡， Container 內運行echo "hello world"命令並輸出結果。
* Kernel： Container 運行在主機的操作系統內核之上。它使用主機的資源和操作系統功能，但具有獨立的環境。
* CPU、RAM、Network： Container 可以使用主機的 CPU、記憶體和網絡資源，這使得它們能夠運行應用程式並與外部進行通訊。


```console
$ docker create busybox
d08ccbccd6c5671da0e33e7e600d...
```
當執行 `docker create busybox` 時，busybox Image 會被用來創建一個新的 Docker Container。該 Container 將包含一個正在運行的進程以及相關的資源，如 CPU、RAM busybox 的檔案和相關資源（例如配置文件、程式庫等）將被複製到 Container 中。如此一來， Containr 就能夠使用 busybox 提供的各種命令和工具。

```console
                                   ┌──────Docker Container──────┐
                                   │ ┌────────────────────────┐ │
                                   │ │  Running process       │ │
                                   │ └───────┬────────────────┘ │
                                   │         ▼                  │
                                   │ ┌──────────────────────────┼───┐
┌───────────────────────────────┐  │ │     Kernel               │   │
│         Docker Image          │  │ └───────┬──────────────────┼───┘
├───────────────┬───────────────┤  │         ▼                  │
│  File System  │ Start Command │  │ ┌─────┐ ┌─────┐ ┌─────────┐│
├───────────────┼───────────────┤  │ │ CPU │ │ RAM │ │ Network ││
│               │               │  │ └─────┘ └─────┘ └─────────┘│
│     busybox   │   >Run echo   │  │ ┌─────────────────────────┐│    
│               │ "hello world" │  │ │   busybox               ││ 
│               │               │  │ └─────────────────────────┘│ 
└───────────────┴───────────────┘  └────────────────────────────┘
```

```console
$ docker start d08ccbccd6c5671da0e33e7e600d70da28978108345e7c6ccc3a2c63eac33fc5
```
當執行 `docker start <container-id>` 時，Docker 啟動了該容器並執行了 `echo hi there` 命令。這個命令在容器內部運行，並將 "hi there" 輸出到標準輸出

```console
                                   ┌──────Docker Container──────┐
                                   │ ┌────────────────────────┐ │
                                   │ │ echo "hello world"     │ │
                                   │ └───────┬────────────────┘ │
                                   │         ▼                  │
                                   │ ┌──────────────────────────┼───┐
┌───────────────────────────────┐  │ │     Kernel               │   │
│         Docker Image          │  │ └───────┬──────────────────┼───┘
├───────────────┬───────────────┤  │         ▼                  │
│  File System  │ Start Command │  │ ┌─────┐ ┌─────┐ ┌─────────┐│
├───────────────┼───────────────┤  │ │ CPU │ │ RAM │ │ Network ││
│               │               │  │ └─────┘ └─────┘ └─────────┘│
│     busybox   │  >Run echo    │  │ ┌─────────────────────────┐│    
│               │ "hello world" │  │ │   busybox               ││ 
│               │               │  │ └─────────────────────────┘│ 
└───────────────┴───────────────┘  └────────────────────────────┘
```

## **查看 Container 的輸出**

在 `docker start` 命令中，-a 選項用於附加（Attach）到正在執行的 Container 的標準輸入、標準輸出和標準錯誤。它允許我們在控制台上即時查看 Container 的輸出。

```console
$ docker start -a <container-id>
```

當我們執行 `docker start -a <container-id>` 時，Docker 將會連接到 Container 的標準輸出，並將其輸出到我們的控制台。這樣我們就可以即時看到 Container 內部的輸出，例如日誌、錯誤消息或命令行應用程序的輸出。

使用 -a 選項可以讓我們與 Container 進行交互，觀察其執行狀態或獲取輸出，而無需手動附加到 Container 。這在需要檢查 Container 輸出或調試問題時非常有用。

`docke run` 相當於 `docker create` + `docker start`。而 `"-a"` 命令是讓 Docker 監聽 container 的輸出，並將其輸出到終端機。因此，`"-a"` 具體意思是 "監聽從其輸出的內容並在我的終端機上輸出它"。


## **檢視 Container 的輸出**

在運行 docker start 時忘記使用 -a 選項來查看 Container 的輸出，我們可以使用 `docker logs <container-id>`，其中的 `docker logs` 命令讓我們可以檢視 Container 生成的 log。包含 Container `在運行期間輸出的信息`，例如應用程序的輸出、錯誤消息、警告等。

```console
$ docker create busybox echo hi there
$ docker start ab3380b2e01a
$ docker logs ab3380b2e01a 
hi there
```


## **重啟已停止的 Containers**
要重啟已停止的 Container，可以使用 docker start 命令。如下方範例：

```console
<!-- 先查看所有 Container 的列表，並確認要重啟的 Container 的名稱或 ID。 -->
$ docker ps --all
<!-- 啟動指定的 Container  -->
$ docker start <container id>
```

## **清理 Docker 中未使用的資源**

```console
$ docker system prune
```
`docker system prune` 命令是 Docker 中的一個清理命令，它用於`清理系統中的未使用的資源`。當使用 Docker 時，容易因為過多的 container、image和網絡等資源占用過多的空間，進而影響到系統的執行效率和性能。使用 docker system prune 命令可以清理掉這些未使用的資源，從而釋放空間和資源，提高系統效率和性能。該命令可以一次性清理未使用的 container、image、網絡等資源。需要注意的是，該命令會清理掉所有未使用的資源，因此在使用時應該謹慎操作，避免誤刪重要資源。

## **停止運行中的 Container**
使用 `docker stop` 命令可以向 Container 發送停止信號，讓 Container `優雅的關機`。它會執行相應的關機程序，停止運行並釋放資源。

```console
$ docker stop <container-id>
```
所謂`優雅的關機`是指 Container 有機會執行這些清理操作並正確地終止應用程序，以確保資源的正確釋放。

相反的，不優雅的關機（Forceful Shutdown）是指 Container 在接收到停止信號後，立即停止運行，無論應用程序是否處於正常狀態或完成當前操作。使用 `docker kill` 指令相當於直接終止 Container ，而不會給予 Container 進行清理或保存狀態的機會。這可能會導致未完成的操作、資料丟失或應用程序的不一致性。

```console
$ docker kill <container-id>
```

## **在 Container 內執行命令**
在 Docker CLI 中，`docker exec` 命令用於`在執行中的 Docker Container 內執行命令`。它的基本用法如下：

```console
$ docker exec [OPTIONS] <container id> COMMAND [ARG...]
```
* docker exec：這是 Docker 的一個命令，用於在運行中的 Container 內執行命令。
* [OPTIONS]：這是 docker exec 命令的選項，用於指定額外的選項和標誌來自定義命令的行為。一些常見的選項包括:
  * -i: 保持 STDIN 開啟，允許我們與命令進行交互
  * -t: 為執行的命令分配一個虛擬終端（TTY）。
  * -e: 設定環境變量。
* COMMAND：這是要在 Container 內執行的命令。它可以是任何有效的命令，例如 shell 命令、應用程序命令等。
* [ARG...]：這是可選的命令參數，用於傳遞給命令的附加參數

舉例來說，如果要在一個名稱為 mycontainer 的 Container 內執行 ls 命令，可以使用以下命令：

```console
$ docker exec mycontainer ls

<!-- 執行後會呈現 container 當前的文件以及子目錄  -->
Dockerfile.dev      docker-compose.yml  package.json
README.md           node_modules        public
build               package-lock.json   src
```
### -it command

-it 選項可用於分配一個交互式虛擬終端 (TTY)。`-it` 通常與 bash 命令一起使用，這樣就可以在 Container 中啟動一個交互式的 shell。例如：

```console
$ docker exec -it mycontainer bash
```

這個命令會在 mycontainer  Container 內啟動一個 bash shell，我們可以在其中執行各種命令。輸入 exit 可以退出這個 shell，但不會停止 Container 本身的執行。事實上，`-it` 其實是 `-i` 以及 `-t` 結合在一起的命令。

* `-i`：表示分配一個虛擬終端讓使用者輸入命令和並且與 Container 內的應用程序進行通信。如果不使用 -i flag ，docker exec 命令將沒有交互式的輸入，並且不會等待輸入命令。
* `-t`：這個 flag 是用來控制輸出的格式，讓輸出以漂亮的方式顯示在終端上。如果不使用 -t flag ，則輸出將以一種非交互式的方式呈現，可能會讓輸出難以閱讀。

