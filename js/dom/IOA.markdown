# Intersection Observer API

## 提升使用者體驗
當使用者開啟網頁時，瀏覽器會將所有的內容全部render出來，倘若頁面含有大量圖片時，會因為太多複雜資訊要存取而導致等待時間拉長，假如可以在一開始先將重要的資訊(如文字內容)呈現給使用者，待使用者滑動頁面到有圖片的元素時再渲染給使用者，如此一來可以減少使用者開啟網頁的等待時間。在過去，可以透過 `addEventListener()` 監聽 `scroll` 事件，並以 `getBoundingClientRect()` 得知目標元素的相對位置，如下方程式碼，然而卷軸每一次的滾動都會使callback function執行，滾動一次就會呼叫 `getBoundingClientRect()` 重新計算目標元素的位置，如此一來會降低網頁效能，造成不好的使用者體驗，也因此，Intersection Observer API的出現解決了這樣的窘境。

``` js
const section = document.querySelector('section');
const height = section.getBoundingClientRect().height;  //得知目標元素高度
window.addEventListener('scroll', () => { //在window添加scrool事件
    const viewPoint = section.getBoundingClientRect().top; //計算目標元素的相對位置
    if (viewPoint < 0 && viewPoint > -height) { 
        console.log('target is arrived')
    } else if (viewPoint < -height) {
        console.log('target is passed');
    } else {
        console.log('target is not arrived');
    }
});
```

## 認識Intersection Observer API 
Intersection Oberserver API可以實現卷軸滾動過程中觸發一些元素事件的發生，做到Lazy Loading、Infinite Scroll等網頁效能上的優化， `IntersectionObserver()` 接收兩個參數，第一個參數為callback function，第二個參數為option(object形式)，選項中的 `root` 預設值為null，以瀏覽器的viewport為範圍，也可將觀察範圍設定為目標元素的父層元素， `threshold` 決定callback function觸發的時機，也就是元素佔據viewport的比例，`rootMargin`可以定義目標元素的margin，將觀察的範圍擴大/縮小。

``` js
const targetElement = document.querySelector('.target')

const obsCallback = function(entries, observer) { //建立callback function(傳入Intersection Observer的第一個參數)
    entries.forEach(entry => {
        console.log(entry.isIntersecting); // isIntersecting用來確認目標元素是否已經進入viewport，並回傳true/false
    })
};

const obsOptions = { //建立option(傳入Intersection Observer的第二個參數)
    root: null, //預設值為null,範圍是瀏覽器的viewport
    threshold: [0, 0.5], // 設定元素在viewport中的呈現多少比例時，才觸發事件(0.5為50%，可以是array也可以是單一數值)
    rootMargin: '10px' // 設定root的margin，藉此可以擴大/縮小範圍
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(targetElement); //將要觀察的元素傳入observe()
```

## Reveal Section DEMO
在[Codepen](https://codepen.io/rickchiu/pen/gOwOrJN)內，就是透過Intersection Observer API做到的，隨著視窗下拉時，主題會逐一浮現出來的效果。

## Lazy Loading DEMO

在[Codepen](https://codepen.io/rickchiu/pen/BaLaJPr)中展示了lazy-loading的效果，當使用者開啟頁面時，先渲染出低解析度的圖片，待使用者滑動到特定位置時再將真正的圖片呈現給使用者。

``` html
<body>
    <img src="https://media.istockphoto.com/videos/black-and-white-loading-indicator-on-dark-background
    -screen-animation-video-id1129874433?s=640x640" alt="jeremy" data-img="jeremy">
    <script>
        const url = 'https://source.unsplash.com/1600x900/?surfing';
        const images = document.querySelectorAll('.img-item');
        const imgCallback = function(entries, observer) {
            const [entry] = entries;
            if (entry.isIntersecting) { //確認目標元素是否已進入視窗
                const author = entry.target.children[0].dataset.img // 存取html data attriute的資料
                entry.target.classList.remove('img-blur') //移除blur效果
                entry.target.children[0].src = `${url},${author}`; //將真正的圖片網址傳入目標元素的src attribute
                observer.unobserve(entry.target); // 事件完成後，移除監聽事件
            }
        };
        const imgObserver = new IntersectionObserver(imgCallback, {
            root: null,
            threshold: 0.2,
            rootMargin: '10px'
        });
        images.forEach((el) => {
            el.classList.add('img-blur');
            imgObserver.observe(el)
        });
    </script>
</body>
```
## Infinite Scroll
一般而言，若網頁資訊量過多的情況下，通常會透過分頁(page 1, page 2...)來做內容的切割，倘若是屬於UNSPLASH這種免費相面共享網站，會希望使用者在同一個頁面利用滾輪就可以瀏覽大量的圖庫，然而大量的圖片資訊若要一次渲染給使用者會需要耗費大量的時間，因此會透過Intersection Obserber API做到分批渲染的功能，待瀏覽者滑動到頁面最底部時，再render新的資訊出來，如[Codepen](https://codepen.io/rickchiu/pen/XWjJLEz)所呈現的。
