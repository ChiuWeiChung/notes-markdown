# Need for Nginx

舉個前端開發的過程來說明為什麼我們需要 Nginx，當我們使用 create-react-app 建立 React 應用程式時，可以使用以下兩個指令：

## 1. `npm run start` 

這個指令是用來啟動`開發伺服器（development server）`。開發伺服器會監聽指定的 Port（預設3000），並執行開發中的前端應用程式。當我們執行這個指令時，開發伺服器會處理我們寫的 code，另外還包含 hot reload 以及自動重新載入（live reloading）功能。這讓我們可以在開發過程中進行即時的編輯和調試，在 code 修改之後立即查看變更，對於開發和測試我們的應用程式非常方便。

```console            
┌─────────────────────────┐
│ http://localhost:3000/  │             Dev Environment
│─────────────────────────│      ┌────────────────────────────┐
│                         │      │      Web Container         │
│                         │      │ ┌────────────┬───────────┐ │
│                         │      │ │            │index.html │ │
│      The Browser        │◄────►│ │ Dev Server ├───────────┤ │
│                         │      │ │            │main.js    │ │
│                         │      │ └────────────┴───────────┘ │
└─────────────────────────┘      └────────────────────────────┘
```
    
在開發環境下，我們透過開發伺服器（development server）來處理我們的前端應用程式。當瀏覽器發送請求到本地主機的 3000 Port 時，實際上是發送請求到開發伺服器。開發伺服器負責處理 index.html 和其他 JavaScript 檔案，然後將它們傳送回瀏覽器。在開發環境中，開發伺服器是必需的，它負責處理 JavaScript 並將其傳送到瀏覽器。

# 2. `npm run build`

**在正式環境中，開發伺服器不再存在**，我們需要運行 `npm run build` 來建構一個產品版本的應用程式。這個建構過程將所有 JavaScript 檔案進行處理，將它們合併成單一檔案，然後輸出到一個資料夾中。這個產品版本的應用程式是我們要在正式環境中提供給使用者瀏覽器的。這個指令將我們所寫的 code 進行壓縮、優化和打包，並生成一組靜態檔案，包括一個 index.html 檔案和一個或多個 JavaScript 檔案。這些檔案已經最佳化，並且可以輕鬆地部署到任何的靜態網頁伺服器上。當我們執行這個指令後，我們將在項目資料夾的 build 目錄中找到這些生成的檔案。

```console            
┌─────────────────────────┐
│ http://localhost:3000/  │             Prod Environment
│─────────────────────────│      ┌────────────────────────────┐
│                         │      │      Web Container         │
│                         │      │ ┌────────────┬───────────┐ │
│                         │      │ │            │index.html │ │
│      The Browser        │◄────►│ │    Nginx   ├───────────┤ │
│                         │      │ │            │main.js    │ │
│                         │      │ └────────────┴───────────┘ │
└─────────────────────────┘      └────────────────────────────┘
```

在正式環境中，我們需要一個伺服器，其唯一目的是**根據瀏覽器的請求，回應 index.html檔案和相關的 JavaScript 檔案**。為了解決這個問題，我們需要使用 Nginx Server。 Nginx 的功能比 Dev Server 相對簡單，主要用於接收請求並根據這些靜態檔案的路徑進行回應。這正是我們要使用它來提供檔案的方式。

> 總結來說， `npm run start` 用於開發階段，它啟動開發伺服器並提供開發環境中的即時編輯和調試功能。而 `npm run build` 用於 production 階段，它將我們的 code 進行壓縮、優化和打包，生成最佳化的靜態檔案，以供部署到 production 環境中的靜態網頁伺服器。

## 為什麼不在正式環境使用 CRA 提供的 Dev Server?

使用 `npm run start` 主要是為了開發階段，它會啟動開發伺服器並提供即時編輯和調試功能。開發伺服器會對 code 進行處理，包括 hot reload 和自動重新載入功能，這些功能在開發過程中非常有用。

然而，**在正式環境中，我們不需要這些額外的開發伺服器功能，而是希望能夠以最輕量、高效的方式將靜態檔案提供給客戶端瀏覽器**。這就是為什麼我們需要使用 Nginx 作為 Web 伺服器來 serve 這些靜態檔案的原因。當我們執行 `npm run build` 時，它會生成最佳化的靜態檔案，讓我們可以部署到靜態網頁伺服器(Nginx Server)上。

因此，在正式環境中，我們應該使用 `npm run build` 來建立生產版本的應用程式，並將靜態檔案部署到靜態網頁伺服器上，例如 Nginx、Apache 或其他類似的伺服器。這樣可以確保我們的應用程式在正式環境中以最佳效能運行，並且提供更好的安全性和穩定性。

此外，使用靜態資源服伺服器還具有其他好處。它可以輕鬆地處理高流量的請求，提供高可用性和可靠性。它還支援瀏覽器快取和緩存機制，這可以減少對後端伺服器的壓力，提高整體效能。同時，Nginx 還提供了安全性功能，例如 SSL/TLS 加密，以保護敏感資料的傳輸。

總而言之，透過使用 npm run build 建構了一個 production 版本的應用程式後，我們需要使用網頁伺服器 (如 Nginx) 來提供靜態檔案。Nginx 的靜態資源服務功能能夠高效地回應客戶端的請求，並提供快速、可靠的靜態檔案傳送。同時，Nginx 還具有負載均衡、緩存和安全性等功能，提供了更好的效能和安全性。


---

# 參考資料
* [Udemy Course: Introduction to NGINX](https://www.udemy.com/course/nginx-crash-course/)
* [Udemy Course: NGINX Fundamentals: High Performance Servers from Scratch](https://www.udemy.com/course/nginx-fundamentals/)
* [Nginx Documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html)