# 效能與安全性

## 設定 HTTP header 的好處?

在 Nginx 設定 HTTP header 可以提高網站的安全性、性能、可讀性和兼容性，從而提升使用者體驗和網站的整體價值。

1. 提高安全性：通過設置 Content-Security-Policy（CSP）頭來防止跨站腳本攻擊（XSS）等。
2. 提高性能：通過設置 Cache-Control 頭來快取靜態資源，減少網絡流量和加快頁面加載速度。
3. 提高可讀性：通過設置 X-Powered-By 頭來顯示使用的 Web 服務器和版本號。
4. 提高兼容性：通過設置 User-Agent 頭來檢測訪問者的設備和瀏覽器，並提供相應的頁面版本。

## **快取的配置**

如下方的範例，主要是對指定的資源進行快取和一些相關的 HTTP header 配置。

```nginx
location ~* \.(css|js|jpg|png)$ {
    access_log off;
    add_header Cache-Control public;
    add_header Pragma public;
    add_header Vary Accept-Encoding;
    expires 1M;
}
```

* `access_log off`
    * : 該設定是關閉 Nginx 的訪問日誌，即不記錄這些資源的訪問記錄。
* `add_header Cache-Control public`
    * : 該設定是添加 Cache-Control header，告訴瀏覽器在多長時間內可以使用快取，"public" 表示該資源可以被任何快取區域（比如：瀏覽器、代理伺服器等）快取。
* `add_header Pragma public`
    * : 該設定是添加 Pragma header，告訴瀏覽器可以使用 HTTP 1.0 的快取策略，"public" 表示該資源可以被任何快取區域快取。
* `add_header Vary Accept-Encoding`
    * : 該設定是添加 Vary header，告訴瀏覽器根據 Accept-Encoding header 的值來決定是否快取該資源，這樣可以讓具有不同 Accept-Encoding header 值的瀏覽器能夠獨立快取。
* `expires 1M`
    * : 該設定是設置該資源的過期時間，"1M" 表示在一個月後過期。當瀏覽器第一次請求該資源時，Nginx 會將這個過期時間一同返回給瀏覽器，瀏覽器就會根據這個時間來決定是否要向伺服器重新請求這個資源。如果時間還沒到，瀏覽器會直接使用快取中的資源，從而減少伺服器的負擔，提高了訪問速度。

### **Cache-Control 與 Pragma 差在哪??**


Cache-Control 和 Pragma 都是 HTTP 標頭（header），用於控制 HTTP 的快取機制。它們的主要區別在於 Pragma 是舊版的 HTTP/1.0 標準，而 Cache-Control 是新版的 HTTP/1.1 標準。

Pragma: no-cache 表示要求不使用快取。Cache-Control: no-cache 也有相同的作用，但是 Cache-Control 還可以使用更多的指令，例如 max-age，表示快取最大存活時間。使用 Cache-Control 比 Pragma 更為常見。

另外需要注意的是，如果同時使用了 Pragma 和 Cache-Control 標頭，Cache-Control 的優先級更高，即以 Cache-Control 標頭為準。

### **Accept-Encoding header 是什麼**

Accept-Encoding header 是 HTTP 請求標頭之一，用於告知服務器瀏覽器能夠接受哪些編碼方式來壓縮數據，以便減少數據傳輸的大小，提高網頁載入速度。當瀏覽器發出請求時，會將支持的壓縮算法列舉在 Accept-Encoding header 中，例如 gzip、deflate、br 等，服務器則可以根據支持的編碼方式來對請求中的內容進行壓縮，以減少數據傳輸量。

## **針對 Response 進行壓縮**

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


## **HTTP 1.1 與 HTTP 2**

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

### **HTTP 1.1 與 HTTP 2 在連接次數的差異**


在HTTP 1.1中，客戶端與伺服器之間的通訊是單工的，也就是說，客戶端只能發送請求，伺服器只能返回回應，無法在同一連接上同時進行請求和回應。這種通訊模式被稱為“simplexing”。

在simplexing中，客戶端發送一個請求，等待伺服器的回應，回應完成後關閉連接。這意味著如果客戶端需要多個資源，必須為每個請求打開一個新的連接。在高並發的情況下，這將導致伺服器資源的浪費和性能下降。倘若在 Nginx 中使用 HTTP 1.1 協議，當客戶端向 Nginx 請求一個 index.html 時，如下方的範例:

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

假設 Nginx 中使用預設 HTTP 1.1，則客戶端與 Nginx 的連接次數如下：
1. 客戶端請求 index.html，Nginx 回應 index.html。
2. 客戶端請求 style.css，Nginx 回應 style.css。
3. 客戶端請求 index.js，Nginx 回應 index.js。

上述總共進行了 3 次請求和 3 次回應，合計三次 connections。

