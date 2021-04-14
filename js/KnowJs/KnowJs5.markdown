# 了解JavaScript的背後Part5 (this keyword)
## this keyword
#### `this`這個主題在JavaScript中大概是最熱門及被討論的主題之一，在使用上有它的實用性，但也是最容易被誤解的keyword，這篇就針對JavaScript的this記錄學習筆記。
#### this keyword，當物件在呼叫其內部的函式時就會出現this，而該函式的this會指向`它的主人(owner)`，如下方範例，在呼叫物件obj內的`test`函式之後，印出的this是指向obj物件，也就是擁有`test`這個函式的主人。
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
## 在Regular Function內，this會指向呼叫它的物件
#### 只有呼叫物件內函式得當下，this才有意義，並且會指向呼叫它的物件(也就是owner)，倘若是一個不存在於物件內的函式，在strict mode的情況下會出現undefined，在非strict mode則會指向window。
```js
'use strict'
function test(){
    console.log(this); //strict mode底下會出現undefined，在非strict mode時，this會指向window
}
test();
```

#### 當我們把物件A內的函式assign到另一個物件B時，物件B呼叫該函式時，this會指向呼叫它的物件，也就是物件B本身;若將物件A的函式assign到變數v之中，在strict mode呼叫該變數v會出現error，非strict mode則會將this指向window，由於window底下尚未存在firstName以及favorite的變數，故會出現undefined。
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

## 在Arrow Function內的this
#### this keyword在arrow function的行為與regular function不同，arrow function(箭頭函式)`沒有自己的this keyword`，因為`它的this等同於上層函式、範疇(parent function or parent scope)的this`，如下方範例，可以看到在`test`函式內部宣告了另一個箭頭函式`test2`，並在內部印出this，結果是指向obj這個物件，因為arrow function的this指向它上層函式`test`的this，也就是obj。
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

## Regular Function VS. Arrow Function

#### 經過上面的心得介紹可以統整出Regular Function的this指的是呼叫函式的物件本身，Arrow Function的this則與它的上層函式or範疇(parent function or scope)的this一樣，如下方範例，regularObj呼叫內部的regular function，它的this指向regularObj本身;倘若是arrowObj呼叫內部的arrow function，它的this指向的是window。
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
#### 下方程式碼中，this keyword無法在isAdult中顯示，因為isAdult被宣告在calcAge內部，其內部的this會是undefined(strict mode)，然而有兩種辦法可以解決這樣的困境。
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
#### 在isAdult外部先將this assign至另一個變數self，再從isAdult內部呼叫self即可解決。
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
#### 將isAdult改為arrow function，因為在內部的this會指向calcAge的this，也就是obj本身。
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
###### 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
