# 函式建構式 (Function Constructor) 以及類別 (Class)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

在 [JavaScript的Prototype觀念](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/OOP/Prototype&Inheritance.markdown) 中有談到 Prototype 的觀念以及物件是如何調用 methods ，而在這裡會記錄 JavaScript 中的如何建立建構子 (Constructor) ，並且透過建構子來將物件實體化，並連結它的 prototype。

## 如何建立 Prototype 並連結物件?

在JS中，有3種方法可以做到: 
1. 函式建構式 (function constructor)
2. ES6 的 Class 
3. `Object.create()`

## 1. 函式建構式 (function constructor)

函式建構式類似函式敘述式 (function expression) ，為了辨別是一般函式還是建構子，在命名時會將第一個字母作為大寫。

如下方程式碼，創建了一個 `Person` 建構子，並且透過 `this` 來定義物件內的屬性，必須注意的是，函式建構式不能使用箭頭函式 (arrow function) ，**因為它的 `this` 並不是指向物件本身**。

``` js
const Person = function(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
};
const rick = new Person('Rick', 1992); // 透過 new operator 創立新的物件
console.log(rick); // Person {firstName: "Rick", birthYear: 1992}
// 將 methods 建立在函式建構式的 prototype
```

## 物件、建構子、 原型 (Prototype) 的關係

當我們在定義 methods 時，並不會在 Person 內建立，如上一篇提到，倘若創立 10 個由 Person 衍伸出的物件， 10 個物件內都會含有相同的 methods ，使的程式碼的重複性過高，為避免這種情況，會傾向將 methods 建立在它的原型。

此外， `Person 的原型`以及` rick 的原型`都會指向同一個物件，也因此只要透過 `Person.prototype.methodName=function(){...}` 來定義需要使用的函式，物件在執行函式時，會透過 Lookup 機制沿著原型鍊 (Prototype Chain) 尋找函式名稱。

``` js
// 物件的原型以及 constructor 的原型是同一個
console.log(rick.__proto__ === Person.prototype) // true
// 透過在 constructor 的原型定義函式
Person.prototype.calcAge = function() {
    console.log(2030 - this.birthYear)
};
// calcAge 函式出現在物件 rick 的 原型 
console.log(rick.__proto__) // {calcAge: ƒ, constructor: ƒ}

// 執行過程中， JavaScript 透過 Lookup 機制，沿著原型鍊尋找 calcAge 的屬性
rick.calcAge() // 38
const ann = new Person('Ann', 1993);
// rick 以及 ann 的原型都指向同一個
rick.__proto__ === ann.__proto__ //true
```
![relationship](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/relationship.jpg?raw=true)

## 函式建構式之間的繼承

透過建構子之間的繼承，可以將實體化的物件被分類的更詳細，比如已經存在的 `Person` 建構子具有 `firstName` 以及 `birthYear` 的屬性，倘若想在物件內增加新的屬性 (如 country ) ，又想維持 `Person` 的內容的情況下，雖然可以透過 `rick.country=...` 實現，但是若新增其他的物件 (如 mike , stella ) 時，這樣的動作仍需重複一次 (`mike.country=...` , `stella.country=...`) ，為了避免程式碼的重複，可以透過建構子的繼承來實現。

### 範例: 

創建一個新的建構子 ( `Taiwanese` ) ，透過 `Object.create()` 將 `Peron` 的 prototype 傳入 `Taiwanese` 的 prototype 內。

``` js
const Taiwanese = function(firstName, birthYear, country) {
    //透過.call ==>效果同this.firstName=firstName,this.birthYear=...
    Person.call(this, firstName, birthYear);
    this.country = country;
};

//  透過 Object.create 繼承 Person.prototype
Taiwanese.prototype = Object.create(Person.prototype);

//  在定義 Taiwanese prototype 內的函式時，需在 Object.create() 之後
//  避免 prototype 內容被 Person.prototype 覆蓋
Taiwanese.prototype.sayHi = function() {
    console.log(`Hi! My name is ${this.firstName} and I am a Taiwanese!`)
}

const andy = new Taiwanese('Andy', 1992, 'Taiwanese');
andy.calcAge(); //38
```

