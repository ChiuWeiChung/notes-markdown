# JavaScript簡介 Part2

> 本文為[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## 一級函式 (First-class functions)

在JavaScript的函式屬於一級函式，意思是:

* 函式屬於物件
* 函式可存放於變數 (variable)、物件 (object)、陣列 (array) 

``` js
    // 函式可被存放於變數(variables)內
    const square = (a) => a * a
```

* 可以做為參數傳入另一個函數當中 。

``` js
    // 將函式作為參數傳入傳遞到另一個函式
    const sayHi = () => console.log('Hi there')
    button.addEventListener('click', sayHi)
```

* 也可以被另外一個函式回傳。

``` js
const sayHi = () => {
    console.log('Hi, how are you?');
    return function() {
        console.log('Find, thank you!')
    }
}
const sayThanks = sayHi(); // Hi, how are you?
sayThanks(); // Find, thank you!
```

## Javascript 的函式編程 (Functional Programming ) 特性

函式編程 (FP) 以及物件導向編程 (OOP) 屬於不同的編程範式 (Programming Paradigm) ，但是在Javascript中都可以看到OOP以及FP的特性出現，其中FP又是具有宣告範式 (Declarative Paradigm) 的特性。

### 命令式 (Imperative) & 宣告式 (Declarative) 範式

在編程的風格上，可以分為命令式 (Imperative)以及宣告式 (Declarative)，命令式風格偏向告知機器"如何去做" (告訴機器每一步要怎麼做)，而宣告式風格偏向告知"要做甚麼" (告訴機器完成的方法)。

``` js
// 命令式
const arr = [1, 3, 5, 7, 9]
const imperativeArr = [];
for (let i = 0; i < arr.length; i++) {
    newArr[i] = arr[i] * 2
}
// 宣告式 
const declarativeArr = arr.map(el => el * 2)
```

函式編程 (FP) 具有宣告式 (Declarative) 的風格，基於將許多"pure functions"結合起來，並避免"side effects"以及"mutating data"。

* **Pure function** :  
這裡指的function，只會有輸出 (expression) ，不能包含Side effects，且不可改變Inputs (state) 的資料。

* **Side effect** :  
指的是修改 (mutate) 任何函式外部資料的行為 (修改函式外的變數) ，或是進行console logging，DOM Manipulation, http request等等。

* **Immutability** :  
Data不應該被修改 (modified or mutated) ，也就是所謂的State，State內的資料只能在被複製後才能進行修改並且回傳至原來的state。而在React以及Redux中，State不可被mutated的觀念就被大大的凸顯出來。

透過上述的規則中，可以知道在函式編程過程應盡量避免資料變動 (data mutation) 的行為，並透過不會造成side effects的內建函式來達到想要的結果(如 `.map()`, `.filter()`, `.reduce()`...)。



# 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
* [Functional Programming 一文到底全紀錄]()
* [Functional Programming with React/Redux]()