但如果我們使用 HTTP2 協議的話，連接次數會減少至 1 次，因為 HTTP2 支援多路徑傳輸 (Multiplexing)，可以同時傳送多個請求及回應，不需建立多次連接。因此，當 client 端向 Nginx 請求 index.html，Nginx 可以同時傳送 index.html、style.css 及 index.js，只需建立一次連接即可完成傳輸。

```nginx
http {
    server {
        # 聽取 Port 443，並使用 ssl 加密 & http2 協議    
        listen 443 ssl http2;
        root /usr/share/nginx/html;
        index index.html;   

        # 定義 憑證 & private key 的位置
        ssl_certificate /etc/nginx/ssl/self.crt;
        ssl_certificate_key /etc/nginx/ssl/self.key;
    }
}

```

## **Rate Limiting**

`limit_req_zone` 是 nginx 中的一個模組，它用於限制在特定時間內請求的數量，可以有效地防止濫用、DDoS 攻擊和流量洪峰等情況。它的基本工作原理是將請求 URI 和請求的 IP 保存在一個共享內存區域中，並且在限制請求時對其進行參考。您可以使用 limit_req 指令將其與配置文件中的 location 指令一起使用，以限制請求的數量。使用 `limit_req_zone` 可以控制並減輕服務器的壓力，從而提高服務器的性能和穩定性。

```nginx
http{
    limit_req_zone $request_uri zone=MYZONE:10m rate=60r/m;

    server{
        ....

        location / {
            limit_req zone=MYZONE;
        }
    }
}
```

上述的配置中，`limit_req_zone $request_uri zone=MYZONE:10m rate=60r/m;` 這個指令定義了一個名為 MYZONE 的 zone，並將 $request_uri 設定為這個 zone 的鍵（key）。10m 表示這個 zone 最多可以佔用 10MB 的記憶體空間，rate=60r/m 表示這個 zone 每分鐘最多處理 60 個請求（即每秒最多處理 1 個請求）。而在 `location / {}` 內部，`limit_req zone=MYZONE;` 這個指令表示使用名為 MYZONE 的 zone 來限制這個 location 中的請求。如果一分鐘之內這個 zone 的請求數量超過了 60 個，就會返回一個 503 狀態碼。

### 應對短暫且突發性的請求
如當網站剛啟動時，可能會有大量的連線請求。如果設定請求速率過低，就無法滿足這些請求，`為了允許暫時超出速率限制，以應對這種突發性請求`，我們可以定義 limit_req 模組中的一個參數 `burst`，`burst` 用於定義在限制請求速率時允許的短暫請求突發數量。假設 rate 參數是每分鐘 10 個請求，而 burst 參數設置為 5，這意味著在 1 分鐘內，允許發生最多 5 個請求突發，即短時間內允許一次性發生超過 10 個請求的情況。超過此數量的請求將被延遲處理，直到其符合限制速率。

```nginx
location / {
    # limit_req zone=MYZONE burst=5
    try_files $uri $uri/ =404;
}
```


## **隱藏 Nginx 版本號**

在沒有任何配置的情況下，Nginx 將在服務器的 HTTP Response Header 中插入一個 Server 項，其中包含 Nginx 的版本號等信息，這樣可能會暴露一些 Nginx 的安全漏洞，例如：
```nginx
Server: nginx/1.21.1
```
因為 `Server: nginx/1.21.1` 這個訊息可以被用來識別正在運行的伺服器軟體和版本，也可能被攻擊者利用來進行針對性攻擊。因此，為了提高安全性，建議將 Nginx 的 server_tokens 設定為 off，避免將過多的伺服器訊息洩露給外界。

如果 server_tokens 的設置為 on（預設值），則 HTTP Response Header 中會包含 Nginx 的版本號。如果 server_tokens 設置為 off，則 Nginx 不會在 HTTP Response Header中插入 Server 項，從而增加服務器的安全性。

## **防止 Clickjacking 以及 XSS**

```nginx
add_header X-Frame-Options "SAMEORIGIN"; 
add_header X-XSS-Protection "1; mode=block";
```

`add_header X-Frame-Options "SAMEORIGIN"`:
這個配置用來防止 Clickjacking 攻擊，即在網站中嵌入一個 iframe，用戶不知情地點擊網頁中的某個按鈕或鏈接，實際上是點擊了嵌入的 iframe 中的按鈕或鏈接，從而達到攻擊的目的。這個配置可以告訴瀏覽器在同源的情況下才允許嵌入網頁，從而防止 Clickjacking 攻擊。

`add_header X-XSS-Protection "1; mode=block"`:
這個配置用來防止跨站腳本攻擊 (Cross-site scripting, XSS)，即攻擊者通過注入腳本代碼，從而獲取用戶的敏感信息。這個配置可以告訴瀏覽器啟用 XSS 防護機制，如果檢測到有 XSS 攻擊，則會自動將請求阻止，從而保護用戶信息的安全。

舉個例子，如果一個網站使用了這兩個配置，當攻擊者試圖在網站中嵌入 iframe 或者注入腳本代碼時，瀏覽器就會根據這些配置阻止相應的請求，從而提高網站的安全性。