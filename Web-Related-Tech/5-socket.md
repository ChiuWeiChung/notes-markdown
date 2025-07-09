# 🌐 網絡通訊筆記：OSI 與 Socket 的基本認知

## 前言

雖然當了前端工程師也有一段時間了，但在開發過程中常會意識到，如果對網路底層架構不夠了解，很多東西其實只是「會用但不懂」。工程師不能只是停留在表面，還是得搞懂背後怎麼運作的。最近也發現，重新回頭看一下網路通訊的基本概念，對整體理解真的很有幫助。所以我決定回到原點，補補以前沒特別深入的網路基礎。

OS：其實是因為在學 WebSocket 的時候才意識到這塊有多重要，所以才回來惡補一下。

在學習完 OSI 模型與 TCP/UDP 的通訊模式後，我開始思考一個實務問題：
> 那開發者實際上是怎麼操作這些協議的？  
> WebSocket 是基於 TCP，但 TCP 本身又如何在應用層中表現？

為什麼先了解 OSI 模型和 TCP/UDP 的差異對學習 WebSocket 很重要？主要有幾個原因：

1. 原來 WebSocket 是建立在傳輸層之上的應用層協議。
2. 為何 WebSocket 選擇基於 TCP 而非 UDP。深入比較這兩種協議後，TCP 的可靠性傳輸特性顯然更符合 WebSocket 的目的。
3. 學習 WebSocket 前，我一直疑惑它解決了什麼問題。當我把它與 HTTP（同樣基於 TCP）對比後，才真正明白 WebSocket 如何突破了傳統請求-響應模式的限制。

理解 Socket 成為理解 WebSocket 的重要一環，因為 Socket 是我們在應用程式中，實際使用網路通訊能力的「介面」。理解 Socket，不只是理解「通訊」，更是理解「應用如何與網路互動」。

## 1. OSI 模型：網絡通訊的基石

OSI（Open Systems Interconnection）模型是理解網絡通訊的重要基石，它幫助我們釐清數據如何在網絡中從一點傳輸到另一點的過程：

```
## OSI Model
+—————–––––––––––––––+
|  Application Layer | <- 使用者直接接觸的層級，如瀏覽器、郵件客戶端
+—————–––––––––––––––+
|  Presentation Layer| <- 處理數據格式轉換、加密解密、壓縮等
+—————–––––––––––––––+
|  Session Layer     | <- 管理會話，建立、維護、終止連接
+—————–––––––––––––––+
|  Transport Layer   | <- 負責端到端的可靠傳輸，處理流量控制
+—————–––––––––––––––+
|  Network Layer     | <- 路由選擇，跨網絡傳輸，IP尋址
+—————–––––––––––––––+
|  Data Link Layer   | <- 提供節點間的數據傳輸，錯誤檢測
+—————–––––––––––––––+
|  Physical Layer    | <- 處理實體連接，如電纜、光纖、無線電波
+—————–––––––––––––––+ 
```

每一層都有特定的功能，而且只關注自己職責範圍內的工作，這讓整個網絡系統變得模組化且靈活。而數據封裝的過程也很奇妙，如下圖：

```bash
Application Layer (HTTP, FTP, SSH, WebSocket)
    +----------------+------------+
    |Application     |Application |
    |Headers         |Body        |
    +----------------+------------+
                     ↓
Transport Layer (TCP/UDP)
    +----------------+--------------------------------+
    |Transport       |         Transport Body         |
    |Headers         | +----------------+-----------+ |
    |                | |Application Hdrs|  App Body | |
    |                | +----------------+-----------+ |
    +----------------+--------------------------------+
                     ↓
Network Layer (IP)
    +----------------+---------------------------------------+
    |Network         |            Network Body               |
    |Header          | +----------------+------------------+ |
    |                | |Transport       |  Transport Body  | |
    |                | |Headers         | +--------+-----+ | |
    |                | |                | |App H   |App B| | |
    |                | |                | +--------+-----+ | |
    |                | +----------------+------------------+ |
    +----------------+--------------------------------------+
                     ↓
Data Link Layer
    +----------------+------------------------------------------+
    |Link Header     |                 Link Body                |
    |                | +-------------+------------------------+ |
    |                | |Network Headr|      Network Body      | |
    |                | |             | +-------+-----------+  | |
    |                | |             | |Trnsprt|TrnsprtBody|  | |
    |                | |             | |Headers| +----+---+|  | |
    |                | |             | |       | |AppH|AppB|  | |
    |                | |             | |       | +----+---+|  | |
    |                | |             | +-------+-----------+  | |
    |                | +-------------+------------------------+ |
    +----------------+------------------------------------------+
                     ↓
                and so on
```

透過上圖，可以發現他的封裝方式類似「俄羅斯娃娃」：
- 應用層的 Headers 和 Body 作為整體，成為傳輸層的 Body
- 傳輸層添加自己的 Headers，將整體作為網絡層的 Body
- 網絡層添加自己的 Headers，將整體作為資料連接層的 Body
- 資料連接層添加自己的頭尾後，轉交給物理層進行實體信號傳輸

