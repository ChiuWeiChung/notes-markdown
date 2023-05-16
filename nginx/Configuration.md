# Nginx Configuration

## **Context & Directive**

在 Nginx 的配置文件中，有兩個重要的概念：`Directive` 和 `Context`。`Directive` 是 Nginx 中用來配置服務器行為的指令，每個指令都有自己的名稱和一組參數 (key and value)，它們告訴 Nginx 該如何處理請求和響應。`Context` 是指定 `Directive` 的執行範圍或上下文環境，它告訴 Nginx 在什麼條件下該指令應該被應用。`Context` 可以是全局的，也可以是局部的。全局上下文會影響整個服務器，而局部上下文只會影響該上下文所在的範圍。

如下方的範例，當客戶端訪問 example.com 時，Nginx 會將請求轉發到本地的 8080 端口。在 location 上下文中，我們可以使用許多不同的 directive 來配置 server 行為，例如 rewrite、proxy_pass、return 等等。

```nginx
server {
    listen 80;
    server_name example.com;
        
    location / {
        proxy_pass http://localhost:8080;
    }
}
```
在上方的配置中，server 和 location 屬於 `Context`，listen、server_name 和 proxy_pass 屬於 `Directive`。另外，server `Context` 中可以包含多個 location `Context`，而 location `Context` 中也可以包含多個 `Directive`。

Directive 和 Context 是 Nginx 配置文件中的兩個基本概念。Directive 定義了服務器應該如何運行，而 Context 定義了 directive 的執行範圍和應用條件。

## **Location**

`location` 在 nginx.conf 中用來匹配客戶端的請求 URL，以便指定該如何處理這個請求。`location` 需要指定一個 URI，可以是一個精確的 URI，也可以是一個模式匹配的 URI。當收到一個請求時，Nginx 會依次將這個請求的 URI 與配置中的 `location` 遍歷匹配，並將匹配的 `location` 設定應用到這個請求上。`location` 可以包含各種指令，例如代理請求、設置緩存、設置反向代理、重定向、限流等等。

以下是一個簡單的 location 配置範例：

```nginx
location / {
    return 200 "Hello World";
}
```


這個 location 的配置是告訴 Nginx 當收到請求的 URL 路徑為 / 時，回傳 HTTP 200 OK 狀態和 "Hello World" 的內容。這個 location 配置沒有使用正則表達式或修飾符，因此這是一個 prefix match 的配置，表示當 URL 路徑以 / 開頭時，這個 location 會被匹配到。

### Location 匹配優先度
在 nginx.conf 中的 location 設定中，不同的匹配方式會有不同的優先度，優先度由高到低依次是：

1. Exact match : 使用 = 符號表示，例如：location = /path/to/resource。
2. Preferential prefix match : 使用 ^~ 符號表示，例如：location ^~ /path/to/resource。
3. Regex match : 使用 ~ 或 ~* 符號表示，其中 ~ 表示區分大小寫，~* 表示不區分大小寫，例如：location ~* \.(gif|jpg|png)$。
4. Prefix match : 使用 / 符號表示，例如：location /path/to/resource。

如果某個請求匹配了多個 location 設定，Nginx 會按照上述的優先度進行匹配，匹配到優先度最高的 location 設定即停止匹配。例如，如果有以下幾個 location 設定:

```nginx
location ^~ /Greet2 {
    return 200 'Hello from nginx "/greet" location';
}

location ~* /greet[0-9] {
    return 200 'Hello from nginx "/greet" location - EXACT MATCH INSENSETIVE';
}
```

當在瀏覽器中對 /Greet2 發出請求時，由於 `^~` 是 preferential prefix match，其優先度高於 `~*`，當 URI 與 "^~" location 的前綴匹配成功時，就算有 `~*` location 也不會再進行正規表達式匹配。因此 nginx 會使用 location ^~ /Greet2 設定來處理該請求，並回傳 Hello from nginx "/greet" location。如果 URI 不與任何 ^~ location 前綴匹配，nginx 就會嘗試逐一匹配所有 location，選擇第一個匹配成功的 location 進行處理。

## **變數 (Variables)**
在 Nginx 中，可以使用 set 指令來定義變數，例如：

```nginx
http {
    set $my_variable "hello world";
    
    server {
        location /my_location {
            return 200 $my_variable;
        }
    }
}
```

在上方的範例中，我們使用 set 指令定義一個名稱為 $my_variable 的變數，其值為 "hello world"。在 server 块的 location 段中，我們使用 $my_variable 變數作為 return 指令的回應內容。當客戶端發出請求時，Nginx 會回應 "hello world"。


