# Performance 

## **1. 設定 Cache-Control**

對於靜態資源（如圖片、CSS 和 JavaScript 檔案），設定 `add_header Cache-Control public` 的好處是，當使用者再次訪問相同的靜態資源時，瀏覽器可以直接從緩存中加載該資源，而不需要再次向伺服器發送請求，這可以節省帶寬和加快網頁載入速度。

如下方的範例，主要是對指定的資源進行快取和一些相關的 HTTP header 配置:
```nginx
location ~* \.(css|js|jpg|png)$ {
    access_log off;
    add_header Cache-Control public;
    add_header Vary Accept-Encoding;
    expires 1M;
}
```

* `access_log off`
    * : 該設定是關閉 Nginx 的訪問日誌，即不記錄這些資源的訪問記錄。
* `add_header Cache-Control public`
    * : 該設定是添加 Cache-Control header，告訴瀏覽器在多長時間內可以使用快取，"public" 表示該資源可以被任何快取區域（比如：瀏覽器、代理伺服器等）快取。
* `add_header Vary Accept-Encoding`
    * : 該設定是添加 Vary header，告訴瀏覽器根據 Accept-Encoding header 的值來決定是否快取該資源，這樣可以讓具有不同 Accept-Encoding header 值的瀏覽器能夠獨立快取。
* `expires 1M`
    * : 設置該資源的過期時間，"1M" 表示在一個月後過期。當瀏覽器第一次請求該資源時，Nginx 會將這個過期時間一同返回給瀏覽器，瀏覽器就會根據這個時間來決定是否要向伺服器重新請求這個資源。如果時間還沒到，瀏覽器會直接使用快取中的資源，從而減少伺服器的負擔，提高了訪問速度。

### **1.1 關於 Cache-Control**

在 Nginx 中，如果未明確設置 Cache-Control Header，則預設情況下會使用以 `no-ache` 參數，因此打開瀏覽器的開發者模式觀察，會在 Response Header 內發現 `Cache-Control: no-cache` 的狀態， 這表示瀏覽器和 Nginx Server不會直接使用快取的資源，而是每次都需要向伺服器發送請求以獲取最新的資源。

### **1.2 Accept-Encoding header 是什麼**

Accept-Encoding header 是 HTTP Request Header 之一，用於告知 Nginx 瀏覽器能夠接受哪些編碼方式來壓縮數據，以便減少數據傳輸的大小，提高網頁載入速度。當瀏覽器發出請求時，會將支持的壓縮算法列舉在 Accept-Encoding header 中，例如 gzip、deflate、br 等，服務器則可以根據支持的編碼方式來對請求中的內容進行壓縮，以減少數據傳輸量。
## **2. worker_processes**

在 Nginx 中，worker process 是處理客戶端請求和回應的進程，它們負責處理所有的 HTTP 連接、讀取請求、解析請求、處理請求和發送回應等任務。當 Nginx 收到請求時，它將請求交給一個 worker process 處理，這樣可以提高 Nginx 的性能和效率。worker process 的數量可以在 nginx.conf 文件中進行配置，通常會根據系統硬件配置和應用需求來進行調整。

```nginx
worker_processes n
```


如果在 Nginx 配置文件中指定 `worker_processes auto`;，Nginx 會自動檢測可用 CPU 核心數量，並使用這個值來設定 worker process 的數量。這個選項讓 Nginx 在不同機器上的安裝中可以自適應調整 worker process 的數量。具體而言，如果 Nginx 執行的主機擁有多個 CPU 核心，則 Nginx 將啟動與可用 CPU 核心數量相等的 worker process。如果執行主機只有一個 CPU 核心，Nginx 將僅啟動一個 worker process。這樣可以確保 Nginx 在不同的硬件配置上都能夠最大化利用資源，提高性能。但是，需要注意的是，過多的 worker process 可能會導致過度競爭 CPU 資源，從而降低性能，因此需要在實際使用中進行調整和優化。


