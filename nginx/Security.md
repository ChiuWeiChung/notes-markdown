# 安全性

## **1. 設定 Header**

在 Nginx 設定 HTTP header 可以提高網站的安全性、性能、可讀性和兼容性，從而提升使用者體驗和網站的整體價值。

### **1.1. 防止 Clickjacking 以及 XSS**

如果一個網站使用了這兩個配置，當攻擊者試圖在網站中嵌入 iframe 或者注入腳本代碼時，瀏覽器就會根據這些配置阻止相應的請求，從而提高網站的安全性。

```nginx
add_header X-Frame-Options "SAMEORIGIN"; 
add_header X-XSS-Protection "1; mode=block";
```

* **`add_header X-Frame-Options "SAMEORIGIN"`**
    * 這個配置用來防止 Clickjacking 攻擊，假如有不肖人士在網站中偷偷嵌入一個 iframe，用戶不知情地點擊網頁中的某個按鈕或鏈接，實際上是點擊了嵌入的 iframe 中的按鈕或鏈接，從而達到攻擊的目的。這個配置可以告訴瀏覽器在同源的情況下才允許嵌入網頁，從而防止 Clickjacking 攻擊。

* **`add_header X-XSS-Protection "1; mode=block"`**
    * 這個配置用來防止跨站腳本攻擊 (Cross-site scripting, XSS)，即攻擊者通過注入腳本代碼，從而獲取用戶的敏感信息。這個配置可以告訴瀏覽器啟用 XSS 防護機制，如果檢測到有 XSS 攻擊，則會自動將請求阻止，從而保護用戶信息的安全。

>Clickjacking（點擊劫持）是一種網路攻擊技術，旨在欺騙使用者點擊網頁上看似正常的元素，實際上卻觸發了意外的操作或訪問了不應該訪問的內容。攻擊者通常將一個或多個透明的、看不見的網頁元素（如按鈕、連結、圖片）放在網頁上，並將其覆蓋在使用者實際意圖點擊的元素之上。

## **2. 設定 Rate Limiting**

`limit_req_zone` 是 nginx 中的一個模組，它用於限制在特定時間內請求的數量，可以有效地防止濫用、DDoS 攻擊和流量洪峰等情況。它的基本工作原理是將請求 URI 和請求的 IP 保存在一個共享內存區域中，並且在限制請求時對其進行參考。您可以使用 limit_req 指令將其與配置文件中的 location 指令一起使用，以限制請求的數量。使用 `limit_req_zone` 可以控制並減輕服務器的壓力，從而提高服務器的性能和穩定性。

```nginx
http{
    limit_req_zone $request_uri zone=MYZONE:10m rate=60r/m;

    server{
        location / {
            limit_req zone=MYZONE;
        }
    }
}
```

上述的配置中，`limit_req_zone $request_uri zone=MYZONE:10m rate=60r/m;` 這個指令定義了一個名為 MYZONE 的 zone，並將 $request_uri 設定為這個 zone 的鍵（key）。10m 表示這個 zone 最多可以佔用 10MB 的記憶體空間，rate=60r/m 表示這個 zone 每分鐘最多處理 60 個請求（即每秒最多處理 1 個請求）。而在 `location / {}` 內部，`limit_req zone=MYZONE;` 這個指令表示使用名為 MYZONE 的 zone 來限制這個 location 中的請求。如果一分鐘之內這個 zone 的請求數量超過了 60 個，就會返回一個 503 狀態碼。

### **2.1 應對短暫且突發性的請求**
如當網站剛啟動時，可能會有大量的連線請求。如果設定請求速率過低，就無法滿足這些請求，`為了允許暫時超出速率限制，以應對這種突發性請求`，我們可以定義 limit_req 模組中的一個參數 `burst`，`burst` 用於定義在限制請求速率時允許的短暫請求突發數量。假設 rate 參數是每分鐘 10 個請求，而 burst 參數設置為 5，這意味著在 1 分鐘內，允許發生最多 5 個請求突發，即短時間內允許一次性發生超過 10 個請求的情況。超過此數量的請求將被延遲處理，直到其符合限制速率。

```nginx
location / {
    # limit_req zone=MYZONE burst=5
    try_files $uri $uri/ =404;
}
```


## **3. 隱藏 Nginx 版本號**

在沒有任何配置的情況下，Nginx 將在服務器的 HTTP Response Header 中插入一個 Server 項，其中包含 Nginx 的版本號等信息，這樣可能會暴露一些 Nginx 的安全漏洞，例如：
```console
Server: nginx/1.21.1
```
因為 `Server: nginx/1.21.1` 這個訊息可以被用來識別正在運行的伺服器軟體和版本，也可能被攻擊者利用來進行針對性攻擊。因此，為了提高安全性，建議將 Nginx 的 server_tokens 設定為 off，避免將過多的伺服器訊息洩露給外界。

```nginx
http {
    server_tokens off; # Nginx 將不會在 Response Header 公開 Nginx 資訊
    server {
        ....
    }
}
```

如果 server_tokens 的設置為 on（預設值），則 HTTP Response Header 中會包含 Nginx 的版本號。如果 server_tokens 設置為 off，則 Nginx 不會在 HTTP Response Header中插入 Server 項，從而增加服務器的安全性。

## **4. HTTPS**

```nginx
http {
    server {
        # listen Port 443，並使用 ssl 加密 & http2 協議    
        listen 443 ssl http2;
        root /usr/share/nginx/html;
        index index.html;   

        # 定義 憑證 & private key 的位置
        ssl_certificate /etc/nginx/ssl/self.crt;
        ssl_certificate_key /etc/nginx/ssl/self.key;
    }
}

```