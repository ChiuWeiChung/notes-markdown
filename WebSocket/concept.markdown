# OSI Model & UDP (User Datagram Protocol)

# 網絡通訊基礎與 WebSocket 技術

## 前言

在我深入學習 WebSocket 的過程中，發現先回顧一下網絡通訊的基礎架構特別有幫助。這就像是回到原點，重新審視那些我們平常可能不太關注的網絡底層知識。

為什麼我覺得先了解 OSI 模型和 TCP/UDP 的差異對學習 WebSocket 很重要？主要有幾個原因：

1. **找到脈絡**：當我嘗試理解 WebSocket 在整個網絡架構中的位置時，OSI 模型給了我清晰的參考框架。原來 WebSocket 是建立在傳輸層之上的應用層協議，這讓我對它的運作有了更直觀的理解。

2. **理解選擇**：研究過程中，我好奇為何 WebSocket 選擇基於 TCP 而非 UDP。深入比較這兩種協議後，TCP 的可靠性傳輸特性顯然更符合 WebSocket 的設計目標，這個發現讓我豁然開朗。

3. **看清痛點**：學習 WebSocket 前，我一直疑惑它解決了什麼問題。當我把它與 HTTP（同樣基於 TCP）對比後，才真正明白 WebSocket 如何突破了傳統請求-響應模式的限制。

接下來的筆記整理了我從網絡基礎到 WebSocket 的學習心得~


## OSI Model

OSI（Open Systems Interconnection）模型是理解網絡通訊的重要基石。可以幫助釐清數據如何在網絡中從一點傳輸到另一點的過程：

```bash
## OSI Model
+—————––––––––––+
|  Application  | <- 使用者直接接觸的層級，如瀏覽器、郵件客戶端
+—————––––––––––+
|  Presentation | <- 處理數據格式轉換、加密解密、壓縮等
+—————––––––––––+
|  Session      | <- 管理會話，建立、維護、終止連接
+—————––––––––––+
|  Transport    | <- 負責端到端的可靠傳輸，處理流量控制
+—————––––––––––+
|  Network      | <- 路由選擇，跨網絡傳輸，IP尋址
+—————––––––––––+
|  Data Link    | <- 提供節點間的數據傳輸，錯誤檢測
+—————––––––––––+
|  Physical     | <- 處理實體連接，如電纜、光纖、無線電波
+—————––––––––––+ 
```

每一層都有特定的功能，而且只關注自己職責範圍內的工作，這讓整個網絡系統變得模組化且靈活。而數據封裝的過程也很奇妙，如下圖

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
這個圖清晰地展示了以下封裝過程：
- 應用層的 Headers 和 Body 作為整體，成為傳輸層的 Body
- 傳輸層的 Headers 和 Body（包含應用層的全部內容）作為整體，成為網絡層的 Body
- 網絡層的 Headers 和 Body（包含下層的全部內容）作為整體，成為資料連接層的 Body
- 資料連接層添加自己的頭尾後，轉交給物理層進行實體信號傳輸

這種「俄羅斯娃娃」式的封裝方式，確保了每一層只需關注自己的職責，同時又能將上層的完整數據包裹起來傳遞給下一層，是分層網絡設計的核心精髓。

當接收數據時，則反向進行解包：每層處理自己的 Headers 並將 Body 交給上層處理。整個過程中，當數據從應用層往下傳遞時，每一層會添加自己的標頭信息；而當數據解封包時，每層又會移除相應的標頭並處理其中的信息。

## **Packet Transportation**
在實際的網絡傳輸中，我主要關注 **Application、Transport、Network** 這三層（已標示為 `*`），因為這些層在理解 WebSocket 時最為關鍵：

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

# UDP (User Datagram Protocol)

## 1. 輕量級 (Lightweight)
UDP 的 Header **僅佔 8 bytes**，相較於 TCP 更為簡潔，適合高效能需求的應用場景。

## 2. 無連線 (Connectionless)
UDP 是 **無連線導向 (Connectionless-Oriented)** 的協議：
- 不建立連線，即發即送，不需握手。
- 不會追蹤封包的狀態，因此不會有連線管理的額外開銷。

## 3. 傳輸一致性 (Consistency)
- 無論接收端狀態如何，UDP 仍會持續發送數據。
- 不保證數據到達，但能確保極低的傳輸延遲。

## 4. 高速傳輸 (Super Fast ⭐)
UDP 由於沒有連線管理與確認機制，使其適合 **即時應用**：
- **直播串流**
- **線上遊戲**
- **VoIP（網絡電話）**
---

# TCP (Transmission Control Protocol)

## 1. 連線導向 (Connection-Based)
TCP 是 **連線導向 (Connection-Oriented)** 的協議，需要通過 **三次握手 (Three-Way Handshake)** 建立連線。

## 2. 可靠性 (Reliable)
TCP 具有數據傳輸的可靠性，確保資料正確、有序地送達：
- **Delivery Acknowledgment**（傳送確認）  
  - 每個數據包都需要收到確認 (ACK) 才能確保成功傳輸。
- **Retransmission**（重傳機制）  
  - 若數據包丟失或未收到確認，TCP 會自動重傳該數據包。
- **In-Order Packet**（有序封包）  
  - TCP 會根據數據包的序列號確保按順序組裝數據，不會發生錯亂。

## 3. 擁塞控制 (Congestion Control)
TCP 會根據網絡狀況調整發送速率，以避免網絡擁塞導致的丟包問題，確保數據能高效且穩定地傳輸。


## WebSocket 的誕生
WebSocket 為了解決 HTTP 的這些局限性而創建，它是一個基於 TCP 的協議，提供**全雙工**的通信通道。

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

### 適用場景：
- **實時應用**：聊天室、多人遊戲
- **數據推送**：股票行情、體育比分
- **協同編輯**：多人同時編輯文件
- **監控應用**：系統監控、日誌實時分析