# JavaScript中的函式建構式 (Function Constructor) 以及類別 (Class)

> 本文為[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

在[JavaScript的Prototype觀念](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/OOP/Prototype&Inheritance.markdown)中有談到Prototype的觀念以及物件是如何調用methods，而在這裡會記錄JavaScript中的如何建立建構子 (Constructor) ，並且透過建構子來將物件實體化，並連結它的prototype。

## 如何建立Prototype並連結物件?

在JS中，有3種方法可以做到: 
1. 函式建構式(function constructor)
2. ES6的Class 
3. Object.create()

## 1. 函式建構式(function constructor)

函式建構式類似函式敘述式(function expression)，為了辨別是一般函式還是建構子，在命名時會將第一個字母作為大寫。

如下方程式碼，創建了一個 `Person` 建構子，並且透過 `this` 來定義物件內的property，必須注意的是，函式建構式不能使用箭頭函式(arrow function)，因為它的 `this` 並不是指向物件本身。

``` js
const Person = function(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
};
const rick = new Person('Rick', 1992); // 透過 new operator創立新的物件
console.log(rick); // Person {firstName: "Rick", birthYear: 1992}
// 將methods建立在函式建構式的prototype
```

## 物件、建構子、Prototype的關係

當我們在定義methods時，並不會在Person內建立，如上一篇提到，倘若創立10個由Person衍伸出的物件，10個物件內都會含有相同的methods，使的程式碼的重複性過高，為避免這種情況，會傾向將methods建立在它的prototype。

此外，Person的prototype以及rick的prototype都會指向同一個物件，也因此只要透過 `Person.prototype.methodName=function(){...}` 來定義需要使用的函式，物件在執行函式時，會透過Lookup機制沿著Prototype Chain尋找函式名稱。

``` js
// 物件的prototype以及constructor的prototype是同一個
console.log(rick.__proto__ === Person.prototype) // true
// 透過在constructor的prototype定義函式
Person.prototype.calcAge = function() {
    console.log(2030 - this.birthYear)
};
// calcAge函式出現在物件rick的prototype
console.log(rick.__proto__) // {calcAge: ƒ, constructor: ƒ}

// 執行過程中，JavaScript透過Lookup機制，沿著Prototype Chain尋找calcAge的property
rick.calcAge() // 38
const ann = new Person('Ann', 1993);
//rick以及ann的Prototype都指向同一個
rick.__proto__ === ann.__proto__ //true
```
![relationship](https://github.com/ChiuWeiChung/IMGTANK/blob/main/prototype/relationship.jpg?raw=true)

## 函式建構式之間的繼承

透過constructor之間的繼承，可以將實體化的物件被分類的更詳細，比如已經存在的Person Constructor具有 `firstName` 以及 `birthYear` 的性質，倘若想在物件內增加新的性質(如country)，又想維持Person的內容的情況下，雖然可以透過 `rick.country=...` 實現，但是若新增其他的物件(如mike, stella)時，這樣的動作仍需重複一次(mike.country=..., stella.country=...)，為了避免程式碼的重複，可以透過constructor的繼承來實現。

創建一個新的constructor( `Taiwanese` )，透過 `Object.create()` 將 `Peron` 的prototype傳入 `Taiwanese` 的prototype內。

``` js
const Taiwanese = function(firstName, birthYear, country) {
    //透過.call ==>效果同this.firstName=firstName,this.birthYear=...
    Person.call(this, firstName, birthYear);
    this.country = country;
};

//  透過Object.create繼承Person.prototype
Taiwanese.prototype = Object.create(Person.prototype);

//  在定義Taiwanese prototype內的函式時，需在Object.create()之後
//  避免prototype內容被Person.prototype覆蓋
Taiwanese.prototype.sayHi = function() {
    console.log(`Hi! My name is ${this.firstName} and I am a Taiwanese!`)
}

const andy = new Taiwanese('Andy', 1992, 'Taiwanese');
andy.calcAge(); //38
```

## 繼承後的Prototype Chain

``` js
console.log(andy.__proto.constructor.name); //Person 
// 上方照理來說，應是Taiwanese，但因為透過Object.create將Person prototype傳入，所以被Taiwanese被Person覆蓋
console.log(andy.__proto.__proto__.constructor.name); // Person
console.log(andy.__proto.__proto__.__proto__.constructor.name); // Object
console.log(andy.__proto.__proto__.__proto__.__proto__); // null
```

## 2. ES6的Class

ES6的Class其實是**函式建構式的另一中表現方式**，因為class可以讓程式碼更有更有組織、容易判讀，所以又被稱為**函式建構式的語法糖(syntactic sugar)**，可以將data以及methods都寫在一起即可，因此最常被拿來使用。 需要注意的是，class不會被提升(hoist) ，所以在使用前必須先行宣告。

``` js
class Person {
    // 將資料置於constructor(){}內部
    constructor(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }
    // 下方定義的函式，事實上是被存放在Person.prototype內部
    calcAge() {
        console.log(2030 - this.firstName)
    }
}
const stella = new Person("Stella", 1990);
console.log(stella); //Person {firstName: "Stella", birthYear: 1990}
```

## class中的static

倘若不想要物件繼承prototype內的methods，可以在函式宣告前面加上 `static`

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

## class之間的繼承

class之間的繼承，可以透過 `extedns < class-name >` 來實現，

``` js
class Taiwanese extends Person {
    constructor(firstName, birthYear, country) {
        // super類似constructor之間繼承時，使用Person.call()的概念
        // super必須定義在前!
        super(firstName, birthYear)
        this.country = country;
    }
    sayHi() {
        console.log(`Hi! My name is ${this.firstName} and I am ${this.country}`)
    }
};

const rick = new Taiwanese('Rick', 1992, 'Taiwanese');
// Prototype Chain
console.log(rick.__proto__.constructor.name); // Taiwanese
console.log(rick.__proto__.__proto__.constructor.name); // Person
console.log(rick.__proto__.__proto__.__proto.constructor.name); //Object
```

## 3. Object.create()

物件實字 (Object Literal) 也可以作為prototype，並透過 **Object.create()** 傳入。

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

## Object literal 的繼承

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