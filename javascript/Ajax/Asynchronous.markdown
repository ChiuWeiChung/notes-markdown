# JavaScript中的同步 (Synchronous) 與非同步 (Asynchronous)

> 本文為[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

Asynchronous JavaScript的應用最典型的範例就是在使用JavaScript向Sever端提取資料，由於提取資料是需要花費時間的，若還沒取得資料就執行下一行命令(ex:處理資料的code)，就會出現異常。也因此，我們需要使用Asynchornous JavaScript來解決問題。

## 何謂同步 (Synchronous)? 

同步 (Synchronous) ，如下方程式碼，當我們呼叫**first()** 時，並以Execution Stack & Context來描述他的執行過程(gif圖)，由於[one single thread](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/KnowJs/KnowJs1.markdown)的特性，"**程式碼內的每一行code會逐行執行(line by line)**"，因此先看到'execute 1'，再來'execute 2'，最後是'The end'。這個就是Synchronous JavaScript。

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

  

## 何謂非同步 (Asynchronous)?

### 模擬Asynchronous JavaScript:

了解Synchronous的運行後，下方程式碼利用**setTimeout()** 來模擬向外部API提取資料的情境(2秒之後才拿到data)。下方程式碼的結果顯示，因為透過setTimeout的第二個參數設為2000(即2000毫秒)，當execute1-3都透過console印出來並經過兩秒後才會執行**setTimeout()** 內的回呼函式。

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
  


### 執行過程發生了甚麼事? (Callback Queue &Event Loop)

JavaScript的[Runtime](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/KnowJs/KnowJs2.markdown)來描述，過程如下方GIF顯示，當**console.log("execute 2")** 結束之後隨即堆疊上setTimeout，其"內部的回呼函式會被暫時移置於WEB APIs等待2秒鐘倒數"，因此執行堆疊不需特地暫停兩秒鐘等待呼回函式的執行，內部仍能繼續執行接下來的console.log('The end')。

待兩秒倒數完畢後，回呼函式被置於Callback Queue排隊，此時我們的重要功臣**Event Loop**出現了，**Event Loop**若偵測到執行堆疊內中只剩下Global Execution Context時，會立即把回呼函式拖進執行堆疊內執行;

 因此可理解到，"**SetTimeout()的回呼函式實際上並不在first()的內部執行**"，而是被暫放於Callback Queue，等待其他的執行環境(Execution Context)們都結束後才在背景(Global Execution Context)下執行的。
        
![ASynchronous-like Runtimie](https://github.com/ChiuWeiChung/IMGTANK/blob/main/eventloop/eventloop2.gif?raw=true)

>setTimeout()其實來自Web APIs (獨立於JavaScript engine之外)，舉凡DOM manipulation methos, SetTimeout, HTTP requests for AJAX, geolocation, local storage等等都都是，所以整個Execution Stack在運行時不會受到阻擋。


---

## Asynchronous的回呼地獄 (Callback Hell)
    
觀察到下方程式碼可以發現，若要處理的內容越複雜，就出現需要呼叫多次 **setTimeout()**情況，如此一來就出現多層回呼函式的狀況 (回呼函式內部又有回呼函式)，後續在維護程式碼時就會非常頭痛，因此被稱為回呼地獄 (Callback Hell); 幸虧有ES6導入了[**Promise**](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/Ajax/Async_Part2.markdown)以解決callback hell的狀況，讓程式碼可以容易判讀。

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

---


## ES6__Promise (解決回呼地獄)

上述有談到令程式碼難以維護的回呼地獄 (callback hell)，為了解決此現象，我們可以透過ES6中的 **new Promise()** 使程式碼更有組織。
舉例說明:下方程式碼中透過**Promise( )** 透過建立三種物件(**getIDs**、 **getRecipes**、 **getRelated**)，執行過程中，物件內的呼回函式 (callback function) 若成功執行，會將**resolve( )** 內的參數傳出；若有錯誤，執行 **rejects( )**。

```js
const getIDs =new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve([523,883,432,974]);
        // reject([523,883,432,974]);
    },1500)
});
const getRecipes = (recID)=>{
    return new Promise((resolve,reject)=>{
        setTimeout((ID)=>{
         const recipe = {title: "Fresh tomato pasta", publisher:"Jonas"};
        resolve(`${ID}: ${recipe.title}`);
        },1500,recID)
    })
};
const getRelated = publisher=>{
    return new Promise((resolve,reject)=>{
        setTimeout((pub)=>{
            const recipe = {title:"Italian pizze", publisher:"Jonas"};
            resolve(`${pub}: ${recipe.title}`)
        },1500,publisher)
    })
}

getIDs
.then((IDs)=>{
    console.log(IDs);
    return getRecipes(IDs[2]);
})
.then(recipe=>{
    console.log(recipe);
    return getRelated("Mr.Jonas")
})
.then((recipe)=>{
    console.log(recipe);
})
.catch(error=>{
    console.log(error);
});

// [523, 883, 432, 974]
// 432: Fresh tomato pasta
// Mr.Jonas: Italian pizze
```

可以發現利用**Promise( )** 之後，沒有出現回呼函式內又有回呼函式的情況，取而代之的是使用**then()** 以及 **return**來處理，getIDs完成Promise後將**resolve()** 內的資料傳出並以argument帶入**then()** 處理，其內部的**gerRecipes()** 完成Promise後又將**resolve()** 內的資料傳出以argument帶入下一個**then()** 處理，過程就像大隊接力一樣，一棒接著一棒跑完整個流程;雖然**Promise**讓程式碼更有組織以及容易閱讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是**Async & Await**。


---

  


## Async & Await

雖然Promise讓程式碼變得比較不難解讀，但ES8(ES2017)提供了更簡易、方便的方法，也就是Async Await，這次透過宣告Async函式(在函式前加上**async**)，在內部將Promise的物件前加上**await**。

執行過程中，**await** Promise會在背景下執行，直到**resolve()** 將資料傳回變數(**IDs**、**recipe1**、**recipe2**)之中。


```js
const getIDs =new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve([523,883,432,974]);
        // reject([523,883,432,974]);
    },1500)
});

const getRecipes = (recID)=>{
    return new Promise((resolve,reject)=>{
        setTimeout((ID)=>{
         const recipe = {title: "Fresh tomato pasta", publisher:"Jonas"};
        resolve(`${ID}: ${recipe.title}`);
        },1500,recID)
        
    })
};

const getRelated = publisher=>{
    return new Promise((resolve,reject)=>{
        setTimeout((pub)=>{
            const recipe = {title:"Italian pizza", publisher:"Jonas"};
            resolve(`${pub}: ${recipe.title}`)
        },1500,publisher)
    })
}

// Async Await Function
async function getRecipesAW(){
    const IDs = await getIDs;
    console.log(IDs);
    const recipe1 = await getRecipes(IDs[2]);
    console.log(recipe1);
    const recipe2 = await getRelated("Mr.Rick"); 
    console.log(recipe2);
};

getRecipesAW();
```

> 需要注意的是，Await expression只能運用在Async Function 

  

## Async Await 需注意的地方

這裡展示在運用Async Await時可能會遇到的失誤，當我們想要Async Function執行完畢後回傳一個值，並輸出在console內，如下方程式碼

```js
async function getRecipesAW(){
    const IDs = await getIDs;
    console.log(IDs);
    const recipe1 = await getRecipes(IDs[2]);
    console.log(recipe1);
    const recipe2 = await getRelated("Mr.Rick"); 
    console.log(recipe2);
    return recipe1;  // The value I want to return
};

const rec = getRecipesAW();
console.log(rec);  
// Promise{<pending>}
// [523, 883, 432, 974]
// 432: Fresh tomato pasta
// Mr.Jonas: Italian pizze
```

很顯然，console並沒顯示rec的值，原因主要是最後兩行程式碼(**const rec = getRecipesAW()** 以及 **console.log(rec)**)是以Synchronous形式進行，當**console.log(rec)** 要執行的當下，**getRecipesAW()** 尚未執行完畢 (因此出現pending情況)。

### 解決方案:
可以透過**then()** 來解決，如下方程式碼:

```js
async function getRecipesAW(){
    const IDs = await getIDs;
    console.log(IDs);
    const recipe1 = await getRecipes(IDs[2]);
    console.log(recipe1);
    const recipe2 = await getRelated("Mr.Rick"); 
    console.log(recipe2);
    return recipe1;  // The value I want to return
};

getRecipesAW().then(result=>console.log(`show recipe1 ${result}`));
// Promise{<pending>}
// [523, 883, 432, 974]
// 432: Fresh tomato pasta
// Mr.Jonas: Italian pizze
// show recipe1 432: Fresh tomato pasta
```


