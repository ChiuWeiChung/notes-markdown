# JavaScript中的各種陣列方法(Array Method)

> 本文為 [Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。


## Slice Method
擷取陣列內的元素，此方法不會改變原陣列內元素。
``` js
// slice method slice(beginIndex,endIndex)
let arr = [1, 3, 5, 7, 9, 11];
console.log(arr.slice(2)); // [5, 7, 9, 11]
console.log(arr.slice(2, 4)); // [5, 7]
console.log(arr.slice(-2)); // [9, 11]
console.log(arr.slice(-1)); //  [11]
console.log(arr.slice(1, -2)); // [3,5,7]
console.log(arr.slice()); //[1,3,5,7,9,11]
console.log([...arr]); //[1,3,5,7,9,11]  using spread operator also do the same thing
```

## Splice Methhod
可以刪除既有元素並或加入新元素來改變原陣列的內容。
``` js
// splice method   splice(index,number,value)
let arr = [1, 3, 5, 7, 9, 11];
arr.splice(-1);
console.log(arr); //[1,3,5,7,9]
console.log(arr.splice(1, 2)); // [3,5]
console.log(arr); //[1,7,9]
```

## Reverse Method
將陣列順序反轉。
``` js
let arr = ['a', 'b', 'c', 'd', 'e']
let arr2 = ['f', 'g', 'h', 'i', 'j']
console.log(arr.reverse()); //['e', 'd', 'c', 'b', 'a']
console.log(arr); //['e', 'd', 'c', 'b', 'a']
```

## Concat Method
將陣列與陣列合併成新的陣列，此方法不會影響原陣列。   
``` js
let arr = ['a', 'b', 'c', 'd', 'e']
let arr2 = ['f', 'g', 'h', 'i', 'j']
const letters = arr.concat(arr2);
console.log(letters); //["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
console.log([...arr, ...arr2]); //["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
```

## Join Method
將陣列內的所有元素連接，並且回傳成字串。
``` js
let arr = ['a', 'b', 'c', 'd', 'e']
console.log(arr.join('-')) //a-b-c-d-e
```

## forEach Wtih Maps and Sets

``` js
const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'EURO'],
    ['GBP', 'Pound sterling'],
])

currencies.forEach(function(item, key, map) {
    console.log(`${key}:${item}`)
})
```

```js
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique) //{"USD", "GBP", "EUR"};
currenciesUnique.forEach(function(item,key,map){    //Set doesn't have key and index
    console.log(`${key}:${item}`);  //USD:USD GBP:GBP EUR:EUR
})  

```
