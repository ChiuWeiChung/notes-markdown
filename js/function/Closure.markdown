# 閉包(Closure)

#### 學習Closure之後，要一句話解釋它的話，應該是`函式能夠存取當初被創造(宣告)當下所處位置(scope)的變數`，惡搞一點的說法就是讓函式能`飲水思源`，下方的程式碼做舉例，當函數`scoreCounting`執行後回傳另一函式至`getScore`內部，即使`getScore`是在外部(global environment)被宣告的，且`scoreCounting`已經執行結束的情況下，`getScore`在執行後仍能存取`scoreCounting`作用域內的`score`變數，原因在於函式能夠存取變數與否是由它的`出生地`所決定的，而`getScore`內部的函式是在`scoreCounting`作用域的內部被創造出來，也因此能夠存取`socre`變數，這樣的關係稱為Closure。

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

#### 下方程式碼中，變數`f`的函式是在函式`g`的作用域內`出生`的，因此執行後可存取變數`gVariable`，透過函式`h`覆蓋變數`f`內的函式，執行函數`f`後可存取變數`hVariable`。
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
console.dir(f); //[[Scopes]]: Scopes[3]
// 0: Closure (h) {hVariable: 777}
```

## Closure Example 2

#### 在下方範例中，雖然setTimout內的callback函式是在global environment下執行，但是在函式`boardPassengers`內被創造出來，因此，可以存取變數`perGroup`;
#### 同樣地，DOM也是透過瀏覽器的APIs所提供，雖然與`setTimeout`都是在外部執行，但由於也是在函式內創造出來，因此可以存取元素`header`。
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
```js
(function(){
    const header = document.querySelector("h1");
    header.style.color="red";
    document.querySelector("body").addEventListener("click",function(){
        header.style.color="blue";
    });
})();
```


#### Closure. by the time , the callback function is execute. The IIFE is now long gone. the callback function is attach to the body element.It is  waiting for something happen. Even though the environment in which this function here was created is already gone. It is still able to access the  variables that were created inthat varaible by the time the function was born. callback function remember all the variables present at a time of its birth.

#### Closure makes a function remember all the variables that exists at the function birhplace essentially. So we can imagine the secureBooking as the being birhtplace of this function. SO booker function remembers everything at its birthplace by the time it was created. And this can not simply be explained with the scope chain alone. So we need to also understand the closure.

#### Any function always has accessed to the variables environment of the execution context in which the function was created. Now, in the case of booker, this function was created, it was born in the execution context of secureBooking, which was popped off the stack previously remember. So therefore the booker function will get access to this variables environment which contains the passengerCount variable. and this is how the funciton will be able to read and manipulate the passengercount variable. and so it's this connection that we call closure.

#### A function always has access to the variable environment of the execution context in which it was created. even after that execution context is gone. And this last part is really important. the closrue is then basically this varialbe environment attached to the function. exactly as it was at the time and place that the function created. and this probably still sounds confusing. 
