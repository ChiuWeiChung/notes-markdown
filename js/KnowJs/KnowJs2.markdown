# 了解JavaScript_執行堆疊與執行環境


## JavaScript Runtime
JavaScript的source code需要被Interpreted成機器可以理解的語言，因此這篇文章就來記錄Code被Interpreted之後的machine code(0&1)是如何被執行的;
被Interpreted過的machine code無法直接執行，需要在1.JavaScript 引擎所提供的Execution Stack(執行堆疊, ES)內部執行，也就是說，沒有引擎就無法執行machine code。不同的瀏覽器都有它自身的JS Engine，其中最著名的莫過於Google Chrome瀏覽器的V8 Engine。


## 執行堆疊(Execution Stack) & 堆內存 (Heap) in JavaScript Engine
程式碼在運行過程中，每個任務都有自己的執行環境(Execution Context, EC )，JavaScript 引擎會提供ES讓執行的"任務們"**依序將EC堆疊在ES上頭**，其中EC負責由三種元素組成:
1. 變數:  
舉凡var、let、const、functions、arguments
2. Scope Chain:[Scope筆記]()
3. this keyword:[This筆記]()

>EC只有在任務被呼叫時才會堆疊在ES之上

如下方程式碼範例，在任務執行前(first()被呼叫前)，global、first、second EC各自儲存著不同的資料，Global EC儲存的是background的資訊(myName="Rick"及first以及second 的source code)，first EC儲存了function scope內部(花括號內部)的資訊，包含a=1,b=unknown,c=NaN，此時unknown& NaN原因是任務尚未被呼叫，因此僅能知道執行前的資訊，而second EC儲存了argument=[2,3]& d=4的資訊。

```js               
const myName = "Rick";                        
const first = function (){  
    var a = 1                
    b = second(2,3);        
    const c = a+b
    return c ;
};  /// ---------------------------function first's scope
const second = (x,y)=>{
    let d = 4
    return d
};
first();  
```
 

![execution context](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/execution%20context.png?raw=true)

<br>

## 執行過程中Execution Context怎麼堆疊
如下方程式碼的範例以及gif展示，在global environment中(即window)中，first()是第一個被呼叫的，因此會先第一個堆疊在Stack之上，後續執行任務也會按照one single thread的方式(一行接著一行)堆疊在Stack之上，任務執行完畢後會被移出Stack。

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


## JavaScript Runtime =JavaScript 引擎 + WEB APIs + Callback Queue.

然而僅有1. JavaScript 引擎是不夠的，還需要2. WEB APIs以及3. Callback Queue才可以建構完整的Runtime，原因是在進行DOM或是Timer function(如setTimeout())、Fetch API method的時候，需要WEB APIs來提供並搭配Callback Queue，因此在下一段就來介紹這兩個元素的重要性。
1. JavaScript 引擎:  
為JavaScript提供執行堆疊(ES)以及堆內存(Heap)，其中ES用來執行環境的堆疊及儲存簡單數據 (基本型別的資料)，堆內存(Heap)則負責儲存複雜數據如物件 (物件型別的資料); [Execution Stack&Heap筆記](/#javascript/knowJs6)
2. WEB APIs:  
JavaScript可以透過瀏覽器的global window object與WEB APIs，使用DOM、call timer function等功能
3. Callback Queue:  
用來存放準備執行的回呼函式 (callback function)

>DOM、timer function(setTimeout())、navigator.geolocation method等方法是獨立於JavaScript之外，主要是由瀏覽器的WEB APIs所提供。

## JavaScript的執行流程
在下方，我參照了[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)課程製作了一張gif來描述這個流程，我們知道JavaScript處理程式碼時是以one single thread方式，一行程式碼處理完再接著下一行; 例如:觸發了一個onClick的event(來自WEB APIs提供的DOM event listener)，此時onClick的回呼函式會先被置放於Callback Queue當中排隊，此時透過Event loop(事件環)的機制以偵測執行堆疊(ES)內部的任務(Execution 1-3)都被執行完畢後，回呼函式才會被移至Stack中執行。


![eventloop](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop.gif?raw=true)




