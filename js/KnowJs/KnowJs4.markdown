# 了解JavaScript的背後Part4 (Hoisting&Temporal Dead Zone)
## Hoisting (提升)
#### 透過function declaration宣告的函式在宣告前就可以存取它，因為呼叫過程中會被hoist，如下方範例。

```js
hi(); // hihi
function hi(){
    console.log("hihi");
}
```
#### 還有另外一個會被提升的東西，算是在JavaScript Hoisting機制中的副產物，那就是透過var宣告的變數，一般而言，若呼叫未被宣告的變數時，會出現*** is not defined的錯誤，但若在呼叫後才透過var宣告，則會出現undefined，因為執行過程中，var已經被偷偷提升至呼叫的前方，但是它的`值`並沒有一起被提升，等同於`var sayHi`被提升到console.log前面，但是`="hihi"`並沒有跟著上去。
```js
//var sayHi 執行過程被提升至console.log前方 
console.log(sayHi); //undefined  
var sayHi = "hihi";
```
#### 雖然這樣的機制可以在以var宣告變數之前就呼叫它，但應該要盡量避免使用，避免下方的悲劇發生，因為
```js
if(!database) deleteShoppingCart();
var database = 10;
function deleteData(){
    console.log("All data deleted!");
}
```

## Temporal Dead Zone (暫時死區, TDZ)
#### 透過const、let宣告的變數，在所處的scope內部且該變數被宣告之前區域被稱為TDZ，在這區域內無法存取該變數。如下方的範例，在if scope內部，我在job被宣告之前先呼叫它，就會出現錯誤，TDZ的存在是為了避免以及捕捉錯誤的發生，並確保我們在存取之前就已經宣告該變數
```js
const name = "Rick";
const date = new Date().getFullYear();
if (name==="Rick"){
    console.log(`I am a ${job}`);   //  Temporal Dead Zone for `job` variable
    const age = date-1992;          //  Temporal Dead Zone for `job` variable
    const job = "engineer";         
    console.log(x) // x is not defined
}
//Uncaught ReferenceError: Cannot access 'job' before initialization
```

## 變數特性表格

#### 統整前幾篇記錄的心得，可以將var、const、let的宣告方式及函式宣告、函式表示式、箭頭函式、
|                                                  |HOISTED?   |INITIAL VALUE  |SCOPE                   |
|--------------------------------------------------|-----------|---------------     |-------------------|
|函式宣告function declaration                       |YES        |Actual function     |Block@strict mode |
|函式運算式或箭頭函式(function expressions & arrows) |      Depend on var or const/let                   |
|以var宣告的變數                                    |YES        |undefined           |Function           |
|以let 或 const宣告的變數                           |No         |uninitialized, TDZ|Block              |




