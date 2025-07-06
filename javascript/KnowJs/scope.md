# 範疇 (Scope)與範疇鏈 (Scope Chain)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

在學習 JavaScript 的初期，會時常出現的情況: 「甚麼!，我明明有宣告的變數為什麼無法透過 `console.log()` 印出來呢?」

後面才知道原來 Scope (範疇 or 作用域)的觀念有多重要，深深影響我們**在哪裡可以 & 不可以存取變數**，有了這個觀念就可以大幅減少 console 中出現 Reference error 的悲劇，下面針對幾點專有名詞做紀錄:

1. **Scoping** :  
定義我們宣告的變數在哪個區域我們可以被存取它、哪個區域不能存取它。

2. **語法作用域 (Lexical scoping)** :  
Lexical Scoping的定義為: 變數在某個區域是否可/不可被存取主要是由 **function (函式)** 以及 **block (區塊)** 所宣告的位置所決定;可以存取的變數的區域稱為 Scope of a variable。

3. **範疇 (Scope)** :  
在JavaScript內，有三種 Scope，1. Global Scope, 2. Function Scope, 3. Block Scope，如下方筆記。


## 在JavaScript的三個範疇種類

### 1.Global Scope
簡單定義的話，就是在 function 及 block 以外所宣告的變數。

```js
const cat = "Jumo";
const weight = "15kg";
const age = 3;
```

### 2.Function Scope
在函式內部所宣告的變數，僅能在該函式內部被存取，此規則在函式宣告 (function declaration) 、函式表示式 (function expression) 、函式箭頭式 (arrow function) 都成立。

```js
function myCat(currentYear){
    const birthday = 2012;
    const age = currentYear-birthday;
    return age
}
console.log(birthday); // ReferenceError: birthday is not defined
```


### 3. Block Scope (ES6)

Block Scope 是在 ES2015 中才導入的範疇，定義在大括號 (如 if statement 、 for loop 的大括號) 內部的變數只能在其內部被存取，這邊指的變數包含 `const` 、 `let` (但不包含 `var` ，利用 `var` 宣告的變數屬於 Function Scope )。因為 Block Scope 的出現，在 strict mode 的情況下，函式宣告也會被 Block Scope 限制。

>NOTE: 物件實字 (Object literal) 的大括號不屬於 Block Scope

```js
'use strict'
var age = 20;
if( age >= 18){
    const isAdult = true;  // 只能在if內部被存取
    let canVote = true; // 只能在if內部被存取
    var gotoBar = true; // var屬於Function Scope，可以在Block Scope外部存取
    function getLicense(){ // strict mode情況下，函式宣告(function declaration)也屬於Block Scope
        console.log("you are adult, go to get a drive license!")
    };
};
console.log(isAdult); //ReferenceError  isAdult is not defined
console.log(canVote); //ReferenceError canVote is not defined
console.log(gotoBar); //true
getLicense(); //getLicense is not defined
```
## Scope Chain
Scope Chain 是什麼?我們可以把它想像成一條單行道，倘若 Scope 內找不到目標變數時，Javascript 就會向外部的 Scope 尋找 (單行道，僅向外部尋找)，這就是所謂的 Scope Chain !!，如下面範例中有許多的 Function Scope & Block Scope ，在內部各處都宣告了變數，可以發現在**沒有重複宣告變數的情況下，處於內部的 Scope 都能存取外部 Scope 的變數**，如下圖所呈現。

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
        console.log(isAdult); // var is not Block Scope
        // add(2,3); function are Block Scope at strict mode; otherwise:Function Scope
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

Scope 內部與外部有相同名稱的變數時，如下方例子，在 `first()` 內部使用了 `const` 宣告了 `firstName="Rick"`，而在 if Block Scope 內部又以 `const` 宣告了一次 `firstName="John"`，此時若在 if Block Scope 印出 `firstName` ，得到的結果是 `"John"` 而非 `"Rick"`，原因在於 JavaScript 在循著 Scope Chain 從內往外尋找變數時，在 if Block Scope 內部就已經找到 `firstName` ，因此停止向外尋找直接輸出結果。

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
上面有提到， JavaScript 會依照 Scope Chain 由所處 Scope 位置由內而外尋找變數，而在[執行堆疊筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/javascript/KnowJs/execution-stack-context.markdown)心得中有提到 **Execution Context 堆疊方式是依照呼叫的順序**，這邊就兩者的關係來做探討。

執行後我們以 Execution Context 的堆疊來看，順序為 `first() EC`-> `second() EC` -> `third() EC` ，但可以發現在 `third()` 內部無法存取 `a` 和 `b` 的值，原因在於執行環境是依照呼叫順序 `first`-> `second` -> `third` 來堆疊，但呼叫的順序卻與是否可以存取 Scope 內部的變數無關，就像本篇開頭所提到的 Lexical Scoping ，**變數是否可以被存取與宣告的位置有關**。

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

* JavaScript 存在三種 Scope : 1. Global Scope 2. Function Scope 3. Block Scope。

* `let` 以及 `const` 屬於 Block Scope ， `var` 屬於 Function Scope。

* 變數在哪裡可以被存取主要是由 Function Scope 以及 Block Scope 所宣告的位置做決定。

* 每一個 Scope 都可以存取其外部的 Scope 的變數，即為 Scope Chain 。

* Scope Chain 與函式被呼叫的順序無關，僅與宣告時所存在的位置有關。

### 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)