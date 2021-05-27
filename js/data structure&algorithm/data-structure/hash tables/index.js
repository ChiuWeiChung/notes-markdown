// function hash(key, arrayLen) {
//     let total = 0;

//     for (let char of key) {
//         let value = char.charCodeAt(0) - 96;
//         total = (total + value) % arrayLen;
//     }
//     return total;
// }

// console.log(hash('hello', 13));

// function hash(key, arrayLen) {
//     let total = 0;
//     let WEIRD_PRIME = 31;
//     for (let i = 0; i < Math.min(key.length, 100); i++) {
//         let char = key[i];
//         let value = char.charCodeAt(0) - 96;
//         total = (total * WEIRD_PRIME + value) % arrayLen;
//     }
//     return total;
// }

// console.log(hash('goodbye', 13));


class HashTable {  //With Separate Chaining
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }

    _hash(key) {
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
        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }
        this.keyMap[index].push([key, value])
    }


    get(key) {
        let index = this._hash(key);
        if (!this.keyMap[index]) return undefined;
        // for (let i = 0; i < this.keyMap[index].length; i++) {
        //     if (this.keyMap[index][i][0] === key) {
        //         return this.keyMap[index][i][1]
        //     }
        // }
        return this.keyMap[index].find(el => el[0] === key)[1];
    }

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

const hash = new HashTable();
// ==========When prime value===4 ===============
// hash.set('hello world','goodbye!!')
// hash.set('dogs','are cool')
// hash.set('cats','are fine!!')
// hash.set('i love','pizza')
// hash.set('hi','bye')
// console.log(hash.keyMap) //[Array(1), Array(3), empty, Array(1)]


hash.set('marron', '#800000')
hash.set('yellow', '#FFFF00')
hash.set('olive', '#808000')
hash.set('salmon', '#FA8072')
hash.set('lightcoral', '#F08080')
hash.set('mediumvioletred', '#C71585')
hash.set('plum', '#DDA0DD')
hash.set('purple', '#DDA0DD')
hash.set('violet', '#DDA0DD')

// hash.get('yellow'); //#FFFF00
hash.values(); //["#FFFF00", "#808000", "#DDA0DD", "#FA8072", "#800000", "#F08080", "#C71585"]
// hash.keys();//["yellow", "olive", "violet", "salmon", "marron", "plum", "lightcoral", "mediumvioletred", "purple"]