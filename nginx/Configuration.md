# Nginx Configuration

## **1. Context & Directive 的觀念**

在 Nginx 的配置文件中，有兩個重要的概念：`Directive` 和 `Context`。

* **`Directive`**: 
    * 是 Nginx 中用來配置服務器行為的指令，每個指令都有自己的名稱和一組參數 (key and value)，用來告訴 Nginx 該如何處理請求和響應。
* **`Context`**: 
    * 是指定 `Directive` 的執行範圍或上下文環境，類似 Scope 的概念，`用來告訴 Nginx 指令應該在什麼條件下被應用`。`Context` 可以是全局或局部的。全局上下文會影響整個服務器，而局部上下文只會影響該上下文所在的範圍。

如下方的範例，當客戶端訪問 example.com 時，Nginx 會將請求轉發到本地的 8080 端口。在 location 上下文中，我們可以使用許多不同的 `Directive` 來配置 server 行為，例如 rewrite、proxy_pass、return 等等。

```nginx
server { # -> Context
    listen 80; # -> Directive
    server_name example.com; # -> Directive
        
    location / { # -> Context
        proxy_pass http://localhost:8080; # -> Directive
    }
}
```

在上方的配置中，server 和 location 屬於 `Context`，listen、server_name 和 proxy_pass 屬於 `Directive`。另外，server `Context` 中可以包含多個 location `Context`，而 location `Context` 中也可以包含多個 `Directive`。

 > `Directive` 定義了服務器應該如何運行，而 `Context` 定義了 `Directive` 的執行範圍和應用條件。

## **2. Location**

`location` 在 nginx.conf 中用來匹配客戶端請求的 URL，告訴 Nginx 該如何處理這個請求。`location` 需要指定一個 URI，可以是一個精確的 URI，也可以是一個模式匹配的 URI。當收到一個請求時，Nginx 會依次將這個請求的 URI 與配置中的 `location` 遍歷匹配，並將匹配的 `location` 設定應用到這個請求上。`location` 可以包含各種指令，例如代理請求、設置緩存、設置反向代理、redirect 等等。


```nginx
location / {
    return 200 "Hello World";
}
```

上方是一個簡單的 location 配置範例，用來告訴 Nginx 當收到請求的 URL 路徑為 / 時，回傳 status code 200 (OK 狀態)和 "Hello World" 的內容。這個 location 配置沒有使用正則表達式或修飾符，因此這是一個 prefix match 的配置，表示當 URL 路徑以 / 開頭時，這個 location 會被匹配到。

### **2.1 Location 匹配優先度**
在 nginx.conf 中的 location 設定中，不同的匹配方式會有不同的優先度，**優先度由高到低依次是**：

1. 精確匹配 (Exact match) : 使用 = 符號表示
    * 例如 `location = /path`，那麼只有當請求的 URL 完全匹配 /path 時，指令才會被選中處理。
2. 前綴匹配 (Preferential prefix match) : 使用 ^~ 符號表示
    * 例如 `location ^~ /path`，當請求的 URL 以 /path 開頭時，該 location 指令會被優先選中處理。
3. 正規表達匹配 (Regex match) : 使用 ~ (區分大小寫) 或 ~* (不區分大小寫)表示
    * 例如：`location ~* \.(gif|jpg|png)$`，當請求的 URL 符合正則表達式時，該 location 指令會被選中處理。
4. 普通前綴匹配 (Prefix match) : 使用 / 符號表示
    * 例如 `location /path`，那麼 UR L以 /path 開頭時，該 location 指令會被選中處理。

如果某個請求匹配了多個 location 設定，Nginx 會按照上述的優先度進行匹配，匹配到優先度最高的 location 設定即停止匹配。例如，如果有以下幾個 location 設定:

```nginx
location ^~ /Greet2 { # 前綴匹配
    return 200 'Hello from Preferential prefix match';
}

location ~* /greet[0-9] { # 正規表達匹配 
    return 200 'Hello from Regex match';
}
```

當在瀏覽器中對 /Greet2 發出請求時，由於 `^~` 是前綴匹配，其優先度高於 `~*`，當 URI 與 `^~` location 的前綴匹配成功時，就算有 `~*` location 也不會再進行正規表達式匹配。因此 nginx 會使用 `location ^~ /Greet2` 設定來處理該請求。如果 URI 不與任何 `^~` location 前綴匹配，nginx 就會嘗試逐一匹配所有 location，選擇第一個匹配成功的 location 進行處理。

