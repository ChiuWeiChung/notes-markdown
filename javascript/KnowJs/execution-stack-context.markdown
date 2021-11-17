# 執行堆疊 (Execution Stack) 與執行環境 (Execution Context)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## JavaScript Runtime
JavaScript 的程式碼若要被執行，需先透過[直譯（interpret）](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs1.markdown)將程式碼轉成"機器可以理解的語言"，也就是機器碼 (由 0 與 1 組成)。 程式碼逐句被直譯為機器碼 (machine code)後，需要在 JavaScript 引擎所提供的執行堆疊 (Execution Stack, ES) 內執行，也就是說，沒有引擎就無法執行機器碼。

>不同的瀏覽器擁有不同JS引擎，Google Chrome瀏覽器的V8引擎是較著名的JS引擎之一。


## JavaScript 引擎內的執行堆疊 (Execution Stack) & 堆內存 (Heap)

在引擎內部執行過程中，每個任務 (job) 都有自己的執行環境 (Execution Context, EC )， JavaScript 引擎會提供執行堆疊 (Execution Stack, ES ) 讓執行的"任務們依序將 EC 堆疊在 ES 上頭"，其中執行環境由三種元素組成:

1. **變數** : 例如 var 、 let 、 const 、 functions 、 arguments ...

2. **範疇鏈 (Scope Chain)** :[Scope筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/scope.markdown)

3. **This**: [This筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/this-in-javascript.markdown)

>EC 只有在任務被呼叫時才會堆疊在 ES 之上

  

如下方程式碼範例，在任務執行前 ( `first()` 被呼叫前)， **Global** 、 **first** 、 **second** 的執行環境 (EC) 各自儲存著不同的資料。

 1. **Global** 的執行環境儲存的是背景資訊 ( `myName="Rick"` 及 `first` 以及 `second` 的程式碼)。
 
 2. **first** 的執行環境儲存了 scope (括號內部)的資訊，包含 `a=1` , `b=unknown` , `c=NaN`，其中 unknown & NaN 原因是任務尚未被呼叫，因此僅能知道執行前的資訊。

  3. **second** 的執行環境儲存了 `argument=[2,3]` 以及 `d=4` 的資訊。

```js               
const myName = "Rick";                        
const first = function (){  
    var a = 1                
    b = second(2,3);        
    const c = a+b
    return c ;
};  

const second = (x,y)=>{
    let d = 4
    return d
};
first();  
```
 

![execution context](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/execution%20context.png?raw=true)

  

## 執行環境 (EC) 怎麼堆疊?
如下方範例，在 global environment (window) 內， `first()` 是第一個被呼叫的，其 EC 會第一個疊在 Stack 上，後續的任務們則依照執行順序將各自的 EC 堆疊上去，任務執行完畢後會被移出 Stack 。

```js
const first = function (){
    console.log("execute 1");
    b = second();
    console.log("The end");
};
const second = ()=>{
    console.log("execute 2");
};

first();  
// execute1
// execute2
// The end
```

![Execution Stack](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/simpleCallstack.gif?raw=true)

> EC 的堆疊以及移出遵循著 LIFO 原則 (Last In, First Out)。

  

## JavaScript Runtime = JavaScript 引擎 + WEB APIs + Callback Queue.

然而僅有 1. JavaScript 引擎是不夠的，還需要 2. WEB APIs 以及 3. Callback Queue 才可以建構完整的 Runtime ，原因是在進行 DOM 、 Timer function (如setTimeout)、 Fetch API method 的時候，需要 WEB APIs 來提供並搭配 Callback Queue。

1. **JavaScript 引擎** :  
為JavaScript提供執行堆疊 (ES) 以及堆內存 (Heap)，其中 ES 用來執行環境的堆疊及儲存簡單數據 (基本型別的資料)，堆內存 (Heap) 則負責儲存複雜數據如物件 (物件型別的資料) ; [Execution Stack&Heap筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs6.markdown)

2. **WEB APIs** :  
JavaScript 可以透過瀏覽器的 global window object 與 WEB APIs ，使用 DOM 、 call timer function 等功能。

3. **Callback Queue** :  
用來存放準備執行的回呼函式 (callback function)。

>DOM、timer function (setTimeout)、navigator.geolocation method等方法是獨立於JavaScript之外，主要是由瀏覽器的WEB APIs所提供。


### 執行流程:
在下方，我參照了 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 課程製作了一張 gif 來描述這個流程，我們知道 JavaScript 處理程式碼時是以 one single thread 方式，一行程式碼處理完再接著下一行; 例如:觸發了一個 onClick 的事件 (來自 WEB APIs 提供的 DOM event listener ) ，此時 onClick 的回呼函式會先被置放於 Callback Queue 當中排隊，此時透過事件環 (Event loop) 的機制以偵測執行堆疊 (ES) 內部的任務 (Execution 1-3) 都被執行完畢後，回呼函式才會被移至 Stack 中執行。

![eventloop](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop.gif?raw=true)




