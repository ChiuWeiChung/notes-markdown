# Nginx 的 timeout 配置

Nginx 作為一個 Web 伺服器和反向代理伺服器，支援處理大量並發連線和高流量負載。當 Nginx 處理請求時，可能會發生請求超時的情況，這可能是由於`用戶端的連線問題`、`網路延遲`或`後端 server 未能及時回應`等因素所引起的。Nginx 可以通過設定不同的 timeout 參數來控制超時行為。以下是一些常用的 timeout 參數：

```console
┌───────────────────────────┬────────────────────────────────┐
│     Frontend Timeout      │        Backend Timeout         │
├───────────────────────────┼────────────────────────────────┤
│    client_header_timeout  │   proxy_connect_timeout        │
│                           │                                │
│    client_body_timeout    │   proxy_send_timeout           │
│                           │                                │
│    send_timeout           │   proxy_read_timeout           │
│                           │                                │
│    keepalive_timeout      │   keepalive_timeout            │
│                           │                                │
│    lingering_timeout      │   proxy_next_upstream_timeout  │
│                           │                                │
│    resolver_timeout       │                                │
└───────────────────────────┴────────────────────────────────┘
```

# Frontend_timeout

##  client_header_timeout

用於設定 Nginx 等待用戶端發送請求標頭的超時時間。如果在超時時間內未收到標頭，Nginx 將關閉該連線，如果超時請求將被終止(408 Request time-out)，預設值為 60s。

```console
  ┌──────────────┐ POST/HTTP/1.1    ┌─────────────┐
  │┌────────────┐│ ───────────────► │             │
  ││            ││                  └─┬─────────┬─┘
  ││    User    ││ content-length:12┌─┴─────────┴─┐ 
  ││            ││ ───────────────► │ Nginx Server│
  │└────────────┘│   ....... > 60s  └─┬─────────┬─┘
  └─────┬──┬─────┘ ◄─────────────── ┌─┴─────────┴─┐
┌───────┴──┴──────┐   Terminate     │             │
└─────────────────┘   Connection    └┬┬─────────┬┬┘
                                     └┘         └┘        
                     Content-Type    
                   ──────────────►X 
```

