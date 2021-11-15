# TypeScript筆記 (Type System & Concept)

> 本文為[Typescript: The Complete Developer's Guide ](https://www.udemy.com/course/typescript-the-complete-developers-guide/)之筆記，內容經消化吸收後以自我理解之方式呈現，部分程式碼非原創，原創內容請參考上述課程連結

## Type System(型別系統) 與 TypeScript

在討論到TypeScript是什麼之前，可以先來了解JavaScript中的型別系統，而我在[JavaScript型別筆記](https://github.com/ChiuWeiChung/notes-markdown/blob/main/js/KnowJs/KnowJs6.markdown)中提到，JavaScript有 1. 基本型別(number, boolean, undefined, null, string, symbol, void)以及 2. 物件型別(functions, arrays, classes, objects)兩大類別。 但是對於JavaScript而言，變數的型別是能夠被改變的，如下方程式碼中的變數signedIn原先屬於boolean，而後將數字100傳入後，其型別變為Number。

```js
//在JavaScript內的程式碼
let signedIn = true;
console.log(typeof signedIn) //boolean
signedIn = 100
console.log(typeof signedIn) //number
```

而TypeScript就可以用來防止因為意外而發生型別變更的慘劇，TypeScript可以想像成JavaScript與Type System(型別系統)的結合，TypeScript將程式碼內的變數透過型別系統來規範，因此可以幫助我們在開發階段(code執行前)提早發現錯誤。

簡而言之，TypeScript透過Type Annotation(型別註記)來標記變數的型別，以便檢查程式碼是否有出現錯誤; 如下方程式碼中透過TypeScript Annotation 將變數signedIn定義為boolean型別，再將數字100傳入變數signedIn，此時TypeScript Compiler會在該行程式碼告知數字不該被傳入該變數，因為它屬於boolean型別。此外，TypeScript除了有助於開發階段的除錯外，也可幫助工程師加速理解程式碼的內容(理解變數的意義以及型別等)。

```ts
//在TypeScript內的程式碼
let signedIn:boolean = false;
signedIn = 100; //程式碼出現錯誤(紅色底線)，Type 'number' is not assignable to type 'boolean'.
```

 `TypeScript只有在開發階段才有其意義，且無法對程式碼進行表現上的優化，此外因為瀏覽器只認得JavaScript程式碼，TypeScript在執行後會透過TypeScript Compiler 編譯成JavaScript程式碼來讓瀏覽器看得懂。`

## 型別註記(Type Annotations)、型別推論(Type Inference) 、型別斷言(Type assertion)

* 型別註記(Type Annotations): 我們明確的告知TypeScript，某變數`應當`為什麼型別。
 

```ts
//宣告變數apple時透過Type Annotation定義型別，此時TypeScript會透過Type Inference將變數apples定義為Number type
let applesNumber:number= 5;
applesNumber = [1,2,3] //Type 'number[]' is not assignable to type 'number'.
```

* 型別推論(Type Inference): TypeScript自行去推斷某變數`應該`是什麼型別。

 `Type Inference is used in default`

```ts
 //宣告變數apple時沒有透過Type Annotation定義型別，此時TypeScript會透過Type Inference將變數apples定義為Number type
let applesNumber = 5;
applesNumber = [1,2,3]; //Type 'number[]' is not assignable to type 'number'.
 ```

 * 型別斷言(Type Assertions) : 當我們明確知道變數的型別，但TypeScript無法了解的時候。
 

```ts
// TypeScript只能知道element是一種Element型別，但無法知道其細節，
const btnElement =document.querySelector('.changeBtn') //const element: Element
// 透過型別推段告知TypeScript所選取的元素為何種型別
const toggleBtn = document.querySelector(".toggleBtn") as HTMLButtonElement; //const toggleBtn: HTMLButtonElement
 ```

## 需要使用型別註記(Type annotations)的時機

1. 當函示回傳的變數為any時，如下方的JSON.parse(json)，該方法會因為傳入的參數型態而回傳不同的型別

```ts
// JSON.parse 能夠回傳不同型別的值，因此回傳的型別為any
JSON.parse("4"); // 4 (number)
JSON.parse("true"); // true (boolean)
JSON.parse('{"x":10,"y":11}'); // {x: 10, y: 11} (Object)

const json = '{"x":10, "y":20}';
//透過annotation明確定義物件coordinates內的property有哪些，且為何種型別
const coordinates: { x: number; y: number } = JSON.parse(json);
// 此時鼠標指向coordinates時就會出現const coordinates: {x: number;y: number;}
```

2. 若某變數需要先行宣告，但沒有立即將變數傳入時，需確保某變數不會受到型別推論(Type Annotation)而變為any

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

## 函式的Annotation

* 告知TypeScript函示應該1. 引入參數的型別以及2. 會回傳什麼型別的變數
* 如果沒有註記函式的回傳變數，TypeScript會透過函式推斷(Type Inference)來判斷回傳的型別

```ts
const add = (a: number, b: number): number => {
  return a + b;
}

function divide(a: number, b: number): number {
  return a / b;
}

//若回傳型別不符合，TypeScript出現訊息告知異常
const logger = (message: string): void => {
  return 'hi there'   // Type 'string' is not assignable to type 'void'.
}

// 參數須是含有date property(Date type)及weather property(String type)的物件
const logWeather = (forecast: { date: Date; weather: string }) => {
  console.log(forecast.date);
  console.log(forecast.weather);
}
```

## 物件的Annotation

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

## 陣列的Annotation

* TypeScript可以避免將錯誤的型別加入陣列中
* TypeScript透過型別推斷(Type Inference)來判斷從陣列存取value的型別，且map、forEach、reduce也有相同的效果
* 可以透過Tuple方式來規範陣列中`依序`有哪些型別

```ts
// 用string[]來表示carMakers是一個僅含有字串的陣列
const carMakers: string[] = ["ford", "toyota", "chevy"]; //const carMakers: string[]

// 用string[][]來表示carsByMake是一個含有字串陣列的陣列
const carsByMake = [["f150"], ["corolla"], ["camaro"]];  //const carsByMake: string[][] = [];

//  規定陣列可以含有value的型別
const importantDates: (Date | string)[] = [];
importantDates.push("2030-10-10");
importantDates.push(new Date());
importantDates.push(true); //Argument of type 'boolean' is not assignable to parameter of type 'string | Date'.

// 1. TypeScript透過Inference告知car屬於string
const car = carMakers[0];  //const favoriteCar: string

// 2. 避免將錯誤的型別加入陣列中
carMakers.push(100); //Argument of type 'number' is not assignable to parameter of type 'string'.

// 3. 可以判別map method所回傳的陣列型別
const collections =carMakers.map((car: string): string => {
  return car.toUpperCase();
});  // const collections: string[]

// 4. 透過Tuple方式來規範陣列中依序有哪些型別
type Drink = [string, boolean, number];
const pepsi: Drink = ["brown", true, 40];
const sprite: Drink = ["clear", true, 40];
const tea: Drink = ["brown", false, 0];

```
