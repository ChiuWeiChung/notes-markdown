# JavaScript中的Asynchronous (PART 1)

## 甚麼是Synchronous? 甚麼是Asynchronous?
Asynchronous JavaScript的應用最典型的範例就是在使用JavaScript向Sever端提取資料，由於提取資料是需要花費時間的，若還沒取得資料就執行下一行命令(ex:處理資料的code)，就會出現異常。也因此，我們需要使用Asynchornous JavaScript來解決問題，然而甚麼是Asynchronous(非同步) ? 先從他的對立面，Synchronous(同步)談起，當我們呼叫下方程式碼的**first()**時，並以Execution Stack & Context來描述他的執行過程(gif圖)，由於[one single thread](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/KnowJs/KnowJs1.markdown)的特性，程式碼內的每一行code會逐行執行(line by line)，因此先看到'execute 1'，再來'execute 2'，最後是'The end'。這個就是Synchronous JavaScript。
```js
const first = function (){
        console.log("execute 1");
        second();
        console.log("The end")
};
const second = ()=>{
        console.log("execute 2");
};
first();  
// execute1
// execute2
// The end
```
![Synchronous Runtimie](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/synchornous.gif?raw=true)

---

<br>

## 模擬Asynchronous JavaScript
了解Synchronous的運行後，下方程式碼利用**setTimeout()** 來模擬向外部API提取資料的情境(兩秒之後才拿到data)。下方程式碼的結果顯示，因為透過setTimeout的second argument 設定為2000(即2000毫秒)，當execute1-3都已透過console印出來後並經過兩秒後才顯示**setTimeout()** 的callback所回傳的訊息。

```js
const one = function (){
    console.log('execute  1');
    function two(){
        console.log('execute  2');
        setTimeout(()=>console.log("this is timer callback"),2000)
        function three(){
            console.log('execute  3');
        }
        three();
    };
    two();
}
one();
// execute1
// execute2
// execute3
// this is time callback

```

## 執行過程發生了甚麼事? (Callback Queue &Event Loop)

JavaScript的[Runtime](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/KnowJs/KnowJs2.markdown)來描述，過程如下方GIF顯示，當**console.log("execute 2")** 結束之後隨即堆疊上setTimeout，其"內部的回呼函式會被暫時移置於WEB APIs等待2秒鐘倒數"，因此執行堆疊不需特地暫停兩秒鐘等待呼回函式的執行，內部仍能繼續執行接下來的console.log('The end')。

待兩秒倒數完畢後，回呼函式被置於Callback Queue排隊，此時我們的重要功臣**Event Loop**出現了，**Event Loop**若偵測到執行堆疊內中只剩下Global Execution Context時，會立即把回呼函式拖進執行堆疊內執行;

 因此可理解到，"**SetTimeout()的回呼函式實際上並不在first()的內部執行**"，而是被暫放於Callback Queue，等待其他的執行環境(Execution Context)們都結束後才在背景(Global Execution Context)下執行的。
        
![ASynchronous-like Runtimie](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop2.gif?raw=true)

>setTimeout()其實來自Web APIs (獨立於JavaScript engine之外)，舉凡DOM manipulation methos, SetTimeout, HTTP requests for AJAX, geolocation, local storage等等都都是，所以整個Execution Stack在運行時不會受到阻擋。

---

<br>


## Asynchronous的Callback Hell
    
觀察到下方程式碼可以發現，若要處理的內容越複雜，就出現需要呼叫多次 **setTimeout()**情況，如此一來就出現多層callback function的狀況(callback之中又有callback)，後續在維護程式碼時就會非常頭痛，因此被稱為callback hell; 幸虧有ES6導入了[**Promise**](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/Ajax/Async_Part2.markdown)以解決callback hell的狀況，讓程式碼不那麼難堪。

```js
const getRecipe= function (){

    setTimeout(()=>{    //first layer of callback
        const recipeID = [123,456,789];  
        console.log(recipeID);
        
        setTimeout((id)=>{  //second layer of callback
            const recipe = {title:"Fresh tomato pasta", publisher:"Jonas"};
            console.log(`${id}: ${recipe.title}`);
            
            setTimeout((id)=>{ //third layer of callback
                const recipe2 = {titile:"Italian pizza", publisher:"John"};
                console.log(`${id}: ${recipe2.titile}`);
            },1000,recipeID[1])
        },1500,recipeID[2])
    },1500)
}

getRecipe();
//  (3) [123, 456, 789]
//  789: Fresh tomato pasta
//  456: Italian pizza
```




</br>

# 以上心得來自
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)



