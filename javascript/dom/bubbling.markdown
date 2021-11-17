# Bubbling aned capturing(冒泡與捕捉)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## 冒泡事件

所謂的冒泡事件，指的是當子元素的 DOM Event 被觸發時，引起父層元素、祖父元素、曾祖父元素... 的監聽事件也隨後被觸發，如[我的Codepen](https://codepen.io/rickchiu/pen/abmdYMW)所呈現，整個 html 結構有外而內分別是 `html` 、 `body` 、`外層 div` 、`中間層 div` 、`內層 div` ，當我分別在`三層 div` 中都加入 **click** 的事件後，其內部的回呼函式會被執行並改變元素的背景顏色。

可以發現點擊`內層 div` 時，`中間層 div` 及`外層 div` 的 Event Handler 也被執行，這就是所謂的冒泡事件，內層事件觸發也會引起父層元素事件被觸發。

## 冒泡/捕捉是如何發生的?

如下方程式碼，當元素 `inner div` 被點擊時， click 事件並不會一開始就出現在 `inner div` ，而是出現在 DOM tree 的最頂端， click 事件會"從 DOM tree 的頂端開始沿著 inner div 的父層元素，一層一層的往內走"，在抵達 `inner div` 之前的過程，稱為 **捕捉階段 (Capturing Phase)** ，在這個階段， click 事件拜訪過的的父層元素只要有含有 click 事件就會被觸發，但由於在 `addEventListener()` 的預設值為 `false` (僅允許再冒泡階段觸發事件)，所以 click 事件在捕捉階段不會觸發父層元素的 Event Handler 。

當 click 事件抵達目標元素 `inner div` 時，稱為 **Target Phase** ，該階段會觸發目標元素的 Event Handler ，然而 click 事件的旅程尚未結束，因為從哪來就從哪回去，因此在抵達 `inner div` 後又會隨著原路回去，這個過程則稱為冒泡階段 (Bubbling phase) ，同樣地， click 事件在回程路上也會觸發父層元素的 Event Handler。

``` html
<body>
    <div class="outer">
        This is outer-div
        <div class="middle">
            This is middle-div
            <div class="inner">
                This is inner-div
            </div>
        </div>
    </div>
</body>
```

![捕捉與冒泡示意圖](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/bubbling.jpg?raw=true)

## 冒泡/捕捉的設定

當父層元素在 `addEventListenr()` 中的第三個參數設定為 `true` 時，表示 click 事件只會在捕捉階段 (Capturing Phase) 觸發回呼函式，若不設定參數，則為預設值 `false` ，表示 click 事件只有在回程路上才會觸發父層元素的回呼函式。

``` js
// 設定第三個參數為 true 時，僅捕捉階段才會觸發 callback function
outer.addEventListener('click', function() {
    console.log('outer')
}
}, true)
middle.addEventListener('click', function() {
    console.log('middle')
}, true)
inner.addEventListener('click', function() {
    console.log('inner')
})
// 點擊<div class="inner">後 console.log 的順序為
// "outer"
// "middle"
// "inner"
```

``` js
// 不設定則預設值為 false ，僅冒泡階段才會觸發 callback function
outer.addEventListener('click', function() {
    console.log('outer')
}
})
middle.addEventListener('click', function() {
    console.log('middle')
})
inner.addEventListener('click', function() {
    console.log('inner')
})
// 點擊<div class="inner">後 console.log 的順序為
// "inner"
// "middle"
// "outer"
```

## 阻止冒泡發生

可以在子元素的回呼函式內引入 event 參數(名稱任取)，並執行 `event.stopPropagation()` 即可阻止冒泡事件的發生

``` js
inner.addEventListener('click', function(e) {
    e.stopPropagation(); 
})
```

## event.target 永遠指向目標元素

需要注意的是，冒泡事件過程中，每個監聽事件內的回呼函式中，它們的 `event.target` 都是指向被點擊的目標元素

``` js
outer.addEventListener('click', function(event) {
    console.log(`This is outer div，my event.target is`, $ {
        event.target
    })
})
middle.addEventListener('click', function(event) {
    console.log(`This is middle div，my event.target is`, $ {
        event.target
    })
})
inner.addEventListener('click', function(event) {
    console.log(`This is inner div，my event.target is`, $ {
        event.target
    })
})
// 點擊<div class="inner">後 console.log 的順序為 
// This is outer div，my e.target is <p>​This is inner-div​</p>​
// This is middle div，my e.target is <p>​This is inner-div​</p>​
// This is inner div，my e.target is <p>​This is inner-div​</p>​
```

## 事件委派 (Event Delegation)

由於冒泡/捕捉的特性，我們可以透過該特性來減少使用 `addEventListener()` 的次數，假如有多個不同元素都有 DOM event 的需求，我們可以將 Event Handler 設定在他們共同的父層元素，並且透過 if statement 來確認事件發生在哪一個元素來實現。

``` html
<body>
    <div class="container">
        <div class="outer">
            This is outer-div
            <div class="middle">
                This is middle-div
                <div class="inner">
                    This is inner-div
                </div>
            </div>
        </div>
    </div>
    <script>
        const container = document.querySelector('.container');
        //將事件處理統一交給共同的父層元素處理
        container.addEventListener('click', function(e) {
            // 透過 if statement 來確認點擊的元素為何
            if (e.target.classList.contains('outer')) { //如果點擊的目標元素的 class 為 "outer" 
                e.target.style.backgroundColor = "green";
                console.log(e.target.className) // "outer"
            } else if (e.target.classList.contains('middle')) { //如果點擊的目標元素的 class 為 "middle" 
                e.target.style.backgroundColor = "blue";
                console.log(e.target.className) //  "middle"
            } else if (e.target.classList.contains('inner')) { //如果點擊的目標元素的 class 為 "outer" 
                e.target.style.backgroundColor = "red";
                console.log(e.target.className) //  "inner"

            }
        })
    </script>
</body>
```

## DOM遍歷(DOM traversing)

``` html
<body>
    <h1>Bubbling/Captruing DEMO</h1>
    <div class="container">
        <div class="outer">
            This is outer-div
            <div class="middle">
                This is middle-div
                <div class="inner">
                    This is inner-div
                </div>
            </div>
        </div>
    </div>
    <div class="footer">Thank you for playing</div>
    <script>
        const container = document.querySelector('.container');
        const inner = document.querySelector('inner');
        // 搜尋子層元素/節點
        console.log(container.querySelector('.outer')); //以 container 為節點往內搜尋
        console.log(container.childNodes); // NodeList(3) [text, div.outer, text]
        console.log(container.children); //    HTMLCollection [div.outer]
        console.log(container.firstElementChild) // <div class="outer">...</div>
        //搜尋父層元素
        console.log(container.parentNode); //<body>...</body>   
        console.log(container.parentElement); //<body>...</body>
        // 選取最靠近的外層元素
        inner.closest('.outer').style.background = 'var(--gradient-secondary)';
        // 選取兄弟元素/節點
        console.log(container.previousElementSibling); //<h1>...</h1>
        console.log(container.nextElementSibling); //<div class="footer">...</div> 
        console.log(container.previousSibliing); //#text
        console.log(container.nextSibliing); //#text
    </script>
</body>
```
