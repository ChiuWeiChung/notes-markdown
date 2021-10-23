# Javascript中的內建函式 (Call, Bind, Apply)筆記

> 本文為[Jonas's JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

物件之間，可以透過call, bind, apply來調用自身沒有的函式，並綁定this keyword。

``` js
var john = {
    name: "John",
    age: 26,
    job: "teacher",
    presentation: function(style, timeofDay) {
        if (style === "formal") {
            console.log("Good " + timeofDay + ", Ladies and gentlement! I\'m " + this.name + ", I\'m a " + this.job + " and I\'m " + this.age + " years old")
        } else if (style === "friendly") {
            console.log("Hey What\'s up, I\'m " + this.name + ", I\'m a " + this.job + " and I\'m " + this.age + " years old, have a nice " + timeofDay)
        }
    }
}

var emily = {
    name: "Emily",
    age: 35,
    job: "designer"
}
```

call, apply會立即執行，第一個argument為欲綁定this的物件，call與apply的差別只在於apply在第二個argument形式為array

``` js
// -----   CALL METHOD  ----------------  call、 apply 皆是回傳function執行結果
john.presentation.call(emily, "friendly", "afternoon");
john.presentation.apply(emily, ["friendly", "afternoon"]);
```

透過bind將method做為值傳入變數中

``` js
// --------    BIND METHOD     ------------
var johnFriendly = john.presentation.bind(john, "friendly");
johnFriendly("afternoon"); //Hey What's up, I'm John, I'm a teacher and I'm 26 years old, have a nice afternoon
```
```js
var arr = [1933, 1965, 1998, 2001, 2014, 2009, 1979, 1978, 1992, 1973];

function arrayCal(arr, fn) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        newArr.push(fn(arr[i]))
    }
    return newArr;
};

function ageCal(el) {
    return 2020 - el;
};

function isFullAge(limit, el) {
    return el > limit;
}
var ages = arrayCal(arr, ageCal);
var fullJapan = arrayCal(ages, isFullAge.bind(this, 18));
```