```console
<!-- nproc 確認硬體的 CPU 數量 -->
$nproc
4
<!-- 如果 worker_processes 設定為 auto，Nginx 會自動配置四個 worker processes -->
$ ps -ef | grep nginx

root         1     0  0 15:23 ?        00:00:00 nginx: master process nginx -g daemon off;
nginx       30     1  0 15:23 ?        00:00:00 nginx: worker process
nginx       31     1  0 15:23 ?        00:00:00 nginx: worker process
nginx       32     1  0 15:23 ?        00:00:00 nginx: worker process
nginx       33     1  0 15:23 ?        00:00:00 nginx: worker process
root        60    53  0 15:26 pts/0    00:00:00 grep nginx
```

在配置 Nginx 的 worker process 時需要注意以下幾點：

* CPU 核心數量：Worker process 的數量應該根據服務器的 CPU 核心數量和使用情況來配置，以充分利用資源，並保持服務器的穩定性和可靠性。
* 記憶體使用：Worker process 消耗大量的記憶體，特別是在處理大量的請求時。因此，需要監控記憶體的使用情況，並適時調整 worker process 的數量和配置。
* 網路傳輸：Worker process 在處理請求時需要消耗網路資源，如果網路帶寬不足，將影響服務器的性能和可用性。因此，需要監控網路傳輸情況，並適時調整 worker process 的數量和配置。
* 系統資源：Worker process 的數量和配置應該與系統的其他資源一致，如硬盤空間、I/O 資源等。
* 負載均衡：在配置 worker process 時，需要考慮負載均衡的問題，特別是在高流量和高負載情況下，需要調整 worker process 的數量和配置，以確保服務器的穩定性和可靠性。

## **3. worker_connections**

`worker_connections` 是 Nginx 配置文件 nginx.conf 中的一個參數，用於`指定每個 worker process 能夠同時處理的最大連接數`。

```nginx
events{
    worker_connections 1024;
}
```


這個參數的默認值是 worker_connections 512;，也就是每個 worker process 最多可以同時處理 512 個連接。當有更多的連接進入時，它們將被暫時存儲在一個內部佇列中，直到 worker process 能夠處理它們為止。

在配置 worker_connections 的值時，需要考慮並發連接的數量以及每個連接需要消耗的資源量，例如 CPU、內存等。通常情況下，可以根據估計的並發連接數來決定該值，但也要確保該值不會超過系統的硬件限制。

需要注意的是，如果同時配置了多個 worker process，那麼每個 worker process 的 worker_connections 參數值都會被設置為相同的值。因此，在計算並發連接數時，需要將所有 worker process 的 worker_connections 數量加總起來。


## **4. Buffering**

在 Nginx 中，Buffering是一個重要的概念，因為它決定了 Nginx 如何處理輸入和輸出。Buffering 是指將數據存儲在內存中，直到完成操作之後才進行 I/O 操作。在 Nginx 中，有三種類型的 Buffering：
* 吞吐量 Buffers：這些緩衝區用於在讀取或寫入期間存儲大量的數據。吞吐量緩衝區將數據存儲在內存中，直到可以進行有效的 I/O 操作。
* 緩存 Buffers：這些緩衝區用於存儲經過處理的數據。緩存緩衝區可以幫助提高性能，因為它們可以減少需要從磁盤讀取的數據量。
* 日誌 Buffers：這些緩衝區用於存儲 Nginx 日誌檔案中的數據，例如訪問日誌和錯誤日誌。

### **4.1 client_body_buffer_size**
```nginx
client_body_buffer_size 10K;
```

在 nginx.conf 中，`client_body_buffer_size` 指令是用來設定接收 HTTP 請求中的請求主體(body) 的緩衝區大小，也就是接收 POST 請求時所能接收的最大請求主體大小。當 Nginx 收到 POST 請求時，請求主體會被存儲在記憶體中，如果請求主體大小超過了緩衝區大小，Nginx 將會把請求主體寫入磁盤，這樣會導致請求處理變慢，因為磁盤寫入的速度比內存讀寫的速度慢很多。

因此，適當地調整 `client_body_buffer_size` 可以提高 Nginx 的性能，避免過大或過小的緩衝區對性能造成影響。通常建議設置為 1K 或 4K，可以根據實際情況進行調整。如果需要處理大型的 POST 請求，可以設置更大的緩衝區大小。

### **4.2 client_max_body_size**


