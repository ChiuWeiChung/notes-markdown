# Docker Compose

## **執行多個彼此協作的 Docker Containers?**

在下方的範例中，根據提供的指令，可以看出我想要執行兩個Container：`rickchiu/nodewithredis` 和 `reids`，但是實際上執行後會發現，會發現執行上出現錯誤:`Error: getaddrinfo ENOTFOUND redis-server`。會出現錯誤主要是因為`nodewithredis Container` 和 `redis Container` 位於不同的網絡所導致，

```console
$ docker build -t nodewithredis .
$ docker run nodewithredis
$ docker run redis
Error: getaddrinfo ENOTFOUND redis-server
```

每個 Container 都有自己的獨立網絡命名空間 (Namespace)。當執行 `docker run redis` 時，Docker 會創建一個新的 redis Container ，這個 Container 會有自己的 Namespace 和 IP address。因此，在 nodewithredis Container 中，使用 "redis" 這個名稱是找不到 redis  Container 的 IP 地址的。

為了讓這兩個 Container 能夠連結，我們需要將它們放在同一個網絡中。我們可以通過創建一個新的網絡，並將這兩個 Container 添加到該網絡中來實現這一點。例如，我們可以使用 `docker-compose` 創建一個包含兩個 Container 的應用程序，然後將它們放在同一個網絡中，讓它們能夠相互連結。

## **Docker Compose**

Docker Compose 是一種用於`執行多個 Docker Containers 的工具`。我們只需要定義一個簡單的文件 (docker-compose.yml) 來描述應用程序中所需要的 Container ，包括 Container 的 Image、network、環境變數等。使用 Docker Compose，使用者可以更輕鬆地管理和執行多個 Containers，並能夠輕鬆地在不同的環境中部署應用程序，例如在 local 開發環境、測試環境和 production 環境中，下方是一個 docker-compose.yml 範例:

```yaml
<!-- in docker-compose.yml -->
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      -  "4001:8081"
```
上述文件的用途是定義和管理兩個 Docker Container，其中的 `redis-server` 和 `node-app` 是自定義的服務名稱，其中 `redis-server` 服務使用指定的 redis Image 執行 Redis 服務。而 `node-app` 服務透過當前目錄下的 Docker Image 使用 `build .` 來執行一個 Node.js 應用程序，並在 ports 中指定了 Container 與主機之間的 Port 連接，將主機的 4001 Port 映射到容器的 8081 Port 。



### **docker-compose up**

```console
$ docker-compose up
```

`docker-compose up` 命令用於啟動 Container ，如果 Docker Compose 文件中列出的 Image 已存在，則不會重新構建 Image 。也就是說，該命令僅僅啟動已經存在的 Container 。

### **docker-compose up --build**

```console
$ docker-compose up --build
```

`docker-compose up --build` 命令用於重新構建 Docker Compose 文件中列出的 Image ，然後啟動相應的 Container 。也就是說，該命令將會在啟動 Container 之前，重新構建所有需要更新的 Image ，然後再啟動相應的 Container 。這樣可以確保在每次啟動 Container 之前，都使用最新的 Image 。

### **停止 Docker Compose Container**

我們可以在背景下啟動 Docker Container

```console
$ docker-compose up -d
```
也可以在背景下關閉 Docker Container

```console
$ docker-compose down
```

---

# docker-compose.yml 參數設定

在下方的 docker-compose.yml 中，要用途是定義和管理多個 Docker 服務（容器），並提供了一個統一的配置文件來描述這些服務之間的關係和設定。這份 docker-compose.yml 文件中定義了以下服務：

1. redis 服務：使用預先構建的 redis 映像執行 Redis 服務，沒有指定 build，因此直接使用映像執行。
2. nginx 服務：使用自定義的 Dockerfile.dev 構建 Nginx 映像，並在 build 中指定了相應的 Dockerfile 路徑和上下文。同時，使用了 depends_on 指定依賴關係，表示該服務在啟動前需要確保 api 服務已經啟動。
3. nodeapi 服務：同樣使用自定義的 Dockerfile.dev 構建 Node.js 映像，並指定了相應的 Dockerfile 路徑和上下文。在 volumes 中指定了容器與主機之間的資料共享，將 ./server 目錄掛載到容器的 /app 目錄下，同時忽略容器中的 /app/node_modules 目錄。在 environment 中定義了容器的環境變數，這裡指定了 Redis 的主機和 Port 。

通過這份 docker-compose.yml 文件，我們可以透過 `docker-compose up` 來同時啟動和管理這三個服務。

```yml
version: "3" 
services:
  redis:  
    image: "redis" 
  nodeapi:
    build:
      dockerfile: Dockerfile.dev
      context: ./server
    volumes: 
      - /app/node_modules
      - ./server:/app
    environment: 
      - REDIS_HOST=redis
      - REDIS_PORT=6379
  nginx: 
    depends_on: 
      - nodeapi
    restart: always 
    build: 
      dockerfile: Dockerfile.dev 
      context: ./nginx
    ports:
      - "3050:80" 
```

上述的一些常見參數，用於定義服務和容器的行為。具體的使用取決於應用需求和使用情境，下方為簡單的介紹:

