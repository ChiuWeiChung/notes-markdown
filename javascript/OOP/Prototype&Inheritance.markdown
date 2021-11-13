# JavaScript中的原型 (Prototype)

> 本文為[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## 物件導向語言(OOP)

物件導向語言(OOP)是基於 **物件(object)** 的一種編寫程式典範(風格)，透過物件，可以用來描述某些抽象或是實體的特徵(某人的出生日、學歷、姓名或是某台車的廠牌、排氣量、馬力)，物件除了可以包含上述資料(properties)以外，還可以包含methods(計算某人的年齡、車子踩油門/剎車後的速度)，而OOP之所以被發展出來，是為了使程式碼更有組織、彈性且容易維護，雖然JavaScript並不是典型的OOP，但在行為及概念上其實有些神似之處。

## 建構子(Constructor)

Class在OOP中屬於很重要的元素，Class就像一張藍圖，透過將Class的實體化 (Instantiation)來創建不同的物件，而對於JavaScript而言，JS是透過Constructor(建構子)來實體化物件。

 以常見的陣列(array)為例子，當我們想要建立一個陣列，會直覺的透過 `const arr=[...]` 來實現，事實上，該陣列是透過它的Array建構子( Array Constructor) 創造出來的，如下方程式碼中顯示，透過 `.__proto__.constructor` 可得知物件的建構子，並發現陣列arr1以及arr2的Constructor都是Array; 

```js
const arr1 = [1, 2, 3];
const arr2 = new Array(2, 4, 6);
console.log(arr1.__proto__.constructor.name); // Array
console.log(arr1.__proto__.constructor === arr2.__proto__.constructor) //true
```

![constructor](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/constructor.jpg?raw=true)

## JS中的原型 (Prototype) 與繼承 (Inheritance)

承接上面提到的arr1以及arr2陣列都可以透過 `push` 在陣列內新增元素，然而， push指令並非來自己本身，透過 `.hasOwnProperty` 即可證明arr陣列本身並沒有名為 `push` 的屬性。

```js
arr.hasOwnProperty('push') // false  意即arr並沒有push這個屬性
arr.push(9); // arr卻仍可以使用push這個指令
```

事實上，arr之所以可以使用push指令，是因為**原型繼承 (Prototypal Inheritance)**的特性，push指令是來自arr的prototype所提供，也可以想像成arr委託它的prototype幫忙執行push指令，因此也可以稱為原型委派(Prototypal Delegation)。

繼承 (Inhheritance) 的好處在於，當我們創建數個陣列時(arr1, arr2, ...)，每一個陣列不需要存放相同的屬性(如push, find, filter...)，只要透過共同的prototype(Array prototype)提供即可，以避免每個物件存放著相同的method，此外，建構子的prototype與被實體化物件的prototype是一樣的，要確認建構子的prototype可以透過指令 **.prototype** ，但要確認實體化物件的prototype則需要透過指令 `.__proto__`。

```js
console.log(arr) // [1,2,3,9] 
console.log(arr.__proto__.hasOwnProperty('push')) // true 來自arr的prototype
//建構子與透過它創造出來的陣列，它們的prototype都是一樣的
console.log(arr.__proto__ === Array.prototype) // true 
```

![with prototype idea](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/prototype.jpg?raw=true)

![without prototype idea](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/badway.jpg?raw=true)

## 原型練(Prototype Chain)以及Lookup機制

此外，上一段有透過指令 `.hasOwnProperty` 來確認物件是否擁有push的property，而該指令並非來自陣列arr本身，也不是來自它的prototype(Array prototype)，而是來自它的prototype的prototype(Object prototype)。

如下方程式碼，物件其實都是由不同的prototype串起來的(物件的原型、原型的原型.、原型的原型的原型...)，稱為Prototype Chain(原型鍊)。因此當我們輸入指令 `arr.hasOwnProperty` 時，JavaScript會遵循Lookup機制，先從arr內尋找是否有 `hasOwnProperty` 的property，若沒有，再往它的prototype(Array prototype)尋找，搜尋未果的話，再往上一層prototype尋找(Object prototype)，找到會執行並停止搜尋，若無結果就會再往上層prototype找直到撞見null。

```js
console.log(arr..hasOwnProperty('hasOwnProperty')) //false
console.log(arr.__proto__.hasOwnProperty('hasOwnProperty')) //false
console.log(arr.__proto__.__proto__.hasOwnProperty('hasOwnProperty')) //true

console.log(arr.__proto__.constructor); // Array (顯示為Array的prototype)
console.log(arr.__proto__.__proto__.constructor); // Object (顯示為Object的prototype)
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