`client_max_body_size` 是 Nginx 配置中一個重要的指令，**它用來限制客戶端傳輸的 body 大小**。當客戶端向 Nginx 發送 HTTP POST 或 PUT 請求時，請求中包含請求體，請求體通常包含用戶提交的數據，如文件、圖片、文本等。`client_max_body_size`（預設值是 1m） 可以限制用戶提交的數據大小，防止攻擊者利用大量的數據提交來消耗服務器資源。當用戶提交的請求體大小超過了 `client_max_body_size` 所設置的大小時，Nginx 會返回一個 413 狀態碼，並且拒絕處理該請求。

舉個例子，若要限制客戶端請求的請求體(body)大小為 10M，可以在 nginx.conf 中加入以下配置：

```nginx
client_body_buffer_size 10M;
```
### **4.3 client_header_buffer_size**

```nginx
client_header_buffer_size 1k;
```

在Nginx的配置文件nginx.conf中，`client_header_buffer_size` 是控制客戶端請求中 header 的緩衝區大小的指令。當客戶端向Nginx發送HTTP請求時，該請求可能包含一些標頭信息，例如cookie、User-Agent等等。這些標頭信息需要被Nginx解析，以便決定如何處理這個請求。`client_header_buffer_size` 就是控制Nginx用於解析 header 的緩衝區的大小。

如果`client_header_buffer_size` 太小，Nginx可能無法解析HTTP請求頭，進而導致請求被拒絕或者超時。如果`client_header_buffer_size` 太大，則會佔用過多的內存資源，從而影響系統的性能。


## **5. 針對 Response 進行壓縮**

在 Nginx 沒有進行任何相關配置的情況下，預設傳送給客戶端的 response 是不會經過壓縮的。如果需要對 response 進行壓縮，需要進行相應的配置，例如啟用 gzip 壓縮。啟用壓縮有以下幾個好處：
* `降低帶寬消耗`
    * : 壓縮後的資源能夠有效地減少傳輸的數據量，減少帶寬消耗。
* `提高頁面載入速度`
    * : 壓縮後的資源能夠更快地從服務器傳輸到客戶端，加快頁面載入速度。
* `提高網站性能`
    * : 壓縮能夠減少傳輸時間，減少等待時間，從而提高網站的性能和響應速度。

```nginx
http{
    gzip on;
    gzip_comp_level 3;
    gzip_types text/css;
}
```


## **6. HTTP 1.1 與 HTTP 2**

HTTP/1.1和HTTP/2是HTTP協議的兩個主要版本。這兩個版本之間有幾個重要的差異，包括二進制協議、壓縮標頭、持久連接、多路服務器流和服務器推送等。以下是這些差異的介紹：

* **Binary Protocol（二進制協議）**
    * : HTTP/1.1使用文本協議，而HTTP/2則使用二進制協議。這意味著HTTP/2將數據轉換為二進制格式，而不是像HTTP/1.1一樣將其轉換為文本格式。使用二進制協議可以減少數據傳輸的大小，從而提高性能。
* **Compressed Headers（壓縮標頭）**
    * : HTTP/2使用HPACK壓縮算法來壓縮標頭。這意味著HTTP/2可以減少標頭的大小，從而減少數據傳輸量。此外，HTTP/2還可以將請求和響應中的多個標頭壓縮成一個單獨的帧，從而進一步減少數據傳輸量。
* **Persistent Connections（持久連接）**
    * : HTTP/1.1使用持久連接來提高性能，這意味著客戶端可以在單個連接上發送多個請求，而不必每次都建立新的連接。HTTP/2的持久連接也是基於這個思想，但是它還可以在同一個連接上並行地傳輸多個請求和響應，從而更進一步地提高性能。
* **Multiplex Streaming（多路服務器流）**
    * ： HTTP/1.1使用序列化請求和響應來實現多路服務器流。這意味著客戶端只能在同一時間內進行一個請求，而服務器也只能在同一時間內進行一個響應。HTTP/2使用多路服務器流來實現更高效的數據傳輸。這意味著客戶端和服務器可以在同一個連接上並行地傳輸多個請求和響應，從而提高性能。