## 繼承後的Prototype Chain

``` js
console.log(andy.__proto.constructor.name); //Person 
// 上方照理來說，應是 Taiwanese ，但因為透過 Object.create 將 Person prototype 傳入，所以被 Taiwanese 被 Person 覆蓋
console.log(andy.__proto.__proto__.constructor.name); // Person
console.log(andy.__proto.__proto__.__proto__.constructor.name); // Object
console.log(andy.__proto.__proto__.__proto__.__proto__); // null
```

## 2. ES6 的 Class

ES6 的 Class 其實是**函式建構式的另一中表現方式**，因為 Class 可以讓程式碼更有更有組織、容易判讀，所以又被稱為**函式建構式的語法糖 (syntactic sugar)** ，可以將 data 以及 methods 都寫在一起即可，因此最常被拿來使用。 需要注意的是， Class 不會被提升 (hoist) ，所以在使用前必須先行宣告。

``` js
class Person {
    // 將資料置於 constructor(){} 內部
    constructor(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }
    // 下方定義的函式，事實上是被存放在 Person.prototype 內部
    calcAge() {
        console.log(2030 - this.firstName)
    }
}
const stella = new Person("Stella", 1990);
console.log(stella); //Person {firstName: "Stella", birthYear: 1990}
```

## Class中的static

倘若不想要物件繼承原型內的 methods ，可以在函式宣告前面加上 `static`

``` js
class Person {
    constructor(firstName , birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }
    calcAge() {
        console.log(2030 - this.firstName)
    }
    // static擺在函式宣告前面
    static whoAmI() {
        console.log(this.prototype.constructor.name)
    }
}
Person.whoAmI(); // Person
const stella = new Person("Stella", 1990);
stella.__proto__.hasOwnProperty('calcAge') // true
stella.__proto__.hasOwnProperty('whoAmI') // false
```

## Class之間的繼承

Class 之間的繼承，可以透過 `extedns < Class-name >` 來實現，

``` js
class Taiwanese extends Person {
    constructor(firstName, birthYear, country) {
        // super 類似 constructor 之間繼承時，使用 Person.call() 的概念
        // super 必須定義在前
        super(firstName, birthYear)
        this.country = country;
    }
    sayHi() {
        console.log(`Hi! My name is ${this.firstName} and I am ${this.country}`)
    }
};

const rick = new Taiwanese('Rick', 1992, 'Taiwanese');
//原型鍊 (Prototype Chain)
console.log(rick.__proto__.constructor.name); // Taiwanese
console.log(rick.__proto__.__proto__.constructor.name); // Person
console.log(rick.__proto__.__proto__.__proto.constructor.name); //Object
```

## 3. Object.create()

物件實字 (Object Literal) 也可以作為原型，並透過 `Object.create()` 傳入。

``` js
const Person = {
    calcAge() {
        console.log(2030 - this.birthYear)
    }
};
const allen = Object.create(Person)
allen.calcAge(); // 37;
console.log(allen.__proto__ === Person)
```

## 物件實字 (Object Literal) 的繼承

``` js
const Person={
    calcAge() {
        console.log(2030 - this.birthYear)
    },
    setData(firstName,birthYear){
        this.firstName=firstName;
        this.birthYear=birthYear;
    }
};

const Taiwanese = Object.create(Person);
Taiwanese.setData=function(firstName,birthYear,country){
    Person.setData.call(this,firstName,birthYear);
    this.country=country;
};

const ted = Object.create(Taiwanese);
ted.setData('Ted',1990,'Taiwanese');
console.log(ted.__proto__); //{setData: ƒ}
console.log(ted.__proto__.__proto__); // {calcAge: ƒ, setData: ƒ}
```
### 參考資料
* [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)