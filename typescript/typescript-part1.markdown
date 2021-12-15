#  TypeScript 筆記 - Part 1 (Type System & Concept)

> 本文為 [Typescript : The Complete Developer's Guide](https://www.udemy.com/course/typescript-the-complete-developers-guide/) 之筆記，內容經消化吸收後以筆記方式歸納記錄下來，部分程式碼非原創，原創內容請參考上述課程連結。

## Type System (型別系統) 與  TypeScript 

在討論到  TypeScript  是什麼之前，可以先來了解JavaScript中的型別系統，而我在 [JavaScript型別筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/KnowJs/KnowJs6.markdown) 中提到，JavaScript 的型別分為
1. 基本型別 (number, boolean, undefined, null, string, symbol, void) 

2. 物件型別 (functions , arrays , classes , objects) 

 但是對於 JavaScript 而言，變數的型別是能夠被改變的，如下方程式碼中的變數 signedIn 原先屬於 boolean ，而後將數字 100 傳入後，其型別變為 Number 。

```js
//在 JavaScript 內的程式碼
let signedIn = true;
console.log(typeof signedIn) //boolean
signedIn = 100
console.log(typeof signedIn) //number
```

而 TypeScript 就可以用來防止因為意外而發生型別變更的慘劇， TypeScript 可以想像成 JavaScript 與 Type System (型別系統) 的結合， TypeScript 將程式碼內的變數透過型別系統來規範，因此可以幫助我們在開發階段 (code執行前) 提早發現錯誤。

簡而言之， TypeScript 透過 Type Annotation (型別註記) 來標記變數的型別，以便檢查程式碼是否有出現錯誤; 如下方程式碼中透過 TypeScript Annotation 將變數 signedIn 定義為 boolean 型別，再將數字100傳入變數 signedIn ，此時 TypeScript Compiler 會在該行程式碼告知數字不該被傳入該變數，因為它屬於 boolean 型別。此外， TypeScript 除了有助於開發階段的除錯外，也可幫助工程師加速理解程式碼的內容(理解變數的意義以及型別等)。

```ts
//在 TypeScript 內的程式碼
let signedIn:boolean = false;
signedIn = 100; //程式碼出現錯誤(紅色底線)，Type 'number' is not assignable to type 'boolean'.
```

 > TypeScript 只有在開發階段才有其意義，且無法對程式碼進行表現上的優化，此外因為瀏覽器只認得 JavaScript 程式碼， TypeScript 在執行後會透過 TypeScript  Compiler 編譯成 JavaScript 程式碼來讓瀏覽器看得懂。

## 型別註記 (Type Annotations)、型別推論 (Type Inference) 、型別斷言 (Type assertion)

* **型別註記 (Type Annotations)** : 我們明確的告知 TypeScript 某變數應當為什麼型別。
 

```ts
//宣告變數 apple 時透過 Type Annotation 定義型別，此時 TypeScript 會透過 Type Inference 將變數 apples 定義為 Number type

let applesNumber:number= 5;
applesNumber = [1,2,3] 
//Type 'number[]' is not assignable to type 'number'.
```

* **型別推論 (Type Inference)** : TypeScript 自行去推斷某變數應該是什麼型別。

 `Type Inference is used in default`

```ts
 //宣告變數 apple 時沒有透過 Type Annotation 定義型別，此時 TypeScript 會透過 Type Inference將變數 apples 定義為 Number type
let applesNumber = 5;
applesNumber = [1,2,3]; //Type 'number[]' is not assignable to type 'number'.
 ```

 * **型別斷言 (Type Assertions)** : 當我們明確知道變數的型別，但 TypeScript 無法了解的時候。
 

```ts
//TypeScript 只能知道 element 是一種 Element 型別，但無法知道其細節
const btnElement =document.querySelector('.changeBtn') //const element: Element
// 透過型別推段告知 TypeScript 所選取的元素為何種型別
const toggleBtn = document.querySelector(".toggleBtn") as HTMLButtonElement; //const toggleBtn: HTMLButtonElement
```

## 使用型別註記 (Type annotations) 的時機

1. 當函示回傳的變數為 any 時，如下方的`JSON.parse(json)`，該方法會因為傳入的參數型態而回傳不同的型別

```ts
// JSON.parse 能夠回傳不同型別的值，因此回傳的型別為 any
JSON.parse("4"); // 4 (number)
JSON.parse("true"); // true (boolean)
JSON.parse('{"x":10,"y":11}'); // {x: 10, y: 11} (Object)

const json = '{"x":10, "y":20}';
//透過 annotation 明確定義物件 coordinates 內的 property 有哪些，且為何種型別
const coordinates: { x: number; y: number } = JSON.parse(json);
// 此時鼠標指向 coordinates 時就會出現 const coordinates: {x: number;y: number;}
```

2. 若某變數需要先行宣告，但沒有立即將變數傳入時，需確保某變數不會受到型別推論 (Type Annotation) 而變為 any。

```ts
// 2) When we declare a variable on one line and initialize it later
let words = ["red", "green", "blue"];
let foundWord: boolean;
for (let item of words) {
  if (item === "green") foundWord = true;
}
```

3. 當某變數可能具有多種型別時

```ts
// 3) Variable whose type cannot be inferred correctly
let numbers = [-10, -1, 12];
let numberAboveZero: boolean | number = false;
for (let item of numbers) {
  if (item > 0) numberAboveZero = item;
}
```

## 函式的 Annotation

* 告知 TypeScript 函示應該 1. 引入參數的型別以及 2. 會回傳什麼型別的變數
* 如果沒有註記函式的回傳變數， TypeScript 會透過函式推斷 (Type Inference) 來判斷回傳的型別

```ts
const add = (a: number, b: number): number => {
  return a + b;
}

function divide(a: number, b: number): number {
  return a / b;
}

//若回傳型別不符合， TypeScript 出現訊息告知異常
const logger = (message: string): void => {
  return 'hi there'   // Type 'string' is not assignable to type 'void'.
}

// 參數須是含有 date property (Date type) 及 weather property (String type) 的物件
const logWeather = (forecast: { date: Date; weather: string }) => {
  console.log(forecast.date);
  console.log(forecast.weather);
}
```

## 物件的 Annotation

```ts
const profile = {
  name: "alex",
  age: 20,
  coords: {
    lat: 0,
    lng: 15,
  },
  setAge(age: number): void {
    this.age = age;
  },
};

const { age }: { age: number } = profile;
const {  coords: { lat, lng },}: { coords: { lat: number; lng: number } } = profile;

```

## 陣列的 Annotation

*  TypeScript 可以避免將錯誤的型別加入陣列中。
*  TypeScript 透過型別推斷 (Type Inference) 來判斷從陣列存取 value 的型別，且 `map` 、 `forEach` 、 `reduce` 也有相同的效果。
* 可以透過 Tuple 方式來規範**陣列中依序有哪些型別**。

```ts
// 用 string[] 來表示 carMakers 是一個僅含有字串的陣列
const carMakers: string[] = ["ford", "toyota", "chevy"]; //const carMakers: string[]

// 用 string[][] 來表示 carsByMake 是一個含有字串陣列的陣列
const carsByMake = [["f150"], ["corolla"], ["camaro"]];  //const carsByMake: string[][] = [];

//  規定陣列可以含有 value 的型別
const importantDates: (Date | string)[] = [];
importantDates.push("2030-10-10");
importantDates.push(new Date());
importantDates.push(true); //Argument of type 'boolean' is not assignable to parameter of type 'string | Date'.

// 1.  TypeScript 透過 Inference 告知 car 屬於 string
const car = carMakers[0];  //const favoriteCar: string

// 2. 避免將錯誤的型別加入陣列中
carMakers.push(100); //Argument of type 'number' is not assignable to parameter of type 'string'.

// 3. 可以判別 map method 所回傳的陣列型別
const collections =carMakers.map((car: string): string => {
  return car.toUpperCase();
});  // const collections: string[]

// 4. 透過 Tuple 方式來規範陣列中依序有哪些型別
type Drink = [string, boolean, number];
const pepsi: Drink = ["brown", true, 40];
const sprite: Drink = ["clear", true, 40];
const tea: Drink = ["brown", false, 0];

```