> Slowloris 是在2009年由著名 Web 安全專家 RSnake 提出的一種攻擊方法，其原理是以極低的速度往 server 發送 HTTP 請求。(應該說他是種慢速攻擊)由於 Web Server 對於並發的連接數都有一定的上限，因此若是惡意地占用住這些連接不釋放，那麽 Web Server 的所有連接都將被惡意連接占用，從而無法接受新的請求，導致拒絕服務。 reference: [DDoS 攻擊:Slowloris 示範](http://trilliums.blog.fc2.com/blog-entry-11.html) `

## client_body_timeout

用於設定 Nginx 等待用戶端傳送請求正文的超時時間。如果在超時時間內未收到正文，Nginx 將關閉該連線。

Nginx 會等待連續兩次讀取操作之間的時間。也就是說，如果在設定的時間內沒有收到下一個讀取操作，Nginx 將會認為 client 端已經停止傳輸請求主體，並在 client_body_timeout 設定的時間後關閉連線。

需要注意的是，client_body_timeout 的默認值為 60 秒，但這個值通常需要根據具體情況進行調整。如果設置得太小，可能會導致 client 端無法成功傳輸大型請求主體，而如果設置得太大，可能會占用過多的伺服器資源，降低網站的效能。


```console
                  POST/HTTP/1.1     
                  content-length:1M
  ┌──────────────┐conetent-type:text┌─────────────┐
  │┌────────────┐│ ───────────────► │             │
  ││            ││                  └─┬─────────┬─┘
  ││    User    ││ body:'...blah'   ┌─┴─────────┴─┐ 
  ││            ││ ───────────────► │ Nginx Server│
  │└────────────┘│   ....... > 60s  └─┬─────────┬─┘
  └─────┬──┬─────┘                  ┌─┴─────────┴─┐
┌───────┴──┴──────┐◄─────────────── │             │
└─────────────────┘   Terminate     └┬┬─────────┬┬┘
                      Connection     └┘         └┘            
```


## send_timeout

用於設定 Nginx 將 response 發送給用戶端的超時時間。如果在超時時間內未發送完整個 response ，Nginx 將中斷連線。


```console
                  POST/HTTP/1.1     
                  content-length:1M
  ┌──────────────┐conetent-type:text┌─────────────┐           ┌─────────┐
  │┌────────────┐│ ───────────────► │             │─────────► │ Server  │
  ││            ││                  └─┬─────────┬─┘           ├┐  ┌────┐│
  ││    User    ││                  ┌─┴─────────┴─┐  ......   ├┘  └────┘│
  ││            ││   ......> 60s    │ Nginx Server│◄───────── │         │
  │└────────────┘│                  └─┬─────────┬─┘           │   ┌────┐│
  └─────┬──┬─────┘                  ┌─┴─────────┴─┐  .......  │   └────┘│
┌───────┴──┴──────┐◄─────────────── │             │◄───────── │         │
└─────────────────┘   Terminate     └┬┬─────────┬┬┘           └─────────┘
                      Connection     └┘         └┘                                              
```


## keepalive_timeout

用於設定 Nginx 保持用戶端連線的超時時間。如果用戶端在超時時間內未發送新的請求，Nginx 將關閉連線。 keepalive_timeout 是用來設定 Nginx 與用戶端保持持久連線的超時時間。在 HTTP/1.1 中，使用持久連線可以讓多個請求共用同一個 TCP 連線，減少了建立和關閉連線所需要的時間和資源，提高了網站的效能和用戶體驗。

當一個用戶端向 Nginx 發送一個請求時，如果 keepalive_timeout 的值大於 0，Nginx 將保持該用戶端的連線在等待一段時間，以便用戶端可以發送更多的請求。如果在超時時間內用戶端沒有發送請求，或者用戶端發送了 Connection: close 標頭，Nginx 將關閉該連線。

如果 keepalive_timeout 設置得太長，將導致 Nginx 消耗過多的資源，如果設置得太短，將導致用戶端在發送請求時需要不斷地重新建立連線，增加了網站的負載和延遲。

建議根據實際的網站流量和用戶行為進行調整，一般來說，可以將 keepalive_timeout 設置為 30 秒到 1 分鐘之間，這樣可以在減少連線建立和關閉的開銷的同時，保持適當的資源使用率。

```console
                  POST/HTTP/1.1     
                  Connection: keep-alive
  ┌──────────────┐                  ┌─────────────┐
  │┌────────────┐│ ───────────────► │             │
  ││            ││                  └─┬─────────┬─┘
  ││    User    ││                  ┌─┴─────────┴─┐
  ││            ││   ......> 75s    │ Nginx Server│
  │└────────────┘│                  └─┬─────────┬─┘
  └─────┬──┬─────┘                  ┌─┴─────────┴─┐
┌───────┴──┴──────┐◄─────────────── │             │
└─────────────────┘   Terminate     └┬┬─────────┬┬┘
                      Connection     └┘         └┘ 
```

## lingering_timeout

當用戶端和 Nginx 之間的連線關閉時，可能會發生一種情況，稱為 lingering close。這種情況發生時，用戶端已經關閉了連線，但 Nginx 還在等待用戶端發送所有數據，導致連線一直處於半開狀態。此時，Nginx 可以使用 lingering_timeout 參數來設定等待時間，如果在這個時間內 Nginx 沒有收到用戶端的任何數據，就會強制關閉連線。


在 lingering_close 啟用的情況下，如果在 lingering_timeout 的時間內收到了更多的 client 端數據，Nginx 會繼續讀取這些數據，而不是直接關閉與 client 端的連接。這樣做的原因是，可能會發生數據還未完全傳輸完畢，但是 client 端已經發出了關閉連接的請求，此時如果直接關閉連接，那麼數據可能會遺失。

因此，為了確保所有數據都被傳輸完畢，Nginx 會繼續讀取這些數據，但是不會將其傳遞給上游 server 或應用程序。相反，Nginx 會將這些數據視為無效數據，直到收到更多的有效數據或等待時間超過 lingering_timeout 指令所設定的值為止。這樣做可以確保所有數據都得到了傳輸，同時避免在有可能還有數據待傳輸時就立即關閉連接所造成的數據遺失問題。

在 TCP 連接中，當 client 端或 server 端希望關閉連接時，它會向對方發送一個 FIN（Finish）報文，表示它已經完成了所有的數據傳輸工作。對方收到 FIN 報文後，也會回傳一個 FIN 報文，以確認它已經處理完了所有數據，然後關閉連接。

`發生了 lingering_timeout 設置的超時事件，Nginx 將不會等待對方發送 FIN 報文，而是直接通過物理層面上的關閉來關閉連接。這種方式被稱為 "physical close FIN"，因為它在物理層面上強制關閉 TCP 連接，而不是透過傳統的 FIN 握手過程關閉連接。這樣做可以在一定程度上節省系統資源，但是可能會造成數據的遺失，因此需要在實際應用中根據具體情況進行評估。`

```console
                  
  ┌──────────────┐ Close Connection ┌─────────────┐
  │┌────────────┐│ ◄─────────────── │             │
  ││            ││                  └─┬─────────┬─┘
  ││    User    ││  GET/            ┌─┴─────────┴─┐
  ││            ││ ───────────────► │ Nginx Server│
  │└────────────┘│   ... > 60s      └─┬─────────┬─┘
  └─────┬──┬─────┘                  ┌─┴─────────┴─┐
┌───────┴──┴──────┐◄─────────────── │             │
└─────────────────┘ Physical close  └┬┬─────────┬┬┘
                          FIN        └┘         └┘ 
```

## resolver_timeout

當 Nginx 需要解析 DNS 查詢時，可能會遇到網路延遲或 DNS 伺服器未及時回應的問題，此時 Nginx 可以使用 resolver_timeout 參數來設定解析 DNS 查詢的超時時間。resolver_timeout 指令的默認值為 30 秒。如果在超時時間內未能解析 DNS 查詢，Nginx 將返回一個錯誤頁面或選擇一個預設的 IP 地址作為後續請求的目標。

```console
                      
                                                          somewhere.com
  ┌──────────────┐ POST/HTTP/1.1  ┌─────────────┐           ┌─────────┐
  │┌────────────┐│ ──────────────►│             │ somewhere │ Server  │
  ││            ││                └─┬─────────┬─┘ .com ?    ├┐  ┌────┐│
  ││    User    ││                ┌─┴─────────┴─┐           ├┘  └────┘│
  ││            ││                │ Nginx Server│ ...>30s   │         │
  │└────────────┘│                └─┬─────────┬─┘           │   ┌────┐│
  └─────┬──┬─────┘                ┌─┴─────────┴─┐           │   └────┘│
┌───────┴──┴──────┐               │             │           │         │
└─────────────────┘               └┬┬─────────┬┬┘           └─────────┘
                                   └┘         └┘                                              
```


# Backend_timeout

## proxy_connect_timeout

用於設定 Nginx 與後端 server 建立連線的超時時間。適當地配置 proxy_connect_timeout 指令可以防止 Nginx 在嘗試建立 TCP 連接時長時間等待，提高服務的可靠性和可用性。通常情況下，建議將 proxy_connect_timeout 的值設置為 5 秒鐘左右 (預設值為 60 秒)。

需要注意的是，proxy_connect_timeout 的值可以根據實際情況進行調整，例如如果代理 server 位於不同的地理位置，建議將超時時間設置為較長的值以便更好地應對網絡延遲等問題。

```console      
                              somewhere.com
┌─────────────┐               ┌─────────┐
│             │               │ Server  │
└─┬─────────┬─┘ Connect to    ├┐  ┌────┐│
┌─┴─────────┴─┐ somewhere.com ├┘  └────┘│
│ Nginx Server│ ──────────►   │         │
└─┬─────────┬─┘  ...>60s      │   ┌────┐│
┌─┴─────────┴─┐    Close      │   └────┘│
│             │  Connection   │         │
└┬┬─────────┬┬┘               └─────────┘
 └┘         └┘                                               
```

## proxy_send_timeout
用於設定 Nginx 等待從後端 server 發送資料的超時時間。當 Nginx 作為代理伺服器向後端伺服器發送請求時，如果在規定時間內無法將所有請求數據發送完成，則會觸發 proxy_send_timeout，代表此次請求發送超時。此時，Nginx 會關閉與後端伺服器的連接並返回相應的錯誤信息給 client 端。

一般來說，proxy_send_timeout 的值應該根據具體的應用場景來進行配置(預設值為 60 秒)。如果設置過小，可能會導致請求發送不完整；如果設置過大，可能會占用過多的資源。

```console
                  POST/HTTP/1.1                     
                  content-length:1M                 
  ┌──────────────┐conetent-type:text┌─────────────┐                 ┌─────────┐
  │┌────────────┐│ ───────────────► │             │───────────────► │ Server  │
  ││            ││                  └─┬─────────┬─┘                 ├┐  ┌────┐│
  ││    User    ││body:huge file... ┌─┴─────────┴─┐body:huge file...├┘  └────┘│
  ││            ││ ───────────────► │ Nginx Server│───────────────► │         │
  │└────────────┘│                  └─┬─────────┬─┘                 │   ┌────┐│
  └─────┬──┬─────┘                  ┌─┴─────────┴─┐     ... >60s    │   └────┘│
┌───────┴──┴──────┐                 │             │◄─────────────── │         │
└─────────────────┘                 └┬┬─────────┬┬┘   clean/close   └─────────┘
                                     └┘         └┘    connection                                         
```

### **proxy_sned_timeout 與 client_body_timeout 的相互影響**

這兩個指令的相互影響，取決於 Nginx 作為代理伺服器時的具體場景。在某些情況下，如果 client_body_timeout 設置得太小，可能會導致 client 端無法在超時時間內完成請求數據的發送，進而觸發 proxy_send_timeout，代理伺服器無法將請求數據完整地轉發給後端伺服器。這種情況下，可以考慮調整 client_body_timeout 的值，以適應實際情況。

另外，在某些情況下，如果 proxy_send_timeout 設置得太小，可能會導致代理伺服器無法在超時時間內將請求數據完整地轉發給後端伺服器，進而觸發超時錯誤。這種情況下，可以考慮增加 proxy_send_timeout 的值，以適應實際情況。
 
## proxy_read_timeout
用於設定 Nginx 等待從後端 server 讀取的超時時間。proxy_read_timeout 是 Nginx 中用於設置後端 server  response 超時的參數。當後端 server 在 proxy_connect_timeout 時間內成功建立連接後，如果在 proxy_read_timeout 時間內沒有收到後端 server 的 response (預設值為 60 秒)，則 Nginx 將認為後端 server 出現了故障或網絡狀態不佳，並向 client 端返回 504 Gateway Timeout 錯誤。

```console
                  GET/HTTP/1.1                     GET/HTTP/1.1      
                  content-length:13                content-length:13  
  ┌──────────────┐conetent-type:text┌─────────────┐conetent-type:text┌─────────┐
  │┌────────────┐│ ───────────────► │             │───────────────►  │ Server  │
  ││            ││                  └─┬─────────┬─┘                  ├┐  ┌────┐│
  ││    User    ││                  ┌─┴─────────┴─┐large response... ├┘  └────┘│
  ││            ││                  │ Nginx Server│◄───────────────  │         │
  │└────────────┘│                  └─┬─────────┬─┘                  │   ┌────┐│
  └─────┬──┬─────┘                  ┌─┴─────────┴─┐     ... >60s     │   └────┘│
┌───────┴──┴──────┐                 │             │◄───────────────  │         │
└─────────────────┘                 └┬┬─────────┬┬┘ close connection └─────────┘
                                     └┘         └┘                                        
```


## proxy_next_upstream_timeout


proxy_next_upstream_timeout 是一個 Nginx 配置指令，用於設置 Nginx 與上游 server 建立連線的超時時間。當 Nginx 與上游 server 建立連線時，如果在 proxy_next_upstream_timeout 設置的時間內未能建立連線，Nginx 將會停止向該上游 server 發送請求，並嘗試轉發到另一個上游 server 。

一般來說，上游 server 會是一個 API server，例如資料庫查詢、Web API 請求等。如果該 server 故障或超時，Nginx 可以使用 proxy_next_upstream_timeout 參數來控制 Nginx 轉發到下一個上游 server 的時間。等待的時間，也就是從上游接收到第一個字節開始，到接收到全部上游 response 或者超時發生時的時間。如果在等待時間內收到全部上游 response，Nginx就會將 response 返回給 client，否則會重新向下一個上游發送請求。這個過程將會繼續，直到 Nginx 與所有上游的連接都超時或者成功返回 response 為止。

需要注意的是，proxy_next_upstream_timeout 和其他 timeout 相關的設置一樣，需要根據實際情況進行調整。如果將該值設置得太小，可能會導致 Nginx 過於頻繁地切換上游 server ，增加了網站的負載和延遲。如果設置得太大，可能會使用戶端等待時間過長，降低了網站的效能和用戶體驗。

建議根據網站的負載情況和上游 server 的可用性進行調整，一般來說，可以將 proxy_next_upstream_timeout 設置為 30 秒到 1 分鐘之間。

```console
  ┌──────────────┐   GET   ┌─────────────┐   GET/ ...>60s ┌─────────┐
  │┌────────────┐│ ──────► │             │───────────────►│ Server  │
  ││            ││         └─┬─────────┬─┘       │        └─────────┘
  ││    User    ││         ┌─┴─────────┴─┐       ▼          
  ││            ││         │ Nginx Server│   GET/ ...>60s ┌─────────┐
  │└────────────┘│         └─┬─────────┬─┘───────────────►│ Server  │
  └─────┬──┬─────┘         ┌─┴─────────┴─┐       │        └─────────┘
┌───────┴──┴──────┐        │             │       ▼          
└─────────────────┘        └┬┬─────────┬┬┘   GET/ ...>60s ┌─────────┐
                            └┘         └┘ ───────────────►│ Server  │
                                                          └─────────┘
```

## keepalive_timeout

用於設定 Nginx 與 FastCGI 後端 server 進行通信的超時時間。當 Nginx 作為代理 server 時，keepalive_timeout 參數用於控制與上游 server 之間的 keep-alive 連接的超時時間。當一個 client 端向 Nginx 發送請求時，Nginx 會向上游 server 建立一個連接，該連接在 client 端和上游 server 之間交換數據。如果 client 端在 keepalive_timeout 設置的時間內沒有發送任何請求，該連接將被關閉。keepalive_timeout 的默認值為 75 秒。如果你的應用程序需要保持長時間的連接，可以通過增加此值來實現。但是，增加此值可能會導致在高負載時出現連接泄漏的問題，因此需要謹慎設置。


### **面對短時間大量用戶的請求時**
當nginx作為反向代理伺服器面對短時間大量用戶請求時，可以考慮將keepalive_timeout設置為較短的時間，以避免過多的閒置連接佔用伺服器資源。通常，建議將keepalive_timeout設置在5到10秒之間，這樣可以在一定程度上平衡資源的使用和用戶體驗。

此外，還可以透過調整其他參數來提高伺服器的處理能力，例如調整worker_processes和worker_connections等參數，增加伺服器的並發處理能力，提高服務器的吞吐量。需要根據實際情況進行調整，以達到最佳的性能和穩定性。

### **當面對高流量/網路延遲/較長回應時間**

1. 高流量情況下：當反向代理伺服器處理大量請求時，提高 keepalive_timeout 可以減少代理與客戶端建立新的 TCP 連線的頻率，減輕伺服器負載。

2. 網路較差的情況下：如果反向代理伺服器和後端伺服器之間的網路連線不穩定，增加 keepalive_timeout 可以降低由於短暫的連線中斷而造成的延遲和重連的次數。

3. 較長的回應時間：如果代理伺服器與後端伺服器之間的回應時間較長，例如在處理大型文件或數據庫操作時，增加 keepalive_timeout 可以減少與後端伺服器的 TCP 連線建立次數，並且可以減少代理與後端伺服器之間的 TCP 連線的重建時間。


---

# 參考資料
* [Udemy Course: Introduction to NGINX](https://www.udemy.com/course/nginx-crash-course/)
* [Udemy Course: NGINX Fundamentals: High Performance Servers from Scratch](https://www.udemy.com/course/nginx-fundamentals/)
* [Nginx Documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html)


