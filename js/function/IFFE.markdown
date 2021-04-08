# 立即呼叫函式表示式(IIFE) 

#### 在[Scope筆記](/#javascript/knowJs3)當中有談到，函式會產生scope，因此在函式外部無法存取函式內部的變數，也因此，在scope內部的資料是安全、保有隱私的。


## 數據封裝(Data Encapsulation)
#### 在編寫程式時，資料的保護是非常重要的事，我們需要盡可能地去避免資料(如variables)被外人存取、甚至是覆寫。

#### 下方程式碼在瀏覽器運行時，可以透過瀏覽器的console上存取`sayHi`這個函式，在資料安全上是有疑慮的。

```js
const sayHi = function(){
 console.log("Hi, how are you?");
};
sayHi();
```
#### 透過IIFE(Immediately Invoked Function Expression)，在函式宣告的同時用`括號()`包覆住，在後方再加上`()`，如此一來就可以立即執行，在瀏覽器的console上也無法存取該函式，達到保護變數的目的。

```js
(function(){
    console.log("Hi this is IIFE function call")
    const isPrivate = 23;
})();
```

#### 在ES6中，屬於block scope([Scope筆記](/#javascript/knowJs3))的const、let出現之後，只要創造出block scope`{}`，就無法從外部存取以const、let宣告的變數，也因此IFFEs的使用率漸漸的下降。
```js
{
    const isPrivate = 23;
    var notPrivate = 46;
}
console.log(isPrivate) // isPrivate is not defined
console.log(notePrivate) // 46
```




<!-- #### function create scope, right?. one scope doesn't have accessed to variables from an inner scope. for example,global scope can't access to the variables that was defined in the function. so the data in the scope is private.
#### data encapsulation and data privacy are extremely important concepts in programming. We need to protect our variables from being accidentally overwritten by some other parts of program or even with external scripts or libraries.
#### this is the reason why in modern JavaScript, IFFEs are not used anymore because if all we want is to craete a new scope for data privacy. all we need to do is to just create a block like this. there is no need to create a function to create a new scope. Unless of course we want to use var for variables. BUt we know we probably shouldn't do that. ON the other hand, What we really need is to execute a function just once, then the IFFE is still the way to go. Even now with modern JS.  -->