* version: 指定 Docker Compose 文件的版本。這決定了支援的語法和功能。
* services: 定義要執行的不同服務（Container）。每個服務都可以包含多個參數。
  * redis、nginx、nodeapi: 定義服務的名稱，可以自訂。
    * image: 指定用於執行服務的 Image 。可以是本地 Image 或遠程 Image 庫中的 Image。
    * depends_on: 用於指定服務之間的依賴關係。它確保在啟動服務之前，所依賴的服務已經啟動並執行。
    * restart: 指定容器遇到錯誤或退出時的重啟策略。在這個例子中，使用 always 策略，表示容器總是會自動重啟。
    * build: 定義如何構建服務的 Image。
      * dockerfile: 指定用於構建服務 Image 的 Dockerfile 的路徑。
      * context: 指定構建服務 Image 時的上下文路徑。上下文包括構建 Image 所需的文件和資源。
    * ports: 指定容器與主機之間的 Port 映射關係。格式為 "主機 Port :容器 Port "。
    * volumes: 定義容器與主機之間資料共享的配置選項。可以指定共享的目錄或文件。
    * environment: 定義容器的環境變數。可以使用鍵值對的形式指定變數名稱和值。

## **restart 參數**

在 docker-compose.yml 中，可以透過 restart 指令來定義 Container 執行失敗或關閉時該如何重新啟動 Container 。restart 指令接受不同的選項，以指定何時重新啟動 Container 以及最多重新啟動多少次。

以下是常用的選項：

* no：如果 Container 因異常停止，不會自動重啟（預設值）。
* always：如果 Container 因異常停止，將自動重新啟動 Container 。
* on-failure：如果 Container 因`異常狀態`而導致停止，將重新啟動 Container 。並且可以加入 max-retries 選項來指定最多重新啟動次數。
* unless-stopped：除非手動停止 Container (ex:docker-compose stop)，否則 Container 仍會時自動重啟。

值得注意的是，`unless-stopped` 指令不會在系統重新啟動後自動啟動 Container ，只會在使用 `docker-compose stop` 或 `docker stop` 指令停止 Container 時才停止它，也就是只要 Container 還在執行，即使系統重新啟動， Container 也不會自動啟動。如果希望在系統重啟後自動啟動 Container ，可以改用 `always`。


## **volumes 參數**

在 Docker 中，volumes 選項用於`將主機的目錄或檔案與 Container 內的目錄或檔案進行鏡像，以實現資料的共享`。這意味著 Container 可以存取主機上的資料，或將 Container 內的資料保存到主機上的指定位置，從而實現 Container 和主機之間的資料交換。volumes 的主要用途如下：

* 持久性資料存儲: 通過定義 volumes，可以在 Container 重新啟動或重新部署時保留數據。這對於需要保留狀態或持久性數據的應用程序非常有用，例如資料庫或檔案儲存服務。
* Container 間資料共享: 使用 volumes 可以將資料在多個 Container 之間共享，這對於微服務架構或需要共享資源的應用程序非常有用。多個 Container 可以使用相同的卷進行讀寫操作，實現數據共享和通信。
* 主機和 Container 間的資料鏡像: volumes 還可以用於將主機的目錄或檔案鏡像到 Container 內的目錄或檔案，從而實現資料共享和應用程序的讀寫操作。

```yaml
volumes:
  - <host_path>:<container_path>  # 將主機路徑鏡像到 Container 路徑
```

透過 Docker Client 的 -v 參數也可以實現類似的功能。在使用 Docker 命令行界面時，我們可以使用 `-v` 參數將主機的目錄或檔案與Container內的目錄或檔案進鏡像

```console
$  docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app <container-id> 
```

* `-v /app/node_modules` : 是將 Container 內的 /app/node_modules 路徑掛載到 local 的 /app/node_modules 路徑，這樣可以保留 Container 內 /app/node_modules 的資料。

* `-v $(pwd):/app` : 則是將目前 local 端的目錄掛載到 Container 的 /app 路徑，這樣 Container 內的 /app 目錄就會和 local 端的目錄同步， Container 內對 /app 的讀寫操作就會反映到 local 端。通常在開發時會採用這種方式來將 local 端的應用程式代碼掛載到 Container 內進行開發、測試。

### **還需要在 Dockerfile 內 RUN npm install 嗎?**
是的，即使我們使用了 -v /app/node_modules 將本地端的 node_modules 鏡像到 Container 的 /app/node_modules 目錄下，我們仍然需要在 Dockerfile 中執行 RUN npm install 命令，以確保 Container 中安裝了應用程序所需的所有依賴項。這是因為 -v /app/node_modules 只是將 Container 中 /app/node_modules 目錄與本地端的 node_modules 目錄做鏡像，而不是直接將本地端的 node_modules 目錄複製到 Container 中。因此，我們仍需要在 Dockerfile 中執行 RUN npm install 命令來安裝所有依賴項。

### **如果 local 的 node_modules 被刪除了，還可以啟動嗎?**

如果我們刪除了 local 端的 node_modules，透過 `-v /app/node_modules` 將 Container 內的 /app/node_modules 掛載到 local 端的 node_modules 會沒有作用，因為在 local 端的 node_modules 已經不存在了，所以 Container 的應用程式會找不到需要的 Node.js 模組。 **`但是`** ，如果我們的 Dockerfile 中已經有 npm install 的指令，當我們在沒有 /app/node_modules 的情況下啟動 Container ，Docker 在啟動 Container 時會先執行 npm install，重新安裝所需的模組，因此我們的應用程式仍然可以正常執行。
