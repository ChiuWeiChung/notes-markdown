# 了解WEB SERVICE API應用

## 記錄自身對Web Service Api的理解
#### 在網路世界中時常聽到API，英文全名是(Application Programming Interfer, 應用程式介面)，網路上解釋有很多種;若要一句話簡單介紹的話，大概就是`[軟體與軟體之間的互動橋樑]`，開發者(developers)可以透過API將特定的功能添加到自己開發的軟體當中(想要海釣可以租借釣具，不必自己製作釣竿的概念)。

`Web Service Api是API的一種，但在其他領域中的Api不見得就是Web Service Api`

#### 在前後端網頁工程當中，一談到API，大多指的是web service api，簡單而言就是透過adress (ex:URL) 向遙遠的Server端請求服務、提取資料等等...，又可以根據協定、資料形式的不同將分成:

1. SOAP (Simple Object Access Protocol): data format為Proprietary XML format，頻寬需求較高，多應用於資安層面高的情況
2. REST (Representational State Transfer): data format較多元，可以是JSON、XML
3. XML-RPC: data format為specific XML，技術較早，但所需頻寬較低
4. JSON-RPC: 與XML-RPC類似，只是data format為JSON

## REST(Representational State Transfer, 表現層狀態轉換) 
#### 上述API種類最常見的是REST API，然而REST不是一種Protocol，而是一種建構風格(Architectural Style)，如何去設計REST API有他明確的限制 (REST Constraint):

* REST Constraint
    1. Uniform Interface 有單一URL對應資源位置，與API對接的窗口
    2. Client/Server Seperation 意即客戶端與伺服器端分離，伺服器端的更動並不會影響到客戶端
    3. Stateless 無狀態 (每一次請求需要向伺服器提供相關資訊)
    4. Cacheable 可被快取
    5. Layered System 分層系統架構 

#### 這邊對第3點的無狀態(stateless)以及有狀態(stateless)多做一些敘述，狀態指的是Client與伺Server的互動資訊是否會被Server保存，例如:Client第一次向Server請求了登入的需求，當Client第二次要再向Server進行登入請求時，因為先前的登入資訊已被Server保存，故請求處理的速度就會比較快，稱為有狀態(state); 倘若每次請求登入時，Server都需要Client提供相關資訊才可登入就稱為無狀態(Stateless)，若要比喻的話可以想像成:
* 每次進入酒吧，老闆都需要你出示成年證明(提供資訊)才可以進入=>無狀態(stateless)
* 進入酒吧，老闆知道你是熟面孔不用出示證明(無須提供資訊，Server已保存先前資訊)就可以進入 => 有狀態(state)


## HTTP & RESTful API
#### 依照REST風格設計的API，就被稱作RESTful API，大多數文章在介紹RESTful API之前都會先介紹HTTP，因為他充分的利用HTTP PROTOCOL的概念()，網路世界大致分為客戶端(Client)及伺服器端(Server)，而HTTP (Hypertext Transfer Protocol, 超文本傳輸協定)定義了Client/Server之間的互動方式，在這協定下有許多種呼叫方式 (ex: GET、POST、PATCH、DELETE...)，比如說我要打開FACEBOOK的首頁，於是向Server提出了要求(Request)，Server首先確認我給的網址是否存在，確認之後再將FACEBOOK頁面回傳給我(Response)，若頁面不存在則回傳我們曾經見過的`HTTP Status Code 404`;同樣地，RESTful API設計出的每一個URL就可對應不同要求(Request)的窗口，只要擁有REST API Adress (URL)，就可以利用如HTTP請求來做`GET`、`POST`、`PUT`、`DELETE`的功能，藉此進行資料的提取、新增、更新、刪減等動作，，如下方URL範例:

* 獲取商品列表 /GET /items
* 獲取商品資料 /GET /items/1
* 新增商品資料 /POST /items
* 更新商品資料 /PATCH /items/1 
* 刪除商品資料 /DELETE /items/1

</br>

##### 參考資料 
##### [rapidapi Blog](https://rapidapi.com/blog/types-of-apis/)
##### [w3.org](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5)
##### [PROGRESSBAR](https://progressbar.tw/posts/53)
##### [itsems blog](https://medium.com/itsems-frontend/api-%E6%98%AF%E4%BB%80%E9%BA%BC-restful-api-%E5%8F%88%E6%98%AF%E4%BB%80%E9%BA%BC-a001a85ab638)
##### [Wikipedia](https://zh.wikipedia.org/zh-tw/%E8%A1%A8%E7%8E%B0%E5%B1%82%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2)