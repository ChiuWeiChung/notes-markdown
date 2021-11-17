# JavaScript中的This

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## This keyword

**this** 這個主題在 JavaScript 中大概是最熱門及被討論的主題之一，在使用上有它的實用性，但也是最容易被誤解的 keyword，這篇就針對 JavaScript 的 this 記錄學習筆記。
 this keyword，當物件在呼叫其內部的函式時就會出現 this ，而該函式的 this 會指向它的主人 (owner)，如下方範例，在呼叫物件 `obj` 內的 `test` 函式之後，印出的this是指向 `obj` 物件，也就是擁有 `test` 這個函式的主人。

```js
const obj = {
    firstName:"Rick",
    food:"Steak",
    test:function(){
        console.log(this); //{name: "Rick", food: "Steak", test: ƒ}
        console.log(this.firstName); //Rick
        console.log(this.food); //Steak
    },
};
obj.test();
```

## 在 Regular Function 內， this 會指向呼叫它的物件
只有呼叫物件內函式得當下， this 才有意義，並且會指向呼叫它的物件(也就是 owner )，倘若是一個不存在於物件內的函式，在 strict mode 的情況下會出現 `undefined` ，在非 strict mode 則會指向 window 。

```js
'use strict'
function test(){
    console.log(this); //strict mode底下會出現undefined，在非strict mode時，this會指向window
}
test();
```

當我們把 `物件A` 內的函式傳到另一個 `物件B` (如下方程式碼)， `物件B` 呼叫該函式時， this 會指向呼叫它的物件，也就是 `物件B` 本身; 若將 `物件A` 的函式傳到 `變數v`之中，在 strict mode 呼叫該 `變數v` 會出現錯誤。 

在非 strict mode 的情況下，則會將 this 指向 window ，由於 window 底下尚未存在 `firstName` 以及 `favorite` 的變數，所以會出現 `undefined` 。

```js
'use strict'
const objA = {
    firstName:"Rick",
    favorite:"basketball",
    foo:function(){
        console.log(`${this.firstName} likes to play ${this.favorite}`);
    },
};
const objB = {
    firstName:"John",
    favorite:"baseball",
};
objB.foo = objA.foo;
objB.foo(); // John likes to play baseball
const v  = objA.foo;
v(); //在strict mode出現Cannot read property 'firstName' of undefined , 非strict mode則出現undefined likes to play undefined
```

## 箭頭函式 (Arrow Function) 的 this
this 在箭頭函式的行為與 regular function 不同，箭頭函式沒有自己的 this ，因為它的 this 等同於上層函式或上層範疇的 this ，如下方範例，可以看到在 `test` 函式內部宣告了另一個箭頭函式 `test2`，並在內部印出 this ，結果是指向 `obj` 物件，因為箭頭函式的 this 指向它上層函式 `test` 的this，也就是 `obj` 。

```js
const obj = {
    firstName:"Rick",
    food:"Steak",
    test:function(){
        console.log(this); // {firstName: "Rick", food: "Steak", test: ƒ}
        const test2 = ()=> console.log(this); //{firstName: "Rick", food: "Steak", test: ƒ}
        test2();
    },
};
obj.test();
```

## 一般函式 (Regular Function) VS. 箭頭函式 (Arrow Function)

經過上面的心得介紹可以統整出一般函式的 this 指的是呼叫函式的物件本身，一般函式的 this 則與它的上層函式或上層範疇的 this 一樣，如下方範例， `regularObj` 呼叫內部的一般函式，它的 this 指向 `regularObj` 本身; 倘若是 `arrowObj` 呼叫內部的一般函式，它的 this 指向的是 window 。

```js
const regularObj = {
    firstName:"Rick",
    regular:function(){
        console.log(`Hi ${this.firstName}`);
    };
};
regularObj.regular(); //Rick

const firstName:"Mary"
const arrowObj = {
    firstName:"Rick",
    arrow:()=> console.log(`Hi ${this.firstName}`);  // this keyword point to window, window.firstName = Mary;
};
arrowObj.arrow(); // Mary
```

下方程式碼中， this keyword 無法在 `isAdult` 中顯示，因為 `isAdult` 被宣告在 `calcAge` 內部，其內部的 this 會是 `undefined(strict mode)` ，然而有兩種辦法可以解決這樣的困境。


```js
'use strict'
const obj = {  
    firstName:"Rick",
    year:1992,
    calcAge: function(){
        console.log(this);  // {firstName: "Rick", year: 1992, calcAge: ƒ}
        console.log(2037-this.year); //45
        const isAdult = function(){
            const now = new Date().getFullYear();
            console.log(now-this.year);//NaN (this=undefined, this.year=undefined, number-undefined = NaN )
        };
        isAdult();
    }
};
obj.calcAge();
```
### Solution 1 
在 `isAdult` 外部先將 this 傳至另一個變數 `self` ，再從 `isAdult` 內部呼叫 `self` 即可解決。

```js
const obj = {  
    firstName:"Rick",
    year:1992,
    calcAge: function(){
        console.log(this);  // {firstName: "Rick", year: 1992, calcAge: ƒ}
        console.log(2037-this.year); //45
        const self = this;
        const isAdult = function(){
            const now = new Date().getFullYear();
            console.log(now-this.year);  //NaN (number -undefined = Not a Number )
        };
        isAdult();
    }
};
obj.calcAge();
```

### Solution 2
將 `isAdult` 改為箭頭函式，因為在內部的 this 會指向 `calcAge` 的 this ，也就是 `obj` 本身。

```js
const obj = {  
    firstName:"Rick",
    year:1992,
    calcAge: function(){
        console.log(this);  // {firstName: "Rick", year: 1992, calcAge: ƒ}
        console.log(2037-this.year); //45
        const self = this;
        const isAdult = ()=>{
            const now = new Date().getFullYear();
            console.log(now-this.year);  //NaN (number -undefined = Not a Number )
        };
        isAdult();
    }
};
obj.calcAge();
```
### 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
