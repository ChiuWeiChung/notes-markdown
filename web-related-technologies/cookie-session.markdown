# 認識 Cookie 和 Session

## Cookie

所謂的 Cookie 指的是存放在瀏覽器的一小片段資訊，一般而言，使用者在拜訪某個網頁時，Server 端可以將一小片段的資訊以 `key/value pair` 的形式送回使用者的瀏覽器，瀏覽器則會將這些小片段資訊以 Cookie 的形式儲存起來，並在使用者下次再向 Server 發出請求時， 這些 Cookie 又會一起被送到 Server 端。

### **Cookie 的用處?**

Cookie 的存在主要是讓 HTTP 請求由無狀態 (Stateless) 的協議變成 有狀態 (Stateful) 的協議，為了維護 Server 與瀏覽器之間的"**狀態**"，就可以用到 Cookie 來實現。 

Cookie 常見的應用包括 1. 保持用戶登入的狀態 2. 記住上次購物車的內容 3. 紀錄上次遊戲最高分數 4. 使用者偏好設定 (背景、字體顏色) ..... 等等。

* 一個 Cookie 可存放的 `key/value pair` 的大小約 4096 bytes。
* Cookie 不能跨 Domain 存取 。
* 生命週期 : 可以設定過期時間，時間一到就會失效。

## 以 Express 實作 Cookie

### **發送 Cookie**

如下方程式碼，造訪 `localhost:3000/getcookie` 時，瀏覽器會將 Server 送下來的 Cookie 儲存起來。
 

```js
const express = require('express');
const app = express();

app.get('/getcookie', (req, res) => {
    res.cookie('name', 'Rick');
    res.send('Hi there');
})
```

![cookie-session-1]()

### **接收 Cookie**

在上面有提到，瀏覽器在進行 HTTP 請求時會夾帶著 Cookie 到 Server 端，因此在下面程式碼中，如果已經拜訪過 `localhost:3000/getcookie` ，並將 `{ name: 'Rick' }` 存放在瀏覽器的 Cookie 內，只要使用者再向同一 Domain 的 Server 端進行拜訪 (ex : `localhost:3000/takecookie` ) ，Server 端就會接收到從瀏覽器傳回的的 Cookie。

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/getcookie', (req, res) => {
    res.cookie('name', 'Rick');
    res.send('Hi there');
})

app.get('/takecookie', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies); //{ name: 'Rick' }
})
```

> Express 沒有解析 Cookies 的功能，需要透過第三方套件 `cookie-parser` 作為 Middleware。

## Cookie 可以被竄改

由於 Cookies 的 `key/value pair` 是光明正大地躺在瀏覽器內，因此資料很容易被修改，只要在開發者模式就可以進行 Cookie 的修改，如下圖 ( `'Rick'` 被改成 `'Big Fat Duck'` )，因此在使用者在拜訪 `http://localhost:3000/takecookie` 時， Server 端所接收到的 Cookie 就會是 `{ name: 'Big Fat Duck' }` ，為了讓 Server 能夠偵測接收的 Cookie 是否已被"玷汙"了，我們可以將 Cookie 進行 Signing (簽署) 的動作，確保接收到的完整性。

![cookie-session-2]()

## 簽署 Cookie (Signed Cookie)

所謂的簽署 (Signing) 就是將 Cookie 中的 `value` 尾端加入獨一無二的字串，主要是透過 HMAC 使用密碼雜湊函式 (Hash Function)，同時結合一個加密金鑰 (Secret Key) 來產生。我們在這裡利用它來**保證資料的完整性**，也可以用來作某個訊息的身分驗證。

> Signed Cookie 的用意不在於將 `value` 加密並隱藏起來，而是確保 Cookie 在 Server 端與瀏覽器之間來回的過程中，其內容仍是完整未被修改過的。

### **發送及接收 Signed Cookie**

如下方程式碼，在將 `cookie-parser` 作為 Middleware 時，順便把 Secret Key 帶入 (可以是任何字串)，不同的 Secret Key 所產生出的字串也會不一樣。

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

//將 Secret Key ('ilovewebdevelopment') 帶入 cookieParser 當中
app.use(cookieParser('ilovewebdevelopment'));

app.get('/getcookie', (req, res) => {
    res.cookie('name', 'Rick', {
        signed: true // signed 設定為 true 
    });
    res.send('Hi there');
})

