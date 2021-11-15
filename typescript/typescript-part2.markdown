# TypeScript筆記 (Interfaces & Classes & Generics )

> 本文為[Typescript: The Complete Developer's Guide ](https://www.udemy.com/course/typescript-the-complete-developers-guide/)之筆記，內容經消化吸收後以自我理解之方式呈現，部分程式碼非原創，原創內容請參考上述課程連結

---

## Interfaces以及TypeScript中的物件

物件作為函式的參數(argument)時，需在宣告函式過程進行參數的型別註記，如下方程式碼，函式printVehicle引入的物件需要符合{  name: string; year: number; broken: boolean; summary(): string; }條件，然而這樣的方法存在許多缺點如 1. 物件properties越多，會使程式碼越冗長 2. 同型別的物件被多個函式作為參數引入時，相同的註記又須重複一次。

```ts
// X) Argument難以判讀
const showCarProfile = (car: {  name: string;  year: number;  broken: boolean;  summary(): string;}): void => {
  console.log(`Name:${car.name}`);
  console.log(`Yeaer:${car.year}`);
  console.log(`Broken:${car.broken}`);
  console.log(car.summary());
};
```

### 透過Interface避免冗長的Annotations

對於物件而言，為了在TypeScript中可以使程式碼簡潔又重複使用，可以透過Interface的幫助描述物件內的key名稱及其value型別，如下方程式碼，透過宣告Car interface來明確定義物件內的型別，並在函式宣告時引入，TypeScript即可確認函式被呼叫時引入的argument是否符合Car interface的條件。

```ts
interface Car {
  name: string;
  year: number;
  broken: boolean;
  summary(): string;
}

// 取代冗長的annotaion，透過Car interface取代冗長的Annotation
const showCarProfile = (car: Car): void => {
  console.log(`Name:${car.name}`);
  console.log(`Yeaer:${car.year}`);
  console.log(`Broken:${car.broken}`);
  console.log(car.summary());
};
```

滿足Interface的條件在於 `物件是否含有對應的name與type` ，因此物件所多出的properties不會影響TypeScript的判斷，如下方程式碼中，物件Tesla以及物件PS5符合 Intro interface的條件(都具有summary property)，因此可以作為函式printSummary的參數。

```ts

interface Intro {
  summary(): string;
}

const Tesla = {
  name: "model X",
  year: 2021,
  horsepower:1020,
  summary(): string {
    return `Name:${this.name}`;
  },
};

const Ps5 = {
  color: "white",
  Edition: 'digital',
  storageExpandable:true,
  summary(): string {
    return `I am next generation video game console!`;
  },
};

const printSummary = (item: Intro): void => {
  console.log(item.summary());
};

printSummary(Tesla);
printSummary(Ps5);
```

---

## 類別(Classes)

類別(classes)是可以作為描述物件的藍圖，在TypeScript中，而在TypeScript中，可以透過Modifiers來明確定義內部的properties應當在什麼位置被呼叫

### Modifiers

* public : 允許property在任何時間、地點被呼叫
* private : 只允許property在自身class內部被呼叫 
* protected : 只允許property在自身class及其子classs內部被呼叫

```ts
class GameConsole {
  //被public標記的method可以在任何時間地點被呼叫
  public openConsole(): void {
    console.log("beep!");
  }
  //被private標記的method只能在自身class內被呼叫
  private loadGame(): void {
    console.log("reading disc game~");
  }
  // 透過startGame method呼叫private loadGame method
  public startGame(): void {
    this.loadGame(); 
  }
  //被protected標記的meethod只能在自身class或是子class內部被呼叫
  protected quitGame(): void {
    console.log("quit the game!");
  }
}

class PlayStation extends GameConsole {
  // 繼承了GameConsole的child class可在內部呼叫被protected標記的quitGame method
  public shutDown(): void {
    this.quitGame(); 
    console.log("console shutdown");
  }
}
const gameConsole = new GameConsole();
const ps5 = new PlayStation();
gameConsole.openConsole(); // 被public標記的shutDown method可以在class外部被呼叫
gameConsole.loadGame(); // X) 出現錯誤:Property 'loadGame' is private and only accessible within class 'GameConsole'.
gameConsole.startGame(); // 透過startGame呼叫被private標記的loadGame method
ps5.shutDown(); // 透過shutDown呼叫被protected標記的quitGame method
```

### 建構子(Constructor)

一般方式定義Class內的Constructor

```ts
// 一般方式
class GameConsole {
  color: string;
  constructor(color: string) {
    this.color = color;
  }
}
const gameConsole = new GameConsole('black')
console.log(gameConsole.color); ////black
```

可以透過更簡短方式定義Class內的Constructor

```ts
// 更簡短方式，效果同一般方式
class GameConsole {
  constructor(public color:string){}
}

class Xbox extends GameConsole {
  constructor(public type:string, color:string){
    super(color);
  }
}

const xbox = new Xbox('seriesX','black');
console.log(xbox.type) // seriesX
console.log(xbox.color) // black
```

---

## 通用型別 (Generics)

### 概念

在編寫程式碼的過程中，若希望寫出的component具有高自由度(適應多種型別)、重複使用(Reusable)的特性，可以透過TypeScript的通用型別(Generics)來達到此目的，其概念類似下方函式show，被傳入的argument型別與回傳的value型別都是String。

```ts
function show(thing:string):string{
  return thing
}
```

上述的概念可以透過any型別表示，如下方程式碼，任何型別都可以作為thing被傳入，然而缺點在於，該函式可以回傳任何型別的value，導致我們只能知道傳入的thing型別，卻無法得知最後回傳的value型別

```ts
function show(thing:any):any{
  return thing  // 回傳的value為any type，無法得知最後回傳的value型別
}
```

### 透過Gnerics改善

要改善上述的缺點，可以將type variable加入函式之中，即在函式名稱後加入< T >，其作用可想像將T作為argument傳入函式，在呼叫過程，TypeScript就會檢視被T所標記的任何事物(eq:thing)，因此回傳的value(thing)也必須是T型別。

```ts
function show<T>(thing:T):T{   //T被標明為屬於thing的型別
  return thing  //回傳的value(thing)也會是T型別
}
```

在完成generic function後，有兩種方法可以進行呼叫
* 第一種方式: 直接將type argument傳入函式之中，TypeScript Compiler檢視回傳的value是否符合的type argument的條件
* 第二種方法: 透過Type Inference協助，TypeScript Compiler直接檢視argument(thing)的型別，並將T推斷為與其相同的型別。

```ts

// =====方法1，直接將type argument傳入函式====
const method1 = show<number>(30) //const output: number
const ngMethod1 = show<number>('hi') // X) string' is not assignable to parameter of type 'number'.
// =====方法2，直接透過Type Inference進行判斷====
const method2 = show('halo') //const method2: "halo"
```

 `<T> 內部的T可以是任何名稱(Type、Tp...)，可依照個人(團隊)使用習慣變更`

### Generics 函式運用實例

下方程式碼中，函式listMemberName以及函式listMemberAge都可列出陣列內的資料，其差異僅在於列出的資料是字串陣列或是數字陣列，為了讓程式碼更簡潔、彈性，可以宣告一個generic function(listInfo)來避免程式碼內容重複性高的函式出現。

* 兩個函式的內容重覆，僅在於回傳陣列之型別不同

```ts
function listMemberName(arr: string[]): void {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

function listMemberAge(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}
listMemberName(["Sarah", "Ted", "Hank", "John"]); //function listInfo<string>(arr: string[]): void
listMemberAge([25, 30, 22, 31]); //function listInfo<number>(arr: number[]): void

```

* 將兩種內容重複的函式內容透過generic function表現

```ts
function listInfo<T>(arr: T[]): void {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}
listInfo(["Sarah", "Ted", "Hank", "John"]); //function listInfo<string>(arr: string[]): void
listInfo([25, 30, 22, 31]); //function listInfo<number>(arr: number[]): void
```

### Generics延伸至Classes的運用

* 類別MemberAgeList及類別MemberNameList內容重複性高

```ts
class MemberAgeList {
  constructor(public collection: number[]) {}
  get(index: number): number {
    return this.collection[index];
  }
}

class MemberNameList {
  constructor(public collection: string[]) {}
  get(index: number): string {
    return this.collection[index];
  }
}
```

* 將兩種內容重複的類別透過Generic Class表現

```ts
class MemberInfoList<T> {
  constructor(public collection: T[]) {}
  get(index: number): T {
    return this.collection[index];
  }
}

const ageList = new ArrayOfAnything([28,33,52,51]); 
const nameList = new ArrayOfAnything(["Terry", "Josh", "Stanley","Jule"]); 
```

## 通用型別的條件約束(Generic Constraints)

在定義generic function可能會遇到下方的程式碼異常，如下方的gameRoom function，TypeScript僅知道傳入的argument(arr)是一個T型別的陣列，但無法明確知道arr是否有bootUp的property，因此跳出了警告標語。

```ts
class Xbox {
  bootUp() {
    console.log("Hi, I am video game console from Microsoft");
  }
}
function gameRoom<T>(arr: T[]): void {
  for (let i = 0; i < arr.length; i++) {
    arr[i].bootUp(); //出現錯誤(Property 'bootUp' does not exist on type 'T'.
  }
}
```

為了解決該異常，可以透過限制(constraint)的方式，告知該函式傳入的T型別必須要具有bootUp的property，如下方程式碼中，宣告了一個具有bootUp property的greet Interface，並在gameRoom內透過extends方式來表現對generic function的限制。

```ts
class Xbox {
  bootUp() {
    console.log("Hi, I am video game console from Microsoft");
  }
}
interface greet {
  bootUp(): void;
}

function gameRoom<T extends greet>(arr: T[]): void {
  for (let i = 0; i < arr.length; i++) {
    arr[i].bootUp();
  }
}

gameRoom([1, 2, 3, 4]); // X)Type 'number' is not assignable to type 'greet'. 陣列[1,2,3,4]不具備bootUp property
gameRoom([new Xbox(), new Xbox()]); //function gameRoom<Xbox>(arr: Xbox[]): void
```

## 在限制中多加一層限制的Generic constraint

為了避免存取物件內的property時出現該property不存在的情況，如下方程式碼，可以透過 extends keyof 以確保型別K必須是型別T的property之一。

<!-- You can declare a type parameter that is constrained by another type parameter. For example, here we’d like to get a property from an object given its name. We’d like to ensure that we’re not accidentally grabbing a property that does not exist on the obj, so we’ll place a constraint between the two types: -->

```ts

interface Identity {
  name?: string;
  age?: number;
  gender?: string;
}
export class Introduction<T> {
  constructor(public data: T) {}
  // K須符合T的其中一項property
  getIntro<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
}

const sarahInfo = new Introduction<Identity>({
  name: 'Sarah',
  age: 35,
  gender: "female",
});

const name = sarahInfo.getIntro("name");
const age = sarahInfo.getIntro("age");
const id = sarahInfo.getIntro("school"); //X)Argument of type '"school"' is not assignable to parameter of type 'keyof Identity'.
```
