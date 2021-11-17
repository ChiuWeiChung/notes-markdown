# Script Tag及defer & async屬性

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

HTML檔案內的 script tag ，其存放位置會影響到 JavaScript 程式碼的執行時機，當開啟一網頁時， HTML 文件會從最頂部 (head) 開始並逐一往底部進行解析 (Parse) ，當解析完畢時，也就是 DOMcontentLoaded 事件發生的時機，而關於 DOMContentLoaded 事件，在 [MDN](https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded) 中的解釋是 "**當 document 被完整的讀取跟解析後就會被觸發,不會等待 stylesheets , 圖片和subframes完成讀取**"，也就是 HTML 檔案由上至下完整被解析後才會觸發。

## Script tag 放在 head 內

如下方範例，若將 script tag 放置在 head tag 內部，如此一來， script 會先被執行，後續才進行 body 的 Parse ，倘若 script 執行過程中，程式碼含有 dom manipulation ，就會出現找不到元素的錯誤，原因就在於尚未解析 body 內的文件時就先執行 dom manipulation ; 為了避免這樣的失誤，一般都會將 script 放在 body 的底端，這樣就可以等待 body 內部的 element 都被解析完才執行 script 的內容。

``` html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- <script>
        const p = document.querySelector('.paragraph');
        console.log(p); // null (，因 HTML 內的 body 尚未被解析完畢就先執行 script 內的 code ，故找不到 p 元素)
    </script> -->
</head>

<body>
    <div class="container">
        <p class="paragraph">Hi, My name is Rick</p>
    </div>
    <script>
        //將 script 至於body底端，等 HTML Parse 都結束後才執行 script 內容
        const p = document.querySelector('.paragraph');
        console.log(p); // <p class="paragraph">Hi, My name is Rick</p>
    </script>
</body>
```

![beforebody](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/beforebody.jpg?raw=true)

![beforebodyend](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/beforebodyend.jpg?raw=true)

## Script 的 async 以及 defer 屬性

在現行較新版的瀏覽器，若script存在src的屬性，可以在script內部加入async或是defer的屬性，藉此以優化網頁的讀取速率，此時script tag是存在於head內部(因放置於body底端已無義)，因為async以及defer在本質上仍有差異，因此可以依照script類別的不同來選擇要使用async或是defer。

### async屬性 :  
顧名思義，遇到 script 時， HTML Parse 與 Script Fetch 會以非同步 (async) 方式行進，直到 Script Fecth 結束時， HTML Parse 才會停下來並進行 Script Execution。

``` html
<head>
    <script async src="index.js"></script>
</head>

<body>
    <!-- content -->
</body>
```

![async](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/async.jpg?raw=true)

### defer 屬性 :  
解析過程遇到 sciprt 時， HTML Parse 與 Script Fetch 仍會以 async 方式 fetch script 的內容，但與 非同步 (async) 不一樣的地方在於 Script Execute 只會在 HTML 解析完畢時才執行 script 內的 JavaScript 程式碼。

``` html
<head>
    <script defer src="index.js"></script>
</head>

<body>
    <!-- content -->
</body>
```

![defer](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/defer.jpg?raw=true)

**async** 以及 **defer** 所花費的時間會比單純將 script 置於 body 底部較少 (因 Script Fetch 是以 非同步 (async) 方式進行)，須特別注意的是:


1. 在 **async** 的情況下，其 DOMContentLoaded event 在 HTML Parse 結束時就觸發，倘若 script 內的程式碼內容龐大，可能造成 Script Fecth 的時間拉長，出現 DOMContentLoaded 觸發後 Script Fetch 還沒結束或 Script Execute 尚未執行的窘況。 

![ng async](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/asyncng.jpg?raw=true)

2. 在 **async** 的情況下，script tag 的先後順序並不代表執行順序，倘若先後引入了 script1 以及 script2 ，由於在該機制下是誰 fetch 完畢就先執行，因此可能出現 script2 較 script1 先執行的狀況，倘若 script2 需要依賴 script1 內的程式碼，就會出現錯誤; 因此在需要引入多個且互相依賴的 script 時，會建議使用 **defer** 。

3. 倘若引入的 script 是 third party scripts (不須與其他 script 互動)，則可使用 **async** 。

### 參考資料

* [The Complete JavaScript Course 2020: From Zero to Expert!](https://www.udemy.com/course/the-complete-javascript-course/)
* [MDN-DOMContentLoaded](https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded)
* [MDN-Script Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