app.get('/takecookie', (req, res) => {
    //在 Express 內獲取 Signed Cookies 需透過 req.signnedCookies
    console.log(req.signnedCookies) // {name:'Rick'}
    res.send('take cookie back');
})
```

![cookie-session-3]()

如上圖顯示，Cookie 中的 `value` 仍然有 `Rick` 存在，因為 簽署 (Signing) 的目的並不是把內容進行加密，而是在 `value` 尾端加入一個字串 (如上圖的 `.9d7yr1vWTuWX1QsW....` )，在下次的 HTTP 請求時， Server 會將回傳的 `value` 搭配 Secret Key ( `ilovewebdevelopment` ) 執行再次簽署 (Re-Signing) 的動作，如果得到的字串仍是 `.9d7yr1vWTuWX1QsW....` ，則代表 Cookie 沒有被更改過，若 Cookie 被更改過，得到的 `value` 會是 `false` 。

## 關於 HMAC

上面有提到 Signed Cookie 是透過 HMAC 進行簽署的動作， HMAC 會透過雜湊函式以及我們提供的 Secret Key 對 `value` 產生對應的字串，在這邊透過線上的 [HMAC Generator](https://www.freeformatter.com/hmac-generator.html#ad-output) 做一些展示。下面三組資料都是透過相同的雜湊函式 (SHA 256) 進行產生的字串，但由於 `value` 的不同 (大寫開頭的 `Cat` 以及小寫開頭的 `cat` ) 或是 Secret Key 的不同 ( `ilovecat` 以及 `ilovedog` ) 都會得到不同的字串。

|   Value   | Hash Function | Secret Key |                            得到的字串                           |
|-----------|---------------|------------|----------------------------------------------------------------|
|    Cat    |   SHA 256     |  ilovecat  |221a425c95eba72be936487e75092a368bf84e5a3f35eb132ae33350ce471d03|
|    Cat    |   SHA 256     |  ilovedog  |2b93e1ea0732d1e3e4c7c6bdfc699d6920d324821495ae7a3b9caddcd2f0a96c|
|    cat    |   SHA 256     |  ilovecat  |c1e6b8e57605c0bd4ede3ecaf8a7747ef3313776c29f687121333f02a25c02f7|

---

## Session

Session 的目的與 Cookie 相同，也是使 HTTP 請求由無狀態 (Stateless) 變成有狀態 (Stateful) 的機制，與 Cookie 的差異在於，Session 把資料存在 Serve 端 (緩存內部)，Cookie 則是把資料存放在瀏覽器。 

### **為何選擇 Session?**

1. Cookie 所能存放的資料量不大 (約 4096 bytes)。
2. 瀏覽器有限制同一 Domain 下能存放 Cookies 的數量。
3. 存放機密資訊有安全疑慮

Cookie 除了無法存放太多資料量之外，任何人都可以透過瀏覽器來觀察 Cookie 的內容，因此對於存放較敏感的資訊會有安全上的疑慮。

Session 克服上述 Cookie 所包含的限制，概念是當使用者對 Server 端發出請求時，Server 端僅是回傳一個帶有 Session ID 的 Cookie 給瀏覽器，這個 Session ID 主要是用來做為身分識別的用途。

### **Session 的例子**

舉例來說，當小明打開逛購物網站時，Server 端會僅具有 Session ID 的Cookie 存放在小明的瀏覽器，當小明把商品加進購物車時，購物車資訊會存放在 Server 端內的 Session Store (緩存)，且該購物車資訊對應著小明的 Session ID，當小明下次在拜訪購物網站時，瀏覽器將小明的 Session ID 帶到 Server 端，Server 端透過 Session ID 找到 Session Store (緩存)內對應的購物車商品，並回傳給小明的瀏覽器。

也就是說，Session 的機制是讓 Server 端送發出的僅具有 Session ID 的 Cookie，該 Session ID 對應著 Server 內部 Session Store 所儲存的使用者資訊 (購物車內容、使用者名稱.....)，這些使用者資訊並不會隨著 HTTP 請求以 Cookie 的形式回傳給瀏覽器，只能透過對應的 Session ID 來開啟。
 

### **什麼是Session Store?**

Session Store 就是存放 Session 的地方，一般而言，Session Store 與一般的 Database (如 MongoDB) 不同，因為存放的內容並不需要長期保存，通常取而代之的會使用較輕量、存取快速的 Database (如 Redis)。

## 以 Express 實作 Session

如下方程式碼，透過 `express-session` 作為 Express 的 Middleware，並傳入 Secret Key，當我們在拜訪 `localhost:3000` 時，瀏覽器就會收到名為 `connect.sid` 的 Cookie ，也就是 Session ID，當拜訪 `localhost:3000/testpage` 時，Sever 可以辨識瀏覽器傳回的 Session ID 以便將拜訪次數儲存 Session 內部。

```js
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({secret:'ilovewebdevelopment'}));

app.get('/',(req,res)=>{
    res.send('hi there')
})

app.get('/testpage', (req, res) => {
    if (!req.session.count) {
        req.session.count = 1
    } else {
        req.session.count += 1
    }
    res.send(`You have visited this page ${req.session.count} times!`);
})
```
> 在沒有設定 Session Store 的情況下，Session 存放的位置會在 Server Local Memory。

![cookie-session-4]()

![cookie-session-5]()

# 參考資料
* [The Web Developer Bootcamp 2022](https://www.udemy.com/course/the-web-developer-bootcamp/)
* [白話 Session 與 Cookie：從經營雜貨店開始](https://hulitw.medium.com/session-and-cookie-15e47ed838bc)
* [[不是工程師] 會員系統用Session還是Cookie? 你知道其實他們常常混在一起嗎？](https://progressbar.tw/posts/92)

<!-- 

OK, so if we go to the cookie password document documentation, there's this line at the beginning. It says, optionally, you may enable signed cookie support by passing a secret string. OK, so what is this talking about? What is signed cookie support or just signed cookies?
Well, the idea behind signing something in programming, we're usually referring to a digital signature or a cryptographic signature.
The idea is not to encrypt or hide information. Instead, it is to be able to verify its integrity, verify that something hasn't changed.
Think of a wax seal on an old letter. You put that wax seal on there. And if that letter makes it to you or to your whoever you're sending it to and that seal is not broken, then you know you know that the integrity of that letter is still intact. Nobody has read it.

And what that will do is have Cookie Parcher sign it using a secret code that I'm going to specify. basically it's going to sign it and then
send this weirder looking version of our cookie to the client. Then on the client side, that weird looking version, the signed version will be sent back just like
any other cookie. That's all it is. It's just a regular old cookie. But on the server side, when we're looking at the cookies that have been sent to us, we'll be able
to verify or cookie parser will be able to verify and tell us if any of those signed cookies have been tampered with, essentially, if they're the exact same value that was sent. You know, if if somebody screwed them in any way, we'll be able to tell because they won't match.

> So signing is not about hiding the information. It's not about encrypting it. It is about making sure that the original data that we sent to the client, to the browser is still the data being sent back to us. -->

<!-- Session -->

<!-- Sessions are kind of similar to the idea of cookies in that we're trying to add in some state fullness to HTTP, which is inherently a stateless protocol. We're trying to save or share some information from one request to the next.

 Now, of course, we have databases where we can persist information. So that's not the the idea. It's not just to store data permanently. We can use a database on the server side to do that. What we're trying to do is persist something from one request to the next to keep track of, you know, who's currently logged in, what's the person's user name, who's logged in or what's in somebody's shopping cart before they check out. So cookies and sessions can be used to accomplish this. But sessions are on the server side. **So sessions, we store the actual data itself on the server side, not in the browser, which is what we do with cookies.**

 What's wrong with cookies? Nothing's really wrong with them, but there are a couple of considerations. 
 
 1. One is that cookies have a maximum size in your browser. Most browsers, at least there is a limit, first of all, on the number of cookies you can have per domain and the size of each cookie, how much information they can store. So that's one consideration. If we have a lot of information we wanted to associate with a user or that we wanted to persist from one request to the next cookies may not be the best choice. 
 
 2. But second of all, cookies are just not as secure as storing information on the server side. So this is where sessions come in. The idea of a session is that we store information on the server side and then we send a little cookie back to the client that says, here's your key, here's the ID you need to unlock that session. So sessions are kind of similar to the idea of cookies in that we're trying to add in some statefullness to HTTP, which is inherently a stateless protocol.

 So what we do or what we can do is have a session. And in that session we have some ID that we associate your information with your shopping cart data with in the Sessions store. So here's a little subset. You know, I've got ID three, four and five. Usually these IDs are not going to be single digit numbers, but whatever that ID is, one of them will be associated with me. 
 
 Let's say I'm browsing with my browser. OK, so the server is going to send back to me just a little ID as a cookie. It's not going to send back the shopping cart, is not going to send back whatever other information I have in the session itself. It simply sends me back the key to unlock my data and my browser stores that. So then on subsequent requests, my browser can say, hey, I have a cookie. It's a really small one. Just says my session idea is for what does that mean? And then the server gets that on every single request, just one little cookie. I sometimes will have more, but you know, all we need is one for the session. The server can then take that ID and then go to the the session data store and retrieve all relevant information so we can store a ton of information on the server side that will persist. We'll have some state from one request to the next, but all we need to store in the browser is some sort of ID or key to unlock that session. 

  -->
