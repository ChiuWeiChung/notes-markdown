# 同源政策(Same-Origin Policy)以及跨來源資源共用(CORS)

會寫這個主題主要是因為之前在chrome的console頁利用Ajax **fetch()** 來提取API資料時，遇到CORS(Cross Origin Resource Sharing, 跨來源資源共用)的問題，如下方程式碼:

```js
async function getData(){
    fetch(`https://www.metaweather.com/api/location/2487956/`);
};
getData();
// Access to fetch at **** from origin **** has been blocked by CORS policy.....
```

## 發生了什麼事?
當我們透過Fetch方式來向API取得資源是，常見的應用是向後端API拿取資料交給前端，然而，然而利用JavaScript **fetch()** 發起需求(request)時，必須遵守同源政策(Same-Origin Policy)，該政策下會強制你遵守CORS的規範。

## 何為同源?
同源需滿足三種條件:
1. 相同協定 (protocol)，即http/https
2. 相同網域 (domain)
3. 相同通訊埠 (port)

EX: 與**https://example.com/a.html** 同源的有那些

* https://example.com/b.html => yes
* https://example.com/chtml => (no, 不同protocol)
* https://subdomain.example.com/d.html => (no,不同domain)
* https://example.com:8080/e.html => (no,不同port)

## CORS & 跨來源請求(Cross-Origin Request)
非同源的情況下，會產生跨來源http請求(cross-origin request); 如上面的程式碼出現的錯誤，產生的跨來源請求因為伺服器設定沒有遵守CORS規範，所以出現錯誤。

## 如何解決?

解決的方式有兩種，一是請API的開發者開放CORS權限，第二種相對比較容易，透過第三方資源來協助存取(ex: [cross-anywhere](https://github.com/Rob--W/cors-anywhere/))，使用方式很簡單就只是將 cors-anywhere 所提供的API網址放前面，\後面加上你要訪問的API內容網址。

>這裡的第三方資源即是跨域代理伺服器(CORS PROXY)，利用伺服器端程式來繞過此問題
```js
async function getData(){
    fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/2487956/`);
}
getData();
//NO ERROR SHOWS UP
```

<br>

# 參考資料
* [Shubo's Notes](https://shubo.io/what-is-cors/)
* [1010 Code](https://andy6804tw.github.io/2017/12/27/middleware-tutorial/#%E8%B7%A8%E4%BE%86%E6%BA%90%E8%B3%87%E6%BA%90%E5%85%B1%E4%BA%AB-cors)
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)

