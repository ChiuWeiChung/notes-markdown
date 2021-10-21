# 了解JavaScript_範疇(Scope)與範疇鏈(Scope Chain)

在學習JavaScript的初期，會時常出現的情況: "甚麼!，我明明有宣告它阿，為何無法透過console.log()印出來呢??"，後面才知道Scope(範疇 or 作用域)的觀念有多重要，深深影響我們在哪裡可以&不可以存取變數，有了這個觀念就可以大幅減少console中出現Reference error的悲劇，下面針對幾點專有名詞做紀錄:

1. Scoping:  
定義我們宣告的變數在哪個區域我們可以被存取它、哪個區域不能存取它。

2. 語法作用域 (Lexical scoping):  
Lexical Scoping的定義為: 變數在某個區域是否可/不可被存取主要是由**1.function(函式)** 以及**2.block(區塊)** 所宣告的位置所決定;可以存取的變數的區域稱為scope of a variable。

3. 範疇 (Scope):  
在JavaScript內，有三種Scope，1. Global Scope 2. Function Scope 3. Block Scope，如下方筆記。


## 在JavaScript的三個範疇種類

### 1.Global Scope
簡單定義的話，就是在function及block以外所宣告的變數。
```js
const cat = "Jumo";
const weight = "15kg";
const age = 3;
```

### 2.Function Scope
在函式內部所宣告的變數，僅能在該函式內部被存取，此規則在函式宣告(function declaration)、函式表示式(function expression)、函式箭頭式(arrow function)都成立。
```js
function myCat(currentYear){
    const birthday = 2012;
    const age = currentYear-birthday;
    return age
}
console.log(birthday); // ReferenceError: birthday is not defined
```


### 3.Block Scope (ES6)

Block Scope是在ES2015中才導入的範疇，定義在大括號(如if statement、for loop的大括號)內部的變數只能在其內部被存取，這邊指的變數包含const、let(但不包含var，利用var宣告的變數屬於function scope)。因為Block Scope的出現，在strict mode的情況下，函式宣告也會被block scope限制。

>NOTE: 物件實字 (Object literal) 的大括號不屬於block scope

```js
'use strict'
var age = 20;
if( age >= 18){
    const isAdult = true;  // 只能在if內部被存取
    let canVote = true; // 只能在if內部被存取
    var gotoBar = true; // var屬於function scope，可以在block scope外部存取
    function getLicense(){ // strict mode情況下，函式宣告(function declaration)也屬於block scope
        console.log("you are adult, go to get a drive license!")
    };
};

console.log(isAdult); //ReferenceError  isAdult is not defined
console.log(canVote); //ReferenceError canVote is not defined
console.log(gotoBar); //true
getLicense(); //getLicense is not defined
```
## Scope Chain
Scope Chain是什麼?我們可以把它想像成一條單行道，倘若scope內找不到目標變數時，Javascript就會向外部的scope尋找(單行道，僅向外部尋找)，這就是所謂的Scope Chain!!，如下面範例中有許多的Function scope&Block scope，在內部各處都宣告了變數，可以發現在**沒有重複宣告變數的情況下，處於內部的scope都能存取外部scope的變數**，如下圖所呈現。

```js
'use strict';
const firstName = "Rick";
function calcAge(birthYear){
    const currentYear = new Date().getFullYear();
    const age = currentYear -birthYear;
    function printAge(){
        let output = `${firstName}, you are ${age}, born in ${birthYear}`;
        console.log(output);
        if(birthYear >=1981 && birthYear <= 1996){
            var isAdult = true;
            const str =`Oh, and you're a adult,${firstName}`;
            console.log(str);
            function add(a,b){
                return a+b
            }
        }
        // console.log(str); //ReferenceError:
        console.log(isAdult); // var is not block scope
        // add(2,3); function are block scope at strict mode; otherwise:function scope
    }
    printAge();
    return age;
}
calcAge(1991);
// console.log(age);  //ReferenceError
// printAge(); //ReferenceError
```

![Scope Chain](https://github.com/ChiuWeiChung/IMGTANK/blob/main/scope/scopechain.png?raw=true)
![variables in scope](https://github.com/ChiuWeiChung/IMGTANK/blob/main/scope/variables%20in%20scope.png?raw=true)

scope內部與外部有相同名稱的變數時，如下方例子，在first()內部使用了const宣告了firstName="Rick"，而在if block scope內部又以const宣告了一次firstName="John"，此時若在if block scope印出firstName，得到的結果是"John"而非"Rick"，原因在於JavaScript在循著Scope Chain從內往外尋找變數時，在if block scope內部就已經找到firstName，因此停止向外尋找直接輸出結果。

```js
const change = true;
function first(){
    const firstName = "Rick";
    if (change){
        const firstName="John";   
        // let firstName="John";  // console.log(firstName) = > John 
        console.log(firstName); // John
    }
    console.log(firstName); //Rick
}
first();
```

## Scope Chain VS. Execution Stack
上面有提到，JavaScript會依照Scope Chain由所處scope位置由內而外尋找變數，而在[了解JavaScript的背後Part2]()心得中有提到**Execution Context堆疊方式是依照呼叫的順序**，這邊就兩者的關係來做探討。

執行後我們以Execution Context的堆疊來看，順序為first() EC->second() EC->third() EC，但可以發現在third()內部無法存取a&b的資料，原因在於雖然執行環境是依照呼叫順序first->second->third堆疊，但呼叫的順序與是否可以存取scope內部的變數無關!，如此篇開頭所提到的Lexical Scoping，**變數是否可以被存取與宣告的位置有關**。

```js
const starter = 1;

function first(){
    const a = 2;
    second();
    function second(){
        const b = 3;
        third();
    }
}
function third(){
    const c =4;
    // console.log(a); // Reference error: a is not defined 
    // console.log(b); // Reference error: b is not defined 
    console.log(a+b+c+starter); // doesn't work because can't access a&b
}
first();
```

## 重點回顧

這邊就針對上面記錄的心得做重點回顧
* JavaScript存在三種Scope: 1.Global Scope 2.Function Scope 3.Block Scope
* let以及const屬於Block Scope; var屬於Function Scope
* 在JavaScript中，變數在哪裡可以被存取主要是由Function Scope以及Block Scope所宣告的位置做決定
* 每一個Scope都可以存取其外部的Scope的變數，即為Scope Chain
* Scope Chain與函式被呼叫的順序無關，僅與宣告時所存在的位置有關

### 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)