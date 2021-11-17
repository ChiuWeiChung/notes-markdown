# 立即呼叫函式表示式(IIFE) 
> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

在 Scope 筆記當中有談到，函式會產生 scope ，因此在函式外部無法存取函式內部的變數，也因此，在 scope 內部的資料是安全、保有隱私的。


## 數據封裝 (Data Encapsulation)
在編寫程式時，資料的保護是非常重要的事，我們需要盡可能地去避免資料被外人存取、甚至是覆寫。

下方程式碼在瀏覽器運行時，可以透過瀏覽器的 console 上存取 `sayHi` 這個函式，在資料安全上是有疑慮的。

```js
const sayHi = function(){
 console.log("Hi, how are you?");
};
sayHi();
```

透過 IIFE (Immediately Invoked Function Expression) ，在函式宣告的同時用`括號( )包覆住，在後方再加上()`，如此一來就可以立即執行，在瀏覽器的 console 上也無法存取該函式，達到保護變數的目的。

```js
(function(){
    console.log("Hi this is IIFE function call")
    const isPrivate = 23;
})();
```

在 ES6 中，屬於 block scope 的 `const` 、 `let` 出現之後，只要創造出 block scope ，就無法從外部存取以 `const` 、 `let` 宣告的變數，也因此 IFFEs 的使用率漸漸的下降。

```js
{
    const isPrivate = 23;
    var notPrivate = 46;
}
console.log(isPrivate) // isPrivate is not defined
console.log(notePrivate) // 46
```



