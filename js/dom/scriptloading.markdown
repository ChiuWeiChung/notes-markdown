# Script Tag及defer & async屬性

#### HTML檔案內的script tag，其存放位置會影響到JavaScript code的執行時機，當開啟一網頁時，HTML文件會從最頂部(head)開始並逐一往底部進行解析(Parse)，當解析完畢時，也就是DOMcontentLoaded事件發生的時機，而關於DOMContentLoaded事件，在[MDN](https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded)中的解釋是 `當document被完整的讀取跟解析後就會被觸發,不會等待 stylesheets, 圖片和subframes完成讀取` ，也就是HTML檔案由上至下完整被解析後才會觸發。

## Script tag 放在head內

#### 如下方範例，若將script tag放置在head tag內部，如此一來，script會先被執行，後續才進行body的Parse，倘若script執行過程中，程式碼含有dom manipulation，就會出現找不到元素的錯誤，原因就在於尚未解析body內的文件時就先執行dom manipulation; 為了避免這樣的失誤，一般而言都會將script放在body的底端，這樣就可以等待body內部的element都被解析完才執行script的內容。

``` html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- <script>
        const p = document.querySelector('.paragraph');
        console.log(p); // null (，因HTML內的body尚未被解析完畢就先執行script內的code，故找不到p元素)
    </script> -->
</head>

<body>
    <div class="container">
        <p class="paragraph">Hi, My name is Rick</p>
    </div>
    <script>
        //將script至於body底端，等HTML Parse都結束後才執行script內容
        const p = document.querySelector('.paragraph');
        console.log(p); // <p class="paragraph">Hi, My name is Rick</p>
    </script>
</body>
```

![beforebody](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/beforebody.jpg?raw=true)

![beforebodyend](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/beforebodyend.jpg?raw=true)

## Script的async以及defer屬性

#### 在現行較新版的瀏覽器，若script存在src的屬性，可以在script內部加入async或是defer的屬性，藉此以優化網頁的讀取速率，此時script tag是存在於head內部(因放置於body底端已無義)，因為async以及defer在本質上仍有差異，因此可以依照script類別的不同來選擇要使用async或是defer。

#### `async` 屬性，顧名思義，遇到script時，HTML Parse 與Script Fetch 會以async方式行進，直到Script Fecth結束時，HTML Parse 才會停下來並進行Script Execution。

``` html
<head>
    <script async src="index.js"></script>
</head>

<body>
    <!-- content -->
</body>
```

![async](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/async.jpg?raw=true)

#### `defer` 屬性，解析過程遇到sciprt時，HTML Parse 與Script Fetch仍會以async方式fetch script的內容，但與 `async` 不一樣的地方在於Script Execute只會在HTML解析完畢時才執行script內的JavaScript code。

``` html
<head>
    <script defer src="index.js"></script>
</head>

<body>
    <!-- content -->
</body>
```

![defer](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/defer.jpg?raw=true)

#### `async` 以及 `defer` 所花費的時間會比單純將script置於body底部較少(因script fetch是以async方式進行)，須特別注意的是:

#### 1. 在 `async` 的情況下，其DOMContentLoaded event在HTML Parse結束時就觸發，倘若script內的code內容龐大，可能造成Script Fecth的時間拉長，出現DOMContentLoaded觸發後Script Fetch還沒結束或Script Execute尚未執行的窘況。 

![ng async](https://github.com/ChiuWeiChung/IMGTANK/blob/main/dom/asyncng.jpg?raw=true)

#### 2. 在 `async` 的情況下，script tag的先後順序並不代表執行順序，倘若先後引入了script1以及script2，由於在該機制下是誰fetch完畢就先execute，因此可能出現script2較script1先執行的狀況，倘若script2需要依賴script1內的code，就會出現錯誤; 因此在需要引入多個且互相依賴的script時，會建議使用 `defer` 。

#### 3. 倘若引入的script是third party scripts(不須與其他script互動)，則可使用 `async` 。

### 參考資料

* [The Complete JavaScript Course 2020: From Zero to Expert!](https://www.udemy.com/course/the-complete-javascript-course/)
* [MDN-DOMContentLoaded](https://developer.mozilla.org/zh-TW/docs/Web/Events/DOMContentLoaded)
* [MDN-Script Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