### 另一個範例
```nginx
events {}

http {

  server {
    listen 80;  
    root /usr/share/nginx/html;
    index index.html;

    location /inspect {
        # $arg_name 為變數，表示瀏覽器所傳遞的 GET 參數中的 name 變數。
        return 200 "Name: $arg_name";
    }

    # 宣告一個名稱為 weekend 的變數，初始值為 No
    set $weekend 'No';

    # 如果當地時間是星期三或星期日，就將 weekend 變數的值改為 Yes
    if ( $date_local ~ 'Wednesday|Sunday' ) {
        set $weekend 'Yes';
     }

    # 發出 /is_weekend 的請求時，回應 200 status code，並且輸出一段文字
    location /is_weekend {
        # 其中的 $weekend 為變數，表示上面所定義的 weekend 變數的值。
        return 200 $weekend;
    }
  }
}
```

### Nginx 中常用到的預設變數

1. $uri: 當前請求的 URI，不包括請求參數。
2. $request_uri: 包括請求 URI 和請求參數。
3. $query_string: 請求參數部分，即 ? 後面的部分。
4. $args: 請求參數，即 $query_string 去掉 ? 的部分。
5. $request_method: 請求方法，如 GET、POST 等。
6. $remote_addr: 客戶端 IP 地址。
7. $server_name: 服務器名稱。
8. $http_user_agent: 客戶端瀏覽器標識。
9. $http_referer: 上一個網頁的 URL。
10. $status: HTTP 狀態碼，如 200、404 等。

這些變數可以在 Nginx 的配置文件中使用，方便開發者進行動態配置。另外還有一些特定模組或插件提供的變數，例如 SSL 模組提供的 $ssl_protocol、$ssl_cipher 等。

## **重新導向 (Redirect)**

當客戶端請求 URL 為 /logo 時，Nginx 會返回一個 307 redirect 狀態碼，讓客戶端轉到 /thumb.png 這個 URL，即從 /logo 重新導向到 /thumb.png。

```nginx
location /logo {
    return 307 /thumb.png;
}
```

## **修改 (Rewrite)**

當客戶端請求 URL 為 /user/[任意字母或數字] 時，Nginx 會將該請求 URL 進行 rewrite，轉換成 /greet 這個 URL。因此，當客戶端請求 URL 為 /user/123 時，Nginx 會將其 rewrite 為 /greet。

```nginx
rewrite ^/user/\w+ /greet;

location /greet {
    return 200 "Hello user"; 
}
```
當客戶端請求 /user/rick 時，會被 rewrite 指令重新寫成 /greet，然後被 location /greet 所捕捉並返回 "Hello user" 的回應。因此，客戶端最終會看到 "Hello user" 的訊息。

### last flag

在 rewrite 指令中，last 是其中一個 flag，代表該 rewrite 規則符合後，將結束當前 rewrite 的執行並且將執行結果直接套用到 Nginx 的 location 配置中。此外，last 還可以用來終止當前的 location 處理並且開始尋找新的 location 來處理請求。如下方的範例:


```nginx
rewrite ^/user/\w+ /greet last;
rewrite ^/greet/john /thumb.png;

location /greet {
    return 200 "Hello User";
}

location /greet/rick {
    return 200 "Hello Rick";
}
```

第一個 rewrite 轉址後，會停止 rewrite 並將處理權限轉交給新的 URI，即 /greet。因此，當使用者請求 /user/john 時，將會被重新導向到 /greet，然後回傳 "Hello User"。

## **Named Location**
在 nginx.conf 中，Named Location 是一種自定義的 Nginx 配置，可以在指定的 URI 位置設置一組較複雜的指令序列。它通常用於需要在多個地方使用相同的指令序列的情況，例如在多個 location 中都需要使用相同的反向代理配置或者認證配置等。

使用 Named Location 需要定義一個名稱，然後在其他 location 中使用 @名稱 的方式引用它，並將它作為 action 使用，例如 return 302 @名稱。Named Location 定義方式如下：

```nginx
location @名稱 {
    指令序列
}
```
`在 Nginx 中，Named Location 被認為是一個內部 URI，因此它的名稱不能以正斜杠 (/) 開頭，而只能以字母、數字、下劃線和減號等字符開頭。`

## **try_files** 

在 nginx.conf 中，try_files 是一個常用的指令，用於定義該如何嘗試讀取一個檔案或資料夾。如下方的範例:

在這個例子中，當收到一個請求時，nginx 會嘗試依照下列順序讀取`檔案或資料夾`：這裡的意思是：
1. Nginx 先嘗試用 $uri 指定的路徑查找檔案，如果找到了就直接返回這個檔案。
2. 如果找不到 $uri 指定的檔案，則會在根目錄下搜索 cat.png 這個檔案，如果找到了就返回這個檔案。
3. 如果仍然找不到，則會嘗試請求 /greet 這個路徑，如果這個路徑對應的位置存在且返回了有效的響應，那麼就直接返回該響應。
4. 如果這個路徑對應的位置不存在或返回了 404 等錯誤，則會到 @friend_404 這個命名的位置處理，通常用來返回一個自訂的 404 頁面。
5. try_files 常用於靜態檔案伺服器的配置中，透過嘗試不同的檔案路徑來處理靜態檔案的請求，提高服務器效能。

```nginx
try_files $uri /cat.png /greet @friend_404;

location @friend_404 {
    return 404 "Sorry, that file could not be found";
}

location /greet {
    return 200 "Hello User";
}
```


## **worker_processes**

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

## **worker_connections**

`worker_connections` 是 Nginx 配置文件 nginx.conf 中的一個參數，用於`指定每個 worker process 能夠同時處理的最大連接數`。

```nginx
events{
    worker_connections 1024;
}
```


這個參數的默認值是 worker_connections 512;，也就是每個 worker process 最多可以同時處理 512 個連接。當有更多的連接進入時，它們將被暫時存儲在一個內部佇列中，直到 worker process 能夠處理它們為止。

在配置 worker_connections 的值時，需要考慮並發連接的數量以及每個連接需要消耗的資源量，例如 CPU、內存等。通常情況下，可以根據估計的並發連接數來決定該值，但也要確保該值不會超過系統的硬件限制。

需要注意的是，如果同時配置了多個 worker process，那麼每個 worker process 的 worker_connections 參數值都會被設置為相同的值。因此，在計算並發連接數時，需要將所有 worker process 的 worker_connections 數量加總起來。


# 關於 Buffering

在 Nginx 中，Buffering是一個重要的概念，因為它決定了 Nginx 如何處理輸入和輸出。Buffering 是指將數據存儲在內存中，直到完成操作之後才進行 I/O 操作。在 Nginx 中，有三種類型的 Buffering：

吞吐量 Buffers：這些緩衝區用於在讀取或寫入期間存儲大量的數據。吞吐量緩衝區將數據存儲在內存中，直到可以進行有效的 I/O 操作。

緩存 Buffers：這些緩衝區用於存儲經過處理的數據。緩存緩衝區可以幫助提高性能，因為它們可以減少需要從磁盤讀取的數據量。

日誌 Buffers：這些緩衝區用於存儲 Nginx 日誌檔案中的數據，例如訪問日誌和錯誤日誌。

## **client_body_buffer_size**
```nginx
client_body_buffer_size 10K;
```

在 nginx.conf 中，`client_body_buffer_size` 指令是用來設定接收 HTTP 請求中的請求主體(body) 的緩衝區大小，也就是接收 POST 請求時所能接收的最大請求主體大小。當 Nginx 收到 POST 請求時，請求主體會被存儲在記憶體中，如果請求主體大小超過了緩衝區大小，Nginx 將會把請求主體寫入磁盤，這樣會導致請求處理變慢，因為磁盤寫入的速度比內存讀寫的速度慢很多。

因此，適當地調整 `client_body_buffer_size` 可以提高 Nginx 的性能，避免過大或過小的緩衝區對性能造成影響。通常建議設置為 1K 或 4K，可以根據實際情況進行調整。如果需要處理大型的 POST 請求，可以設置更大的緩衝區大小。

## **client_max_body_size**


`client_max_body_size` 是 Nginx 配置中一個重要的指令，它用來限制客戶端傳輸的請求體(body)大小。當客戶端向 Nginx 發送 HTTP POST 或 PUT 請求時，請求中包含請求體，請求體通常包含用戶提交的數據，如文件、圖片、文本等。`client_max_body_size` 可以限制用戶提交的數據大小，防止攻擊者利用大量的數據提交來消耗服務器資源。當用戶提交的請求體大小超過了 `client_max_body_size` 所設置的大小時，Nginx 會返回一個 413 狀態碼，並且拒絕處理該請求。

舉個例子，若要限制客戶端請求的請求體(body)大小為 10M，可以在 nginx.conf 中加入以下配置：

```nginx
client_body_buffer_size 10M;
```
## **client_header_buffer_size**

```nginx
client_header_buffer_size 1k;
```

在Nginx的配置文件nginx.conf中，`client_header_buffer_size` 是控制客戶端請求中 header 的緩衝區大小的指令。當客戶端向Nginx發送HTTP請求時，該請求可能包含一些標頭信息，例如cookie、User-Agent等等。這些標頭信息需要被Nginx解析，以便決定如何處理這個請求。`client_header_buffer_size` 就是控制Nginx用於解析 header 的緩衝區的大小。

如果`client_header_buffer_size` 太小，Nginx可能無法解析HTTP請求頭，進而導致請求被拒絕或者超時。如果`client_header_buffer_size` 太大，則會佔用過多的內存資源，從而影響系統的性能。