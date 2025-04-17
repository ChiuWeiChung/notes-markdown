# 📘 串接 IP Camera 影像至瀏覽器：研究整理筆記

最近工作上剛好遇到一個需求，要把 IP Camera 的影像透過瀏覽器顯示出來。  
看起來好像很簡單對吧？實際研究下去才發現裡面眉角不少，所以就趁這個機會好好整理一下有哪些實作方式、優缺點、支援情況等等。

---

## 一、IP Camera 常見的串流格式有哪些？

多數 IP Camera 本身會提供下列常見的串流協定／格式，通常可以透過攝影機本身的網頁介面或說明文件查到：

- **RTSP（Real-Time Streaming Protocol）**  
  幾乎所有監視器都支援的主流串流協定，屬於即時串流格式，但瀏覽器端不支援，需要額外處理才能播放。

- **MJPEG（Motion JPEG over HTTP）**  
  就是一張一張的 JPEG 圖組合成影片，通常會提供一個 HTTP 連結（例如 `http://<ip>/video.mjpg`），可以直接用 `<img>` 播放。

> 📌 小提醒：IP Camera 的串流格式通常不只一種，可能 RTSP、MJPEG 都有提供，只是網址不同。可以參考產品手冊或管理後台看支援哪些格式。

---

## 二、瀏覽器對這些格式支援怎麼樣？

| 協定 / 格式 | 瀏覽器支援 | 備註 |
|-------------|------------|------|
| RTSP | ❌ 完全不支援 | 需要中介伺服器轉換 |
| MJPEG | ✅ 支援 | 可以直接用 `<img>` 播，但沒音訊 |
| HLS (.m3u8) | ✅ Safari 原生支援，Chrome 要用 JS 播 | 建議配合 hls.js 使用 |
| DASH (.mpd) | ✅ 大多數現代瀏覽器支援，需要 JS 播放 | 建議配合 dash.js 使用 |
| WebRTC | ✅ 支援 | 低延遲好用但整合稍複雜，需要 Media Server 協助 |

---

## 三、實作方式有哪些？

### ✅ 1. 直接播放 MJPEG（快速又簡單）

如果你的 IP Camera 有提供 MJPEG 的串流網址，直接用 HTML 播就好：

```html
<img src="http://192.168.1.100/video.mjpg" />
```

- **優點**：超級簡單、不需要轉格式、不用加 JS
- **缺點**：只能播畫面，沒有音訊，而且會吃頻寬、延遲偏高

---

### ✅ 2. RTSP → HLS（常見做法）

因為瀏覽器不吃 RTSP，所以我們可以用工具把 RTSP 轉成 HLS（`.m3u8` 格式），再在前端用 `video` 播。

例如用 FFmpeg 做轉檔：

```bash
ffmpeg -i rtsp://192.168.1.100/live \
       -c:v libx264 -hls_time 2 -hls_list_size 3 -f hls /output/stream.m3u8
```

前端播放搭配 [hls.js](https://github.com/video-dev/hls.js)：

```html
<video id="video" controls autoplay></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  const video = document.getElementById('video');
  const hls = new Hls();
  hls.loadSource('/stream.m3u8');
  hls.attachMedia(video);
</script>
```

### ✅ 3. RTSP → DASH（常見做法）

```bash
ffmpeg -rtsp_transport tcp   -i rtsp://<CAM_IP>:554/stream   -c copy   -f dash   -window_size 5   -extra_window_size 5   /var/www/html/live.mpd
```

前端播放搭配 [dash.js](https://github.com/Dash-Industry-Forum/dash.js)：

```html
<video id="dashVideo" controls autoplay muted style="width:100%"></video>
<script src="https://cdn.jsdelivr.net/npm/dashjs@latest/dist/dash.all.min.js"></script>
<script>
  dashjs.MediaPlayer()
    .create()
    .initialize(
      document.getElementById('dashVideo'),
      'https://your-server/live.mpd',
      true
    );
</script>
```

---

### ✅ 4. RTSP → WebRTC（低延遲但稍複雜）

WebRTC 在瀏覽器端支援很好，延遲也低，但一樣不吃 RTSP，這時就需要搭配 **Media Server** 來協助轉換。

🔍 **待研究的 Media Server（之後可以依功能與容易程度挑一個試玩）：**

- [**MediaMTX**](https://github.com/bluenviron/mediamtx)（前身是 rtsp-simple-server，開源且支援多種格式轉換）
- [**Ant Media Server**](https://antmedia.io/)（支援 WebRTC/HLS/RTMP，但是商業授權）
- [**Janus Gateway**](https://janus.conf.meetecho.com/)（功能最齊全，但設定略複雜）

整體架構會長這樣：
```text
IP Camera (RTSP)
      ↓
Media Server（轉 WebRTC）
      ↓
瀏覽器端播放
```

- **優點**：低延遲、支援音訊、雙向溝通都 OK
- **缺點**：整合比較複雜，Media Server 要架、網路防火牆設定也要注意

---

## 四、根據需求怎麼選擇？

| 情境 | 推薦做法 |
|------|----------|
| 只是預覽畫面、Demo 用 | MJPEG `<img>` |
| 想支援主流瀏覽器，音訊可有可無 | RTSP ➜ HLS + hls.js |
| 想要低延遲、支援音訊、比較專業的播放體驗 | RTSP ➜ WebRTC（搭配 Media Server） |


