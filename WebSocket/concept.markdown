# OSI Model & UDP (User Datagram Protocol)

## OSI Model

OSI（Open Systems Interconnection）模型分為 7 層：

```bash
## OSI Model
+—————––––––––––+
|  Application  |
+—————––––––––––+
|  Presentation |
+—————––––––––––+
|  Session      |
+—————––––––––––+
|  Transport    | 
+—————––––––––––+
|  Network      | 
+—————––––––––––+
|  Data Link    | 
+—————––––––––––+
|  Physical     | 
+—————––––––––––+ 
```


## **Packet Transportation**
在實際的網絡傳輸中，通常主要關注 **Application、Transport、Network** 這三層（已標示為 `*`）：

```bash
+—————–––––––––––+
| * Application *|  –> ex: HTTP, FTP, SSH, SMTP
+—————–––––––––––+
| * Transport   *|  –> ex: TCP, UDP
+—————–––––––––––+
| * Network     *|  –> ex: IP
+—————–––––––––––+
|  Data Link     |  –> ex: Wi-Fi, Ethernet
+—————–––––––––––+
|  Physical      |  –> ex: Cable
+—————–––––––––––+
```
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