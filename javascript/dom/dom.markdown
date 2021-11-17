# DOM中操作手法

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## querySelectorAll 以及 getElementsBy... 的差異

進行 DOM 操作時，有許多方法可以選取 HTML 內的元素 ，需要注意的是，透過 `document.querySelectorAll()` 所回傳的資料內容是靜態的，後續對該元素進行 DOM 操作不會改變該變數的內容。

``` html
<body>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
    </ul>
    <script>
        const ul = document.querySelector('ul');
        const li = document.querySelectorAll('li');
        ul.appendChild(document.createElement('li'));
        console.log(ul.childElementCount); //4
        console.log(li); // NodeList(3)[li,li,li] 沒有隨著DOM操作而更動內容
    </script>
</body>
```

但若透過 `document.getElementsBy...()` 回傳的資料是動態的，隨著 DOM 的操作會更新其內容，如下方範例。

``` html
<body>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
    </ul>
    <script>
        const ul = document.querySelector('ul');
        const li = document.getElementsByTagName('li');
        ul.appendChild(document.createElement('li'));
        console.log(ul.childElementCount); //4
        console.log(li); // HTMLCollection(4)[li,li,li,li]
    </script>
</body>
```

## 創造或插入元素

若要透過 DOM 創造新的元素，可以透過 `document.createElement()`，但需要注意的是，若將它傳入一變數時，它會是個獨立的個體，無法同時間存在於不同位置。

``` html
<body>
    <div class="class1">
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
    </div>
    <script>
        const class1 = document.querySelector('.class1');
        const newDiv = document.createElement('div');
        newDiv.textContent = 'hi, this is newDiv element';
        class1.prepend(newDiv); //將newDiv作為class1的第一個子元素
        class1.append(newDiv); //將newDiv作為class1的最後一個子元素
        class1.before(newDiv); //將newDiv作為class1上方的兄弟元素 
        class1.after(newDiv); //將newDiv作為class1下方的兄弟元素
    </script>
</body>
```

## 刪除元素

透過 `remove()` 可去除 HTML 內的元素，在前期版本因為只有 `removeChild()` ，所以需要使用tricky的方法，透過 `parentElement` 選取其父層元素。

``` html
<body>
    <div class="parent-class">
        <div class="child-class1">
            this is child class1
        </div>
        <div class="child-class2">
            this is child class2
        </div>
    </div>
    <script>
        const childClass2 = document.querySelector('.child-class2');
        childClass2.remove();

        // childClass2.parentElement.removeChild(childClass2);  早期方法
    </script>
</body>
```

## 改變/獲取 Style 資訊

透過 `element.style` 來改變元素的 style ，倘若要獲取元素已存在的style資訊，可以透過 `getComputedStyle()` 來得到。

``` html
<body>
    <div class="parent-class" style="background-color:steelblue">
        <div class="child-class1" style="color:orangered">
            this is child class1
        </div>
        <div class="child-class2">
            this is child class2
        </div>
    </div>
    <script>
        const parentClass = document.querySelector(".parent-class");
        console.log(getComputedStyle(parentClass).backgroundColor); //"rgb(70, 130, 180)"
        console.log(getComputedStyle(parentClass).height); //36px
        parentClass.style.height = "40px";
        console.log(getComputedStyle(parentClass).height); //40ox
    </script>
</body>
```

倘若 CSS file 內有設置 CSS Variable ，也可以透過 DOM 改變其內容:  

``` js
// -----------in css file----------
// :root{
//     --color-primary: #5ec576;
// }

document.documentElement.style.setProperty('--color-primary', 'orangered');
```

## HTML 屬性 (Attribute)

要取得元素內的 attribute 的方式有兩種，一種是為 `document.attributeName方` 式得到，另一種可以透過 `document.getAttribute(<attributeName>)` ，兩種方式差異在於，若選取的 attribute 內容為文件位址時，第一種方式得到的是絕對位置，第二種得到的是相對位置。

``` html
<body>
    <img src="img/picture.jpg" alt="my picture" class="picture-1" data-img="1" />
    <script>
        const img = document.querySelector('img');
        console.log(img.src); // file:///C:/Users/username/Desktop/xxxxxxxx/img/picture.jpg
        console.log(img.getAttribute('src')); // img/picture.jpg
    </script>
</body>
```

## HTML 資料屬性 (Data Attribute)

我們可以將一些簡單的資料以 data attribute 形式儲存在 HTML 元素內，並且透過 DOM 操作 ( `element.dataset` ) 來存取。

``` html
<body>
    <img src="img/picture.jpg" alt="my picture" class="picture-1" data-img="1" />
    <img src="img/picture2.jpg" alt="my picture" class="picture-1" data-img="2" />
    <img src="img/picture3.jpg" alt="my picture" class="picture-1" data-img="3" />
    <script>
        const imgs = document.querySelectorAll('img');
        // 也可以透過data-attribute選取特定元素
        // imgs = document.querySelectorAll('img[data-img]') 
        imgs.forEach(el => console.log(el.dataset.img));
        //1
        //2
        //3
    </script>
</body>
```

## Class的用法

透過 `element.classList` 對該元素做新增、刪除、切換 class 等功能。

``` js

element.classList.add('a'); // 新增 class a 至元素
element.classList.remove('c'); //將 a class 自元素內移除
element.classList.toggle('c');  
element.classList.contains('c');

// 需小心使用
element.className = 'rick'; // 將會覆蓋元素既有的 class ，因此該元素只有 rick 這個 class
```

## 事件監聽的種類

`addEventListener` 可以重複使用，而第二種方法 `.onevent` 重複使用會覆蓋前一個 event ，現在大多都使用第一種方式來定義元素的事件處理器。

``` js
const h1 = document.querySelector('h1');

h1.addEventListener('mouseenter', function(e) {
    alert('addEventListener: Great!');
});

h1.onmouseenter = function(e) { // old school way
    alert('addEventListener: Great!');
};
```

若要將 Event Listener 移除的話可以透過 `element.removeEventListener` 來實現。

``` html
<body>
    <div class="parent-class" style="background-color:steelblue">
        <div class="child-class1" style="color:orangered">
            this is child class1
        </div>
    </div>
    <script>
        const child1 = document.querySelector('.child-class1');
        const eventHandler = function(e) {
            console.log('this is click event');
        }
        child1.addEventListener('click', eventHandler);
        setTimeout(() => {              // 5秒後移除child1內的事件處理器
            console.log('child1 event handler is removed!')
            child1.removeEventListener('click', eventHandler);
        }, 5000)
    </script>
</body>
```

第三種方法則是在 HTML 文件中添加，但此方法並不被鼓勵使用，畢竟還是希望 JavaScript 與 HTLM 文件可以分離開來。

``` html
<h1 onClick="alert('h1 is clicked')">
    Hi, This is header 1.
</h1>
```