* **Server Push（服務器推送）**
    * : HTTP/2 的 Server Push 能夠讓伺服器在收到請求之後，主動推送相關的資源給客戶端，以加快頁面載入速度。這種方式可以節省客戶端多次發送請求的時間，特別是對於頁面載入時需要大量的資源載入的情況。舉例來說，當客戶端請求一個 HTML 頁面時，伺服器可以主動將該頁面需要的 CSS、JS、圖片等資源推送到客戶端，這樣客戶端就不需要額外發送請求獲取這些資源，可以更快速地載入頁面。


`在 HTTP/1.1 時代，想要實現這樣的功能需要使用一些較為複雜的技術，例如應用程式層面的推送或者使用 WebSocket。而在 HTTP/2 中，Server Push 是原生支援的功能，可以更加方便地實現。需要注意的是，由於 Server Push 是由伺服器主動推送資源給客戶端，因此也存在一些風險和限制。例如，如果伺服器將不必要的資源推送給客戶端，反而可能會影響頁面載入速度。此外，Server Push 也需要額外的帶寬和伺服器資源消耗，需要合理使用。`

### **6.1 HTTP/1.1 & HTTP/2 在連接次數的差異**


在HTTP/1.1 中，客戶端與伺服器之間的通訊是單工的，也就是說，客戶端只能發送請求，伺服器只能返回回應，無法在同一連接上同時進行請求和回應。這種通訊模式被稱為“simplexing”。

在simplexing中，客戶端發送一個請求，等待伺服器的回應，回應完成後關閉連接。這意味著如果客戶端需要多個資源，必須為每個請求打開一個新的連接。在高並發的情況下，這將導致伺服器資源的浪費和性能下降。倘若在 Nginx 中使用 HTTP/1.1 協議，當客戶端向 Nginx 請求一個 index.html 時，如下方的範例:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Example Page</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
    <h1>Hello</h1>
        <script src="./index.js"></script>
    </body>
</html>
```

假設 Nginx 中使用預設 HTTP/1.1，則客戶端與 Nginx 的連接次數如下：
1. 客戶端請求 index.html，Nginx 回應 index.html。
2. 客戶端請求 style.css，Nginx 回應 style.css。
3. 客戶端請求 index.js，Nginx 回應 index.js。

上述總共進行了 3 次請求和 3 次回應，合計三次 connections。

但如果我們使用 HTTP/2 協議的話，連接次數會減少至 1 次，因為 HTTP2 支援多路徑傳輸 (Multiplexing)，可以同時傳送多個請求及回應，不需建立多次連接。因此，當 client 端向 Nginx 請求 index.html，Nginx 可以同時傳送 index.html、style.css 及 index.js，只需建立一次連接即可完成傳輸。

### **6.2 HTTP/1.1 仍是目前廣泛使用的協議**

HTTP/1.1 仍然是目前廣泛使用的協議版本，儘管 HTTP/2 提供了一些性能優勢，但是因為下方幾點原因，所以一些網站開發者選擇繼續使用 HTTP/1.1，而不是迅速轉向 HTTP/2。

1. 相容性問題：HTTP/2 是一個相對較新的協議，`需要較新的瀏覽器和伺服器支援`。一些舊版本的瀏覽器和伺服器可能不支援或部分支援 HTTP/2，這導致網站開發者需要考慮相容性問題。
2. 配置複雜性：配置和部署支援 HTTP/2 的伺服器需要一些額外的努力和知識。這可能會對一些網站開發者和網站管理者造成困擾，尤其是對於小型網站或缺乏技術資源的組織來說。
3. 效益相對較小：雖然 HTTP/2 提供了一些性能優勢，例如多路徑請求、伺服器推送和壓縮標頭，但這些優勢在某些情況下可能對某些網站的影響相對有限。對於一些簡單的靜態網站或者只有少量同時請求的網站，HTTP/1.1 可能已經足夠滿足需求。
4. 傳輸層加密要求：HTTP/2 要求使用 TLS（Transport Layer Security）進行傳輸層加密。這意味著網站必須使用 HTTPS，並獲得有效的 SSL/TLS 憑證。這可能增加了一些成本和複雜性，對於一些網站運營者來說可能是個障礙。