當接收數據時，則反向進行解包：每層處理自己的 Headers 並將 Body 交給上層處理。

### 重要的三層

在實際的網絡應用開發中，我們主要關注 **Application、Transport、Network** 這三層，因為這些層在理解 WebSocket 時最為關鍵：

```bash
+—————–––––––––––+
| * Application *|  –> ex: HTTP, FTP, SSH, SMTP, WebSocket
+—————–––––––––––+
| * Transport   *|  –> ex: TCP, UDP (WebSocket選擇了TCP)
+—————–––––––––––+
| * Network     *|  –> ex: IP (處理跨網路的數據包路由)
+—————–––––––––––+
|  Data Link     |  –> ex: Wi-Fi, Ethernet (封裝為幀frame)
+—————–––––––––––+
|  Physical      |  –> ex: Cable (轉換為電信號、光信號等)
+—————–––––––––––+
```

從實用角度看，這三層對於應用開發者最為直接相關：

1. **應用層（Application）**：決定了用戶體驗和功能，如 WebSocket 的雙向通信特性
2. **傳輸層（Transport）**：選擇 TCP 還是 UDP 將直接影響應用的可靠性與性能
3. **網絡層（Network）**：處理跨網絡通信，使得我們的應用能夠在全球範圍內工作

## 2. TCP vs UDP：兩種核心傳輸協議的比較

### TCP (Transmission Control Protocol)

#### 1. 連線導向 (Connection-Based)
TCP 是 **連線導向 (Connection-Oriented)** 的協議，需要通過 **三次握手 (Three-Way Handshake)** 建立連線。

```
Client                            Server
   |                                 |
   | ---- SYN  --------------------> |
   |                                 |
   | <--- SYN-ACK ------------------ |
   |                                 |
   | ---- ACK  --------------------> |
   |                                 |
 (連線建立，雙方可開始通訊)
```

#### 2. 可靠性 (Reliable)
TCP 具有數據傳輸的可靠性，確保資料正確、有序地送達：
- **Delivery Acknowledgment**（傳送確認）  
  - 每個數據包都需要收到確認 (ACK) 才能確保成功傳輸。
- **Retransmission**（重傳機制）  
  - 若數據包丟失或未收到確認，TCP 會自動重傳該數據包。
- **In-Order Packet**（有序封包）  
  - TCP 會根據數據包的序列號確保按順序組裝數據，不會發生錯亂。

#### 3. 擁塞控制 (Congestion Control)
TCP 會根據網絡狀況調整發送速率，以避免網絡擁塞導致的丟包問題，確保數據能高效且穩定地傳輸。

#### 4. 適用場景
- 網頁瀏覽（HTTP/HTTPS）
- 檔案傳輸（FTP）
- 電子郵件（SMTP）
- 資料庫連線
- WebSocket 應用

### UDP (User Datagram Protocol)

#### 1. 輕量級 (Lightweight)
UDP 的 Header **僅佔 8 bytes**，相較於 TCP 更為簡潔，適合高效能需求的應用場景。

#### 2. 無連線 (Connectionless)
UDP 是 **無連線導向 (Connectionless-Oriented)** 的協議：
- 不建立連線，即發即送，不需握手。
- 不會追蹤封包的狀態，因此不會有連線管理的額外開銷。

```
Client                            Server
   |                                 |
   | ---- DATA --------------------> |
   |                                 |
   |                                 |
(直接發送，不確認是否收到)
```

#### 3. 傳輸一致性 (Consistency)
- 無論接收端狀態如何，UDP 仍會持續發送數據。
- 不保證數據到達，但能確保極低的傳輸延遲。

#### 4. 高速傳輸 (Super Fast)
UDP 由於沒有連線管理與確認機制，使其適合 **即時應用**：
- 直播串流
- 線上遊戲
- VoIP（網絡電話）

## 3. Socket：應用程式的網絡介面

簡單來說，Socket 是一種網路通訊的端點，讓電腦之間能建立連線、傳送與接收資料。
它是網路程式設計的基礎工具，支援各種協定（像 TCP、UDP），不管是建立網站伺服器、FTP 傳檔，還是即時語音聊天，都離不開 Socket 的角色。
> 可以把 Socket 想像成「資料傳輸的插座」，只要雙方都插上線，就能開始交流資訊。

### Socket 的定義與核心觀念

- **Socket 是 OS 提供的抽象機制**，用來**讓兩個應用程式能夠在本機或網路上通訊**。
- 每個 Socket 都是一個**通訊端點（endpoint）**，我們可以把它想像成「一部電話」。
- Socket 背後封裝的資訊包含：
  - 通訊協定：TCP 或 UDP
  - IP 位址
  - Port 埠號
- **Socket 本質上是個程式可操作的「軟體構造」**，建立起了應用與網路堆疊之間的橋樑。

### Socket 在 OSI 模型中的位置

