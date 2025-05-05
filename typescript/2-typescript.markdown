# TypeScript筆記 - Part 2 (Interfaces & Classes & Generics )

> 本文為 [Typescript : The Complete Developer's Guide](https://www.udemy.com/course/typescript-the-complete-developers-guide/) 之筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

---

## Interfaces以及 TypeScript 中的物件

物件作為函式的參數 (argument) 時，需在宣告函式過程進行參數的型別註記，如下方程式碼，函式 printVehicle 引入的物件需要符合`{  name: string; year: number; broken: boolean; summary(): string; }`條件，然而這樣的方法存在許多缺點如 1. 物件屬性越多，會使程式碼越冗長 2. 同型別的物件被多個函式作為參數引入時，相同的註記又須重複一次。

```ts
// X) Argument難以判讀
const showCarProfile = (car: {  name: string;  year: number;  broken: boolean;  summary(): string;}): void => {
  console.log(`Name:${car.name}`);
  console.log(`Yeaer:${car.year}`);
  console.log(`Broken:${car.broken}`);
  console.log(car.summary());
};
```

### 透過 Interface 避免冗長的 Annotations

對於物件而言，為了在 TypeScript 中可以使程式碼簡潔又重複使用，可以透過 Interface 的幫助描述物件內的 key 名稱及其 value 型別，如下方程式碼，透過宣告 Car interface 來明確定義物件內的型別，並在函式宣告時引入， TypeScript 即可確認函式被呼叫時引入的 argument 是否符合 Car interface 的條件。

```ts
interface Car {
  name: string;
  year: number;
  broken: boolean;
  summary(): string;
}

// 取代冗長的 annotaion ，透過 Car interface 取代冗長的 Annotation
const showCarProfile = (car: Car): void => {
  console.log(`Name:${car.name}`);
  console.log(`Yeaer:${car.year}`);
  console.log(`Broken:${car.broken}`);
  console.log(car.summary());
};
```

滿足 Interface 的條件在於 `物件是否含有對應的name與type` ，因此物件所多出的 properties 不會影響 TypeScript 的判斷，如下方程式碼中，物件 Tesla 以及物件 PS5 符合 Intro interface 的條件 (都具有summary property) ，因此可以作為函式 printSummary 的參數。

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

## 類別 (Classes)

類別 (classes) 是可以作為描述物件的藍圖，在 TypeScript 中，而在 TypeScript 中，可以透過 Modifiers 來明確定義內部的 properties 應當在什麼位置被呼叫

### Modifiers

* **public** : 允許 property 在任何時間、地點被呼叫。
* **private** : 只允許 property 在自身 class 內部被呼叫。
* **protected** : 只允許 property 在自身 class 及其子 class 內部被呼叫。

```ts
class GameConsole {
  //被 public 標記的 method 可以在任何時間地點被呼叫
  public openConsole(): void {
    console.log("beep!");
  }
  //被 private 標記的 method 只能在自身 class 內被呼叫
  private loadGame(): void {
    console.log("reading disc game~");
  }
  // 透過 startGame method 呼叫 private loadGame method
  public startGame(): void {
    this.loadGame(); 
  }
  //被 protected 標記的 method 只能在自身 class 或是子 class 內部被呼叫
  protected quitGame(): void {
    console.log("quit the game!");
  }
}

class PlayStation extends GameConsole {
  // 繼承了 GameConsole 的 child class 可在內部呼叫被 protected 標記的 quitGame method
  public shutDown(): void {
    this.quitGame(); 
    console.log("console shutdown");
  }
}
const gameConsole = new GameConsole();
const ps5 = new PlayStation();
gameConsole.openConsole(); // 被 public 標記的 shutDown method 可以在 class 外部被呼叫
gameConsole.loadGame(); // X) 出現錯誤:Property 'loadGame' is private and only accessible within class 'GameConsole'.
gameConsole.startGame(); // 透過 startGame 呼叫被 private 標記的loadGame method
ps5.shutDown(); // 透過 shutDown 呼叫被 protected 標記的 quitGame method
```

### 建構子 (Constructor)

一般方式定義 Class 內的 Constructor

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

可以透過更簡短方式定義 Class 內的 Constructor

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

在編寫程式碼的過程中，若希望寫出的 component 具有高自由度 (適應多種型別)、重複使用 (Reusable) 的特性，可以透過 TypeScript 的通用型別 (Generics) 來達到此目的，其概念類似下方函式 show ，被傳入的 argument 型別與回傳的 value 型別都是 String 。

```ts
function show(thing:string):string{
  return thing
}
```

上述的概念可以透過 any 型別表示，如下方程式碼，任何型別都可以作為 thing 被傳入，然而缺點在於，該函式可以回傳任何型別的 value ，導致我們只能知道傳入的 thing 型別，卻無法得知最後回傳的 value 型別

```ts
function show(thing:any):any{
  return thing  // 回傳的value為any type，無法得知最後回傳的value型別
}
```

### 透過 Gnerics 改善

要改善上述的缺點，可以將 type variable 加入函式之中，即在函式名稱後加入< T >，其作用可想像將 T 作為 argument 傳入函式，在呼叫過程，TypeScript就會檢視被T所標記的任何事物 (eq:thing) ，因此回傳的 value (thing) 也必須是 T 型別。

```ts
function show<T>(thing:T):T{   //T被標明為屬於thing的型別
  return thing  //回傳的value(thing)也會是T型別
}
```

在完成 generic function 後，有兩種方法可以進行呼叫
* 第一種方式: 直接將 type argument 傳入函式之中， TypeScript Compiler 檢視回傳的 value 是否符合的 type argument 的條件
* 第二種方法: 透過 Type Inference 協助， TypeScript Compiler 直接檢視 argument(thing) 的型別，並將 T 推斷為與其相同的型別。

```ts

// =====方法1，直接將 type argument 傳入函式====
const method1 = show<number>(30) //const output: number
const ngMethod1 = show<number>('hi') // X) string' is not assignable to parameter of type 'number'.
// =====方法2，直接透過 Type Inference 進行判斷====
const method2 = show('halo') //const method2: "halo"
```

 `< T > 內部的 T 可以是任何名稱 (Type、Tp...) ，可依照個人 (團隊) 使用習慣變更`

### Generics 函式運用實例

下方程式碼中，函式 listMemberName 以及函式 listMemberAge 都可列出陣列內的資料，其差異僅在於列出的資料是字串陣列或是數字陣列，為了讓程式碼更簡潔、彈性，可以宣告一個 generic function (listInfo) 來避免程式碼內容重複性高的函式出現。

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

* 將兩種內容重複的函式內容透過 generic function 表現

```ts
function listInfo<T>(arr: T[]): void {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}
listInfo(["Sarah", "Ted", "Hank", "John"]); //function listInfo<string>(arr: string[]): void
listInfo([25, 30, 22, 31]); //function listInfo<number>(arr: number[]): void
```

###  Generics 延伸至 Classes 的運用

* 類別 MemberAgeList 及類別 MemberNameList 內容重複性高

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

* 將兩種內容重複的類別透過 Generic Class 表現

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

## 通用型別的條件約束 (Generic Constraints)

在定義 generic function 可能會遇到下方的程式碼異常，如下方的 gameRoom function ，TypeScript僅知道傳入的 argument (arr) 是一個T型別的陣列，但無法明確知道 arr 是否有 bootUp 的 property ，因此跳出了警告標語。

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

為了解決該異常，可以透過限制 (constraint) 的方式，告知該函式傳入的 T 型別必須要具有 bootUp 的 property ，如下方程式碼中，宣告了一個具有 bootUp property 的greet Interface ，並在 gameRoom 內透過 extends 方式來表現對 generic function 的限制。

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

gameRoom([1, 2, 3, 4]); // X)Type 'number' is not assignable to type 'greet'. 陣列 [1,2,3,4] 不具備 bootUp property
gameRoom([new Xbox(), new Xbox()]); //function gameRoom<Xbox>(arr: Xbox[]): void
```

## 在限制中多加一層限制的 Generic constraint

為了避免存取物件內的 property 時出現該 property 不存在的情況，如下方程式碼，可以透過 extends keyof 以確保型別K必須是型別 T 的 property 之一。

<!-- You can declare a type parameter that is constrained by another type parameter. For example, here we’d like to get a property from an object given its name. We’d like to ensure that we’re not accidentally grabbing a property that does not exist on the obj, so we’ll place a constraint between the two types: -->

```ts

interface Identity {
  name?: string;
  age?: number;
  gender?: string;
}
export class Introduction<T> {
  constructor(public data: T) {}
  // K須符合T的其中一項 property
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
