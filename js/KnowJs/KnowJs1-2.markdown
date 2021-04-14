# 了解JavaScript的背後Part1-2 (First-class function & Functional Programming)

## First-class functions

#### 在JavaScript當中，他的函數屬於first-class functions，意思是:

* 函式屬於物件
* 函式可存放於變數(variable)、物件(object)、陣列(array) 

``` js
    // 函式可被存放於變數(variables)內
    const square = (a) => a * a
```

* 可以做為`argument`傳入另一個函數當中 (passed as an argument to a function)。

``` js
    // 將函式作為argument傳入
    const sayHi = () => console.log('Hi there')
    button.addEventListener('click', sayHi)
```

* 也可以被另外一個函式`return` (return from a function)。

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

## Javascript 的Functional Programming 

#### Functional programming (FP) 以及 Object-oriented programming (OOP)屬於不同的Programming Paradigm，但是在Javascript中都可以看到OOP以及FP的特性出現，在這裡紀錄Javascript中具有的Functional Programming特性。

## Imperative & Declarative Paradigm

#### 在coding的風格上，可以分為Imperative(命令式)以及Declarative(宣告式)，Imperative風格偏向告知機器"如何去做"(告訴機器每一步要怎麼做)，而Declarative風格偏向告知"要做甚麼"(告訴機器完成的方法)。

``` js
// Imperative
const arr = [1, 3, 5, 7, 9]
const imperativeArr = [];
for (let i = 0; i < arr.length; i++) {
    newArr[i] = arr[i] * 2
}
// Declarative 
const declarativeArr = arr.map(el => el * 2)
```

#### Functional programming屬於Declarative paradigm，基於將許多"pure functions"結合起來，並避免"side effects"以及"mutating data"。

* Pure function: 這裡指的function，只會有輸出(expression)，不能包含Side effects，且不可改變Inputs(state)的資料
* Side effect: 指的是修改(mutate)任何函式外部資料的行為(修改函式外的變數)，或是進行console logging，DOM Manipulation, http request等等
* Immutability: Data不應該被修改(modified or mutated)，也就是所謂的State，State內的資料只能在被複製後才能進行修改並且回傳至原來的state。而在React以及Redux中，State不可被mutated的觀念就被大大的凸顯出來

#### 透過上述的規則中，可以知道在Functional programming過程，需要盡量避免資料變動(data mutation)的行為，並透過不會造成side effects的內建函式來達到想要的結果(如 .map(), .filter(), reduce()...)。



###### 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
* [Functional Programming 一文到底全紀錄]()
* [Functional Programming with React/Redux]()
