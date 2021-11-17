# 閉包(Closure)
> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

學習閉包 (Closure) 之後，要一句話解釋: **讓函式能夠存取被宣告當下所處位置 (scope) 的變數**，也可以想像成讓函式能**飲水思源**，下方的程式碼做舉例，當函數 `scoreCounting` 執行後回傳另一函式至 `getScore` 內部，即使 `getScore` 是在外部 (global environment) 被宣告的，且 `scoreCounting` 已經執行結束的情況下， `getScore` 在執行後仍能存取 `scoreCounting` 作用域內的 `score` 變數，原因在於函式能夠存取變數與否是由它的**出生地**所決定的，而 `getScore` 內部的函式是在 `scoreCounting` 作用域的內部被創造出來，也因此能夠存取 `socre` 變數，這樣的關係稱為 Closure。

```js
const scoreCounting = function(){
    let score=0;
    return function(){
        score++;
        console.log(`score: ${score} `);
    }
};
const getScore = scoreCounting(); // function secureBooking is excuted and returned a function to booker
getScore(); //score: 1
getScore(); //score: 2 
getScore(); //score: 3
console.dir(getScore); //[[Scopes]]: Scopes[3]
//0: Closure (secureBooking) {passengerCount: 3}
```
## Closure Example 1

下方程式碼中，變數 `f` 的函式是在函式 `g` 的作用域內**出生**的，因此執行後可存取變數 `gVariable` ，透過函式 `h` 覆蓋變數 `f` 內的函式，執行函數 `f` 後可存取變數 `hVariable` 。

```js
let f ;
const g = function(){
    const gVariable = 23;
    f = function(){
        console.log(gVariable*2);
    };
};
g(); // assign function into f
f(); //46

const h =function(){
    const hVariable = 777;
    f = function(){
        console.log(hVariable*2);
    };
};

h(); // Re-assigning function into f
f(); //1554
console.dir(f); 
// [[Scopes]]: Scopes[3]
// 0: Closure (h) {hVariable: 777}
```

## Closure Example 2

在下方範例中，雖然 setTimout 內的 callback 函式是在 global environment 下執行，但是在函式 `boardPassengers` 內被創造出來，因此，可以存取變數 `perGroup` 。

同樣地， DOM 也是透過瀏覽器的 APIs 所提供，雖然與 `setTimeout` 都是在外部執行，但由於也是在函式內創造出來，因此可以存取元素  `header` 。

```js
const boardPassengers = function(n, wait){
    const perGroup = n / 3 ;
    setTimeout(function(){
        console.log(`We are now boarding all ${n} passengers`);
        console.log(`There are 3 groups, each with ${perGroup} passengers`);
    },1000)
    console.log(`Will start boarding in ${wait} seconds`)
};
const perGroup = 1000; // closure has priority over scope chain
boardPassengers(180,3)

```

## Closure Example 3
同理，對於 DOM Manipulation 也可以看到閉包的特性，下方程式碼中，對於元素 (body) 的事件監聽器內的回呼函式而言，在其內部仍可以存取 `header` 變數。

```js
(function(){
    const header = document.querySelector("h1");
    header.style.color="red";
    document.querySelector("body").addEventListener("click",function(){
        header.style.color="blue";
    });
})();
```
