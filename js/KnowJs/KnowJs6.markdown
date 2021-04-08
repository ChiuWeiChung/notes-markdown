# 了解JavaScript的背後Part6 (Primitives&Objects)

## Primitives (primitive types, 基本型別)與Objects(reference types, 參考型別)
#### 在Javscript中大致上可分為兩大型別所組成，一是基本型別，包含`Number`、`String`、`Boolean`、`Undefined`、`Null`、`Symbol`、`BigInt`;另一個型別是物件型別，包含`Object Literal`、`Array`、`Functions`....。

## 兩大型別的記憶體位置
#### 在JavaScript Engine內，兩大型別的`值`存放的位置不一樣，基本型別會存放於`Execution Stack`，而物件型別則存放於`Heap`內部。


#### 對於基本型別的例子中，宣告一變數名稱`dog1`，並給定一值`'Jumo'`，事實上，`dog1`並非直接對應我們給定的值`'Jumo'`，而是指向一個`adress(0001)`並且對應到值`'Jumo'`; 當我們將`dog1`傳入新變數`dog2`時，`dog2`也會指向同一`adress(0001)`，倘若將值`'Judas'`重新傳入`dog1`時，由於在`Exeuction Stack被adress對應的值是無法被改變`，`dog1`的adress會重新導向至`adress(0002)`並對應新值`"Judas"`。

```js
// Primitives type
let dog1 = "Jumo";
let dog2 = dog1;
dog1 = "Judas";
console.log(dog1, dog2;// Judas Jumo
```
![Primitive types](https://github.com/ChiuWeiChung/IMGTANK/blob/main/types/primitive.gif?raw=true)

#### 對於參考型別而言，如下方範例，當`物件rick`被宣告時，其值`{firstName:...,}`會被存放於`Heap`內部並由`adress(D30F)`對應，然而`物件rick`並不會直接指向`Heap`內的adress，而是先指向Execution Stack內的`adress(0003)`，`adress(0003)`才會對應`Heap`內的`adress D30F`，在宣告`物件anotherRick`後並且透過`anotherRick.lastName`傳入新值`"Chen"`時，事實上並不會重新導向`物件anotherRick`在`Heap`內的adress，而是直接改變`Heap`內的值，也因此`物件rick`內的lastName也會同步改變。

```js
// Reference type
const rick = {
    firstName:"Rick",
    lastName: "Chiu",
    age:27
};
const anotherRick = rick;
anotherRick.lastName = "Chen";
console.log("Rick:", rick); //Rick: {firstName: "Rick", lastName: "Chen", age: 27}
console.log("Another Rick:", anotherRick); //Another Rick: {firstName: "Rick", lastName: "Chen", age: 27}
```
![Reference types](https://github.com/ChiuWeiChung/IMGTANK/blob/main/types/reference.gif?raw=true)


## Object.assign()及其注意事項
#### 倘若要避免複製物件內容做改動時，連帶影響原物件，可以使用`Object.assign()`的方式。

```js
const rick = {
    firstName:"Rick",
    lastName:"Chiu",
};
const anotherRick = Object.assign({},rick);
anotherRick.lastName="Chen";
console.log(rick.lastName); //Chiu
console.log(anotherRick.lastName); //Chen
```

#### 但需要特別注意的是，`Object.assign()`屬於`非深層複製(not deep clone)`，`Object.assign()`僅會複製屬性值。若來源物件的值是參照到一個子物件(object in object)，它只會複製它的reference，如下方程式碼。

```js
const rick = {
    firstName:"Rick",
    lastName:"Chiu",
    family:["Jason","Emily","Bob"]
};
const anotherRick = Object.assign({},rick);
anotherRick.family.push("John");
console.log(rick.family); // ["Jason", "Emily", "Bob", "John"]
console.log(anotherRick.family); // ["Jason", "Emily", "Bob", "John"]
```

## 將物件轉成字串再轉回物件

#### 另外一種複製方法比較tricky，透過JSON.stringify()將物件轉成字串，再透過JSON.parse()將字串轉成物件傳入變數。
```js
const rick = {
    firstName:"Rick",
    lastName:"Chiu",
    family:["Jason","Emily","Bob"]
};
const anotherRick = JSON.parse(JSON.stringify(rick));
anotherRick.family.push("John");
console.log(rick.family); // ["Jason", "Emily", "Bob"]
console.log(anotherRick.family); // ["Jason", "Emily", "Bob", "John"]
```