Socket 屬於 Transport Layer（第四層），連接以下兩端：
- 上層：應用程式（Application Layer）
  - 例如：Web Server、聊天應用、瀏覽器
- 下層：網路協定堆疊（Network & Link Layer）
  - 處理封包封裝、IP 路由、物理傳輸等

Socket API 提供的功能就是讓應用可以「像在寫檔案一樣」來傳輸資料，而不用手動處理封包分段、檢查順序、重傳等細節。

### Socket 生命週期

#### 伺服器端（Server）
1. **建立監聽 Socket（bind + listen）**
   * 綁定 IP + Port
   * 等待用戶端連線請求
2. **接受連線（accept）**
   * 建立一個新的 Socket 實例，專屬對應這個客戶端
   * 原始監聽 Socket 繼續等待其他連線
3. **通訊進行中**
   * 每個客戶端的 Socket 各自通訊，互不干擾
4. **結束通訊（close）**
   * 主動關閉以釋放系統資源

小型應用常用多執行緒或多進程處理每個連線，但這種模型無法有效擴展，容易導致記憶體與 CPU 資源飽和。

#### 用戶端（Client）

1. **建立 Socket（`socket()`）**
2. **連線到伺服器（`connect()`）**
3. **資料傳輸（`send`/`recv` 或 `read`/`write`）**
4. **結束通訊（`close()`）**

### Socket 連線處理模型

#### 傳統一對多模型（每個連線開一個 Thread）

```
+---------+       accept()       +-----------+
| Listener| ------------------> |  Client A |
+---------+                     +-----------+
       |                            ↓
       |       accept()         +-----------+
       +----------------------> |  Client B |
                                +-----------+
       (每個 Client 對應一個 Thread)
```

#### 高效處理模型（非同步與事件驅動）
* 使用 非阻塞 IO（Non-blocking IO） + 事件通知機制
  - 例如：
    - Linux 的 epoll
    - macOS / BSD 的 kqueue
  - 可讓單一執行緒同時管理數千個 Socket
  - 框架實例：
    - Node.js
    - nginx
    - Python 的 asyncio

```
+----------------------------+
|       主迴圈 (1 Thread)    |
|    while (true):           |
|      epoll_wait()          |
|      for socket in ready:  |
|          handle(socket)    |
+----------------------------+

可同時處理上千連線，
依據事件（可讀/可寫）來調度。
```

## 4. WebSocket：雙向網絡通訊的解決方案

### WebSocket 的誕生
WebSocket 為了解決 HTTP 的局限性而創建，它是一個基於 TCP 的協議，提供**雙向**的通信通道。

### WebSocket 的關鍵特性：
1. **持久連接**：建立一次連接後可以長時間保持打開狀態
2. **雙向通信**：客戶端和服務器都可以隨時發送訊息
3. **較低延遲**：避免了重複建立連接的開銷
4. **更少的協議開銷**：握手後的數據傳輸比 HTTP 更輕量

### WebSocket 的建立過程：
1. **握手階段**：通過 HTTP 升級機制來建立 WebSocket 連接
   ```
   GET /chat HTTP/1.1
   Host: server.example.com
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   Origin: http://example.com
   Sec-WebSocket-Version: 13
   ```

2. **數據傳輸階段**：建立連接後，使用 WebSocket 協議進行雙向通信

### WebSocket 適用場景：
- **實時應用**：聊天室、多人遊戲
- **數據推送**：股票行情、體育比分
- **協同編輯**：多人同時編輯文件
- **監控應用**：系統監控、日誌實時分析

## 5. 總結：從 OSI 到 Socket 到 WebSocket

網絡通訊是一個層層疊加的複雜系統：
1. **OSI 模型**提供了理解網絡通訊的框架
2. **TCP/UDP**是兩種主要的傳輸層協議，各有優缺點
3. **Socket**是操作系統提供給應用程式使用網絡的接口
4. **WebSocket**是建立在這些基礎上的應用層協議，解決了實時雙向通訊的需求

下表總結了 Socket 的核心概念：

| 概念 | 說明 |
|------|------|
| Socket 是什麼？ | OS 提供的通訊抽象，封裝協定/IP/Port |
| 運作層級 | OSI 模型第 4 層（Transport Layer） |
| 分類 | TCP（可靠、連線） vs UDP（快速、無連線） |
| 實作流程 | 建立 → 綁定 → 傾聽/連線 → 傳輸 → 關閉 |
| 描述符關係 | Socket 在 Unix 系統中是 File Descriptor |

理解這些基礎知識，不僅能幫助我們更好地使用 WebSocket，還能讓我們在選擇通訊技術時更有信心，根據不同的應用需求選擇最合適的解決方案。 


## 參考資料:
1. [SocketIO v4, with websockets - the details](https://www.udemy.com/course/socketio-with-websockets-the-details/?couponCode=KEEPLEARNING)
2. [99% of Developers Don't Get Sockets](https://www.youtube.com/watch?v=D26sUZ6DHNQ&t=6s&ab_channel=TheCodingGopher) 