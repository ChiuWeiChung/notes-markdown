# 提升 (Hoisting) 以及暫時死區 (Temporal Dead Zone, TDZ)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

## 提升 (Hoisting)

 透過函數宣告 (function declaration) 定義的函式在宣告前就可以存取它，因為呼叫過程中會被 hoist ，如下方範例。

```js
hi(); // hihi
function hi() {
    console.log("hihi");
}
```

### var 宣告的變數也會被提升

 透過 `var` 宣告的變數也會被提升，算是在 JavaScript 提升機制中的副產物，一般而言，呼叫未被宣告的變數時，會出現 `*** is not defined` 的錯誤，但若呼叫後再透過 `var` 宣告 (如下方程式碼)，則會出現 undefined，因為執行過程中， `var` 已經被偷偷被提升至前方，但是它的值並沒有一起被提升，等同於 `var sayHi` 被提升到 `console.log` 前面，但是 `="hihi"` 並沒有跟著上去。

```js
//var sayHi 執行過程被提升至console.log前方 
console.log(sayHi); //undefined  
var sayHi = "hihi";
```

 雖然這樣的機制可以在以 `var` 宣告變數之前就呼叫它，但應該要盡量避免使用，避免下方的悲劇發生。

```js
if (!database) deleteShoppingCart();
// database在if statement後才透過var宣告，在此之前database被提升，其值仍為undefined。
var database = 10;

function deleteData() {
    console.log("All data deleted!");
}
```

## 暫時死區 ( Temporal Dead Zone, TDZ)

 如果我們在透過 `const`/`let` 宣告變數之前呼叫變數，會出現錯誤，因為在呼叫的位置處於暫時死區。如下方的範例，在 if Scope 內部，我在 `job` 被宣告之前先呼叫它，此時出現報錯，TDZ 的存在除了避免捕捉錯誤的發生，也是確保我們在存取之前就已經宣告該變數。

```js
const name = "Rick";
if (name === "Rick") {
    console.log(`I am a ${job}`); //  Temporal Dead Zone for `job` variable
    const job = "engineer";
}
//Uncaught ReferenceError: Cannot access 'job' before initialization
```

## 變數特性表格

 統整前幾篇記錄的心得，可以將 `var` 、 `const` 、 `let` 的宣告方式及函式宣告、函式表示式、箭頭函式。
 
|                                                  |會不會被提升?|     INITIAL VALUE  |Scope              |
|--------------------------------------------------|------------|---------------     |-------------------|
|函式宣告 (function declaration)                    |YES        |Actual function     |Block@strict mode  |
|函式運算式或箭頭函式 (function expressions & arrows) |            取決於是透過 var 或是 let/const 宣告           |
|以 var 宣告的變數                                    |YES         |undefined           |Function           |
|以 let 或 const 宣告的變數                           |No          |uninitialized, TDZ  |Block              |

### 參考資料

* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