## **3. 變數 (Variables)**
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


### **3.1 另一個範例**
```nginx
events {}

http {

  server {
    listen 80;  
    root /usr/share/nginx/html;
    index index.html;

    location /inspect {
        # $arg_name HTTP GET Request 中的 name 變數。
        return 200 "Name: $arg_name";
    }

    # 宣告一個名稱為 weekend 的變數，初始值為 No
    set $weekend 'No';

    # 如果當地時間是星期三或星期日，則將 weekend 變數改為 Yes
    if ( $date_local ~ 'Saturday|Sunday' ) {
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

> $arg_name 變數是一個具體的查詢參數變數，其中的 "name" 部分應替換為實際的查詢參數名稱。例如，如果 URL 是 http://example.com/?foo=bar，那麼 $arg_foo 的值將為 "bar"。

### **3.2 Nginx 中常用到的預設變數**

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

## **4. 重新導向 (Redirect)**

當客戶端請求 URL 為 /logo 時，Nginx 會返回一個 307 redirect 狀態碼，讓客戶端轉到 /thumb.png 這個 URL，即從 /logo 重新導向到 /thumb.png。

```nginx
location /logo {
    return 307 /thumb.png;
}
```

## **5. 修改 (Rewrite)**


```nginx
rewrite ^/user/\w+ /greet;

location /greet {
    return 200 "Hello user"; 
}
```

在上方的配置中，只要客戶端請求 URL 為 /user/[任意字母或數字] 時，Nginx 會將該請求 URL 改寫成 /greet 這個 URL。
當客戶端請求 `/user/rick` 或是 `/user/123` 時，會被 `rewrite` 指令重新寫成 /greet，隨即被 `location /greet` 捕捉並返回 "Hello user"，客戶端最終會看到 "Hello user" 的訊息。

```nginx
# 正則表達式 ^/user/(\w+) 使用括號 () 捕獲了匹配的部分，而 $1 代表第一個捕獲的結果。
rewrite ^/user/(\w+) /greet/$1;
rewrite ^/greet/rick /thumb;

location /greet {
    return 200 "Hello User";
}

location /thumb {
    return 307 /thumb.png;
}

```
當用戶請求 `/user/rick` 時，`第一個 rewrite` 將 /user/rick 重寫為 /greet/rick。`第二個 rewrite` 將 /greet/rick 重寫為 /thumb.png。因此 `/user/rick` 的請求會被重新導向 /thunb.png 的位置。

### **5.1 Rewrite 的 flag**
在 Nginx 的 `rewrite` 指令中，flag 是用來控制其行為，兩個常用的 flag 分別是 `last` 和 `break`。

* **`last`** ：
    * 表示當前的 rewrite 規則被匹配後，**停止解析任何後續的重寫規則，並重新將請求發送到 Nginx 的處理器進行處理**。
    * 重寫後的 URL 作為新的請求重新處理。意即會`重新對所有的 location block 進行匹配`。
* **`break`** ：
    * 表示當前的 rewrite 規則被匹配後，**將停止解析任何後續的重寫規則，直接向下面的 location 尋找對應的匹配**。
    * 通常在需要進行重寫並停止進一步處理的情況下使用 break 。

> 當使用 break 或 last flag 的重寫條件匹配成功時，**Nginx 都會停止解析任何後續的重寫規則！**

### **5.2 在 location block 之外使用 `break 或 last`**

```nginx
rewrite ^/loc1 /loc2 last; #使用 break 也會得到相同的結果
rewrite ^/loc2 /loc3;


location /loc1 {
    return 200 "loc 1";
}

location /loc2 {
    return 200 "loc 2";
}

location /loc3 {
    return 200 "loc 3";
}

```
在上述的配置中，使用 `break` 或 `last` flag 時，Nginx 都會停止處理任何後續的重寫條件，若客戶端發出 `/loc1` 的請求時，nginx 會對 URI 進行重寫，將 `/loc1` 改寫為 `/loc2`，並使用 `last`（或是 `break`）確定重寫後的 URI ，忽略接下來的 rewrite 程序，**直接尋找對應的 location block**。因此，nginx 會匹配到 `location /loc2`，並 status code 200 和字串 "loc 2" 給客戶端。


### **5.3 在 location block 內部，使用 `last`**
```nginx
location /loc1 {
    rewrite ^/loc1 /loc2 last;
    return 200 "loc 1";
}

location /loc2 {
    return 200 "loc 2";
}
```

在上述的配置中，當客戶端發出 `/loc1` 的請求時，會先匹配到 `location /loc1` 時，`rewrite ^/loc1 /loc2 last` 會將 URL 重寫為 `/loc2`，**此時 Nginx 會重新處理新的 URL (跳脫原本的 `location block`，重新尋找匹配的 location)**。因此，新的 URL `/loc2` 將匹配到 `location /loc2`，並 status code 200 和字串 "loc 2" 給客戶端。。

### **5.4 在 location block 內部使用 `break`**
```nginx
location /loc1 {
    rewrite ^/loc1 /loc100 break;
    rewrite ^/loc100 /loc200; # 此段會被忽略，因為前次的 rewrite 有 break flag
    echo "loc 1, url: $uri";
}
```
使用 `break` 時，雖然會停止處理後續的重寫條件，**並不會跳脫原本的 `location block`**。如果透過客戶端進行 `/loc1` 的請求時，Nginx 的結果仍是 `loc 1, url: /loc100`。

## **6. Named Location**
在 nginx.conf 中，Named Location 是一種自定義的 Nginx 配置，可以在指定的 URI 位置設置一組較複雜的指令序列。它通常用於需要在多個地方使用相同的指令序列的情況，例如在多個 location 中都需要使用相同的反向代理配置或者認證配置等。

使用 Named Location 需要定義一個名稱，然後在其他 location 中使用 @名稱 的方式引用它，並將它作為 action 使用，例如 return 302 @名稱。Named Location 定義方式如下：

```nginx
location @名稱 {
    指令序列
}
```
`在 Nginx 中，Named Location 被認為是一個內部 URI，因此它的名稱不能以正斜杠 (/) 開頭，而只能以字母、數字、下劃線和減號等字符開頭。`

## **7. try_files** 

在 nginx.conf 中，`try_files` 是一個常用的指令，告訴 Nginx 該如何嘗試讀取一個檔案或資料夾。`try_files` 指令可以**包含一個或多個文件路徑，以及一個最終的 URI**。當收到請求時，Nginx 會依序嘗試這些文件路徑，如果存在，則返回該文件的內容；如果所有文件都不存在，則將請求重新定向到指定的 URI。

如下方的範例:
```nginx
try_files $uri /cat.png /greet @friend_404;

location @friend_404 {
    return 404 "Sorry, that file could not be found";
}

location /greet {
    return 200 "Hello User";
}
```

在這個例子中，當收到一個請求時，nginx 會嘗試依照下列順序讀取`檔案或資料夾`：這裡的意思是：
1. Nginx 先嘗試用 $uri 指定的路徑查找檔案，如果找到了就直接返回這個檔案。
2. 如果找不到 $uri 指定的檔案，則會在**根目錄**下搜索 cat.png 這個檔案，如果找到了就返回這個檔案。
3. 如果仍然找不到，則會嘗試請求 /greet 這個路徑，如果這個路徑對應的位置存在且返回了有效的響應，那麼就直接返回該響應。
4. 如果這個路徑對應的位置不存在或返回了 404 等錯誤，則會到 @friend_404 這個命名的位置處理，通常用來返回一個自訂的 404 頁面。
5. try_files 常用於靜態檔案伺服器的配置中，透過嘗試不同的檔案路徑來處理靜態檔案的請求，提高服務器效能。


--- 



## **時間與容量的配置對應表**

這些單位可以用來指定大小和時間間隔，以便在 Nginx 的配置中進行設定。我們可以根據需要使用這些單位來指定數字，以便更容易理解和設置相應的值。

### **Table**
|單位       |表示法     |單位      |表示法     |單位       |表示法     |單位       |表示法     
|----------|----------|----------|----------|----------|----------|----------|----------
|byte      |1024      |milisecond|ms        |day       |d         |hour      |h       
|kilobytes |1k or 1K  |second    |s         |week      |w         |year      |
|megabytes |1m or 1M  |minute    |m         |month     |M         

