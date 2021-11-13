# 執行堆疊 (Execution Stack)與執行環境 (Execution Context)

> 本文為[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## JavaScript Runtime
JavaScript的程式碼若要被執行，需先透過[直譯（interpret）](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs1.markdown)將程式碼轉成"機器可以理解的語言"，也就是機器碼 (machine code, 0&1)。

程式碼逐句直譯為機器碼 (machine code)後，需要在JavaScript引擎所提供的執行堆疊 (Execution Stack, ES)內執行，也就是說，沒有引擎就無法執行機器碼。

>不同的瀏覽器擁有不同JS引擎，Google Chrome瀏覽器的V8引擎是較著名的JS引擎之一。


## JavaScript引擎內的執行堆疊(Execution Stack) & 堆內存 (Heap)

在引擎內部在運行過程中，每個任務 (job) 都有自己的執行環境(Execution Context, EC)，JavaScript引擎會提供執行堆疊 ((Execution Stack, ES) 讓執行的"任務們"**依序將EC堆疊在ES上頭**，其中執行環境由三種元素組成:

1. 變數: 舉凡var、let、const、functions、arguments

2. Scope Chain:[Scope筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs3.markdown)

3. this keyword:[This筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs5.markdown)

>EC只有在任務被呼叫時才會堆疊在ES之上

  

如下方程式碼範例，在任務執行前 (first( )被呼叫前)，global、first、second EC各自儲存著不同的資料，Global EC儲存的是background的資訊 (myName="Rick"及first以及second 的source code)，first EC儲存了function scope內部 (花括號內部)的資訊，包含a=1,b=unknown,c=NaN，此時unknown& NaN原因是任務尚未被呼叫，因此僅能知道執行前的資訊，而second EC儲存了argument=[2,3]& d=4的資訊。

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
如下方範例，在global environment (window) 內，first( )是第一個被呼叫的，其EC會第一個疊在Stack上，後續的任務們則依照執行順序將各自的EC堆疊上去，任務執行完畢後會被移出Stack。

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

> EC的堆疊以及移出遵循著LIFO原則 (Last In, First Out)。

  

## JavaScript Runtime =JavaScript 引擎 + WEB APIs + Callback Queue.

然而僅有1. JavaScript 引擎是不夠的，還需要2. WEB APIs以及3. Callback Queue才可以建構完整的Runtime，原因是在進行DOM、 Timer function (如setTimeout)、 Fetch API method的時候，需要WEB APIs來提供並搭配Callback Queue。

1. JavaScript 引擎:  
為JavaScript提供執行堆疊 (ES)以及堆內存 (Heap)，其中ES用來執行環境的堆疊及儲存簡單數據 (基本型別的資料)，堆內存 (Heap)則負責儲存複雜數據如物件 (物件型別的資料); [Execution Stack&Heap筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/KnowJs6.markdown)

2. WEB APIs:  
JavaScript可以透過瀏覽器的global window object與WEB APIs，使用DOM、call timer function等功能。

3. Callback Queue:  
用來存放準備執行的回呼函式 (callback function)。

>DOM、timer function (setTimeout)、navigator.geolocation method等方法是獨立於JavaScript之外，主要是由瀏覽器的WEB APIs所提供。


### 執行流程:
在下方，我參照了[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)課程製作了一張gif來描述這個流程，我們知道JavaScript處理程式碼時是以one single thread方式，一行程式碼處理完再接著下一行; 例如:觸發了一個onClick的event(來自WEB APIs提供的DOM event listener)，此時onClick的回呼函式會先被置放於Callback Queue當中排隊，此時透過Event loop(事件環)的機制以偵測執行堆疊(ES)內部的任務(Execution 1-3)都被執行完畢後，回呼函式才會被移至Stack中執行。


![eventloop](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop.gif?raw=true)




