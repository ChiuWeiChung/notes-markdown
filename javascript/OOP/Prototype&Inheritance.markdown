# 原型 (Prototype)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

## 物件導向語言 (OOP)

物件導向語言 (OOP) 是基於 **物件 (object)** 的一種編寫程式典範 (風格) ，透過物件，可以用來描述某些抽象或是實體的特徵 (某人的出生日、學歷、姓名或是某台車的廠牌、排氣量、馬力) ，物件除了可以包含上述資料 (properties) 以外，還可以包含 methods (計算某人的年齡、車子踩油門/剎車後的速度)，而 OOP 之所以被發展出來，是為了使程式碼更有組織、彈性且容易維護，雖然 JavaScript 並不是典型的 OOP ，但在行為及概念上其實有些神似之處。

## 建構子 (Constructor)

Class 在 OOP 中屬於很重要的元素， Class 就像一張藍圖，透過將 Class 的實體化 (Instantiation) 來創建不同的物件，而對於 JavaScript 而言， JavaScript 是透過 Constructor (建構子) 來實體化物件。

 以常見的陣列 (array) 為例子，當我們想要建立一個陣列，會直覺的透過 `const arr=[...]` 來實現，事實上，該陣列是透過它的 Array 建構子( Array Constructor) 創造出來的，如下方程式碼中顯示，透過 `.__proto__.constructor` 可得知物件的建構子，並發現陣列 arr1 以及 arr2 的 Constructor 都是 Array ; 

```js
const arr1 = [1, 2, 3];
const arr2 = new Array(2, 4, 6);
console.log(arr1.__proto__.constructor.name); // Array
console.log(arr1.__proto__.constructor === arr2.__proto__.constructor) //true
```

![constructor](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/constructor.jpg?raw=true)

## JS中的原型 (Prototype) 與繼承 (Inheritance)

承接上面提到的 `arr1` 以及 `arr2` 陣列都可以透過 `push` 在陣列內新增元素，然而， `push` 指令並非來自己本身，透過 `.hasOwnProperty` 即可證明 `arr` 陣列本身並沒有名為 `push` 的屬性。

```js
arr.hasOwnProperty('push') // false  意即 arr 並沒有 push 這個屬性
arr.push(9); // arr 卻仍可以使用 push 這個指令
```

事實上，`arr`之所以可以使用 `push` 指令，是因為 **原型繼承 (Prototypal Inheritance)** 的特性， `push` 指令是來自 `arr` 的原型所提供，也可以想像成 arr 委託它的原型幫忙執行 push 指令，因此也可以稱為原型委派 (Prototypal Delegation)。

繼承 (Inhheritance) 的好處在於，當我們創建數個陣列時 (`arr1` , `arr2` , ...) ，每一個陣列不需要存放相同的屬性 (如 `push` , `find` , `filter` ...)，只要透過共同的原型 (Array prototype) 提供即可，以避免每個物件存放著相同的 method ，此外，建構子的原型 與被實體化物件的原型是一樣的，要確認建構子的原型可以透過指令 `.prototype` ，但要確認實體化物件的原型則需要透過指令 `.__proto__`。

```js
console.log(arr) // [1,2,3,9] 
console.log(arr.__proto__.hasOwnProperty('push')) // true 來自arr的prototype
//建構子與透過它創造出來的陣列，它們的prototype都是一樣的
console.log(arr.__proto__ === Array.prototype) // true 
```

![with prototype idea](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/prototype.jpg?raw=true)

![without prototype idea](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/badway.jpg?raw=true)

## 原型練 (Prototype Chain) 以及 Lookup 機制

此外，上一段有透過指令 `.hasOwnProperty` 來確認物件是否擁有 `push` 的屬性，而該指令並非來自陣列 `arr` 本身，也不是來自它的原型 (Array prototype)，而是來自它的**原型的原型 (Object prototype)**。

如下方程式碼，物件其實都是由不同的原型串起來的 (物件的原型、原型的原型.、原型的原型的原型...) ，稱為原型鍊 (Prototype Chain) 。因此當我們輸入指令 `arr.hasOwnProperty` 時，JavaScript 會遵循 Lookup 機制，先從 `arr` 內尋找是否有 `hasOwnProperty` 的屬性，若沒有，再往它的原型 (Array prototype) 尋找，搜尋未果的話，再往上一層原型尋找 (Object prototype) ，找到會執行並停止搜尋，若無結果就會再往上層原型找直到撞見 null。

```js
console.log(arr..hasOwnProperty('hasOwnProperty')) //false
console.log(arr.__proto__.hasOwnProperty('hasOwnProperty')) //false
console.log(arr.__proto__.__proto__.hasOwnProperty('hasOwnProperty')) //true

console.log(arr.__proto__.constructor); // Array (顯示為 Array的 prototype )
console.log(arr.__proto__.__proto__.constructor); // Object (顯示為 Object的 prototype )
console.log(arr.__proto__.__proto__.__proto__) // null
```

![prototype chain](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/prototypechain.jpg?raw=true)

### 參考資料

* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
<!-- constructor function與物件、prototype的關係，如下方的圖示所呈現，當我們建立了一個叫做Person的constructor function，透過 `new Person()` 建立了一個名為mike的物件，並且確認建構子Person的prototype( `Person.prototype` )以及mike的prototype( `mike.__proto__` )，可以發現都指向同一個prototype。
![prototype]()
```js
// 物件rick以及建構子Person兩者的prototype是一樣的
console.log(rick.__proto__ === Person.prototype) // true
``` -->
