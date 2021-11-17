# 資料結構筆記-雜湊表 (Hash Table)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## 雜湊表介紹

雜湊表 (Hash Table) 是用來儲存 `key-value pairs` 的一種資料結構，有點類似陣列 (Array) ，但它的 `key` 並沒有順序可言，此外，雜湊表在 Search 、 Insert、Remove 方面的處理速度都比陣列 (Array) 快上許多; 幾乎所有的程式語言都具有類似Hash Table的資料結構(例如 Python 的Dictionary ，J avaScript 的 Object 以及 Map ， Java 的 Maps ， Ruby 的Hashes )。好的 Hash Table 必須具備:

* **確定性 (Deterministic)** :  
倘若兩個雜湊值不同，則這兩個雜湊值的原始輸入也不會一樣。

* **均勻分布 (uniform distribution)** :  
假設一個 Hash Table 的大小 (Size) 為 N ，並加入K組 ( K 小於 N ) 資料之後，每組資料都只能對應 Table 內所屬的 Slot (雜湊值都不一樣)，倘若不同 key 的資料對應相同的 Slot 時，這種情況稱為雜湊碰撞 (hash collision)。

## 雜湊碰撞 (hash collision) 以及如何盡量避免

如下方程式碼中的 hash functions ，不同的 key ( name 以及 weight )回傳了一樣的 index ，即是雜湊碰撞。倘若在函式內加入質數的話，可以讓碰撞的機率降低。

```js
// 沒有引入 Prime Number
function hash(key) {
    const size = 13;
    let total = 0;
    for (let char of key) {
        let value = char.charCodeAt(0) - 96;
        total = (total + value) % size;
    }
    return total;
}
hash('age') //0
hash('name') //7 
hash('weight') //7
```

```js
// 引入 Prime Number 後
function hash(key) {
    const size = 13
    let total = 0;
    let PRIME_NUMBER = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
        let char = key[i];
        let value = char.charCodeAt(0) - 96;
        total = (total * PRIME_NUMBER + value) % size;
    }
    return total;
}
hash('age') //0
hash('name') //12
hash('weight') //11
```

## 碰撞 (Collision) 發生時要如何處理?

可以透過 1. Separate Chaining 或是 2. Linear Probing 來處理。

* **Separate Chaining** :  
是將衝突的資料放在 Table 內的同一個 Slot ，

* **Linear Probing** :  
則是將衝突的資料放入相鄰且空的 Slot 。


## JavaScript 實現雜湊表 Set Method

在下方程式碼中，為了處理雜湊碰撞 (Hash Collision) 的情況，使用 Separate Chaining 的處理方式。

```js
class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }
    _hash(key) { //針對輸入的 key 來回傳雜湊值
        let total = 0;
        let WEIRD_PRIME = 31;
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            let char = key[i];
            let value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length
        }
        return total;
    }

    set(key, value) {
        let index = this._hash(key);
        // Separate Chaining ；當遇上雜湊衝突時，就在所對應的 Slot 陣列後端新增資料
        if (!this.keyMap[index]) this.keyMap[index] = []; 
        this.keyMap[index].push([key, value])
    }
}
```
## Get Method
存取 Table 內的 key 所對應的 value 。
```js
class HashTable {
    ...
    get(key) {
        let index = this._hash(key);
        if (!this.keyMap[index]) return undefined;
        return this.keyMap[index].find(el => el[0] === key)[1];
    }
}
```

## Keys and Values Method
用來回傳 Table 內所有的 key 以及 value (不重複)。

```js
class HashTable {
    ...
    values() {
        let valuesArr = [];
        this.keyMap.forEach(el => {
            if (el) {
                el.forEach(item => {
                    if (!valuesArr.includes(item[1])) valuesArr.push(item[1])
                })
            }
        })
        return valuesArr;
    }

    keys() {
        let keysArr = [];
        this.keyMap.forEach(el => {
            if (el) {
                el.forEach(item => {
                    if (!keysArr.includes(item[0])) keysArr.push(item[0])
                })
            }
        })
        return keysArr;
    }
}
```

## 測試結果

```js
const hash = new HashTable();
// 將 key-value pairs 加入 Table 內
hash.set('marron', '#800000')
hash.set('yellow', '#FFFF00')
hash.set('olive', '#808000')
hash.set('salmon', '#FA8072')
hash.set('lightcoral', '#F08080')
hash.set('mediumvioletred', '#C71585')
hash.set('plum', '#DDA0DD')
hash.set('purple', '#DDA0DD')
hash.set('violet', '#DDA0DD')
// 測試搜尋功能
hash.get('yellow'); //#FFFF00
// 測試回傳 key 以及 value 的功能
hash.keys(); //["yellow", "olive", "violet", "salmon", "marron", "plum", "lightcoral", "mediumvioletred", "purple"]
hash.values(); //["#FFFF00", "#808000", "#DDA0DD", "#FA8072", "#800000", "#F08080", "#C71585"]
```

## 雜湊表 (Hash table) 的時間複雜度

* Insert: O(1)
* Deletion: O(1)
* Access: O(1)

<!-- 

* Hash tables are used to store key-value pairs.
* They are likearrays, but the keys are not ordered.
* Unlike arrays, hash tables are fast for all of the following operations: finding values, adding new values, and removing values!

Nearly every programming language has some sort of hash table data structure. Because of their speed, has talbes are very commonly used! Python has Dictionaries, Javascript has Objects and Maps, Java, Go & Scala have Maps, Ruby has Hashes.

 ## What makes a good hash?
 * Fast (constant time).
 * Doesn't cluster outputs at specific indices, but distributes uniformly.
 * Deterministic (same input yeilds same output).

## Dealing with Collisions

1. Separate Chaining: Store multiple key-value pairs at the same index.
2. Linear Probing: Find a collision, we search through the array to find the next empty slot. -->
