// // ================
// function reverse(str) {
//     if (str.length === 0) return []
//     let newStr = str.slice(str.length - 1)
//     return newStr.concat(reverse(str.slice(0, str.length - 1)))
// }

// // ================

// function isPalindrome(str) {
//     function reverse(str) {
//         if (str.length === 0) return []
//         let newStr = str.slice(str.length - 1)
//         return newStr.concat(reverse(str.slice(0, str.length - 1)))
//     }
//     return reverse(str) === str
// }

// // "abcba"   Math.floor(str.length/2)
// // "aooooa"   Math.floor(str.length/2)-1

// // ================
// function isOdd(val) {
//     return val % 2 === 1 ? true : false
// }
// function overTen(val) {
//     return val > 10
// }
// function someRecursive(arr, callback) {
//     if (arr.length === 0) return false
//     if (callback(arr[0])) return true
//     return someRecursive(arr.slice(1), callback)
// }
// someRecursive([2, 4, 6, 8, 9], isOdd)

// // ================
// function flatten(arr) {
//     if (arr.length === 0) return arr
//     if (arr[0].length) {
//         return [...flatten(arr[0]), ...flatten(arr.slice(1))]
//     }
//     return [arr[0], ...flatten(arr.slice(1))]
// }


// flatten([1, 2, 3, [4, 5]]) // [1, 2, 3, 4, 5]
// flatten([1, [2, [3, 4], [[5]]]]) // [1, 2, 3, 4, 5]
// flatten([[1], [2], [3]]) // [1,2,3]
// flatten([[[[1], [[[2]]], [[[[[[[3]]]]]]]]]]) // [1,2,3

// // =================

// function capitalizeFirst(arr) {
//     if (arr.length === 0) return arr
//     let newStr = arr[0][0].toUpperCase().concat(arr[0].slice(1));

//     return [newStr, ...capitalizeFirst(arr.slice(1))]
// }
// // =================

// function nestedEvenSum(obj) {
//     let sum = 0;
//     // let newObj = {};
//     // let keys = Object.keys(obj)
//     function helper(obj) {
//         for (let key in obj) {
//             if (Object.keys(obj).length === 0) return
//             if (typeof obj[key] === "number") {
//                 // console.log('plus')

//                 sum += obj[key] % 2 === 0 ? obj[key] : 0
//             }
//             else if (typeof obj[key] === "object") {
//                 console.log('its an object')
//                 helper(obj[key])
//             }
//         }
//     }
//     helper(obj);
//     return sum;
// }

// // =================
// function capitalizeWords(arr) {
//     console.log(arr);
//     if (arr.length === 0) return []
//     return [arr[0].toUpperCase(), ...capitalizeWords(arr.slice(1))]
// }
// =================

function stringifyNumbers(obj) {
    function helper(item, key) {
        if (typeof item === "number") return { [key]: item.toString() }
        if (typeof item === "object" && Array.isArray(item)) return { item }
        if (typeof item === "object") return { [key]: loop(item) }
    }

    function loop(obj) {
        let newObj = { ...obj }
        for (let key in obj) {
            newObj = { ...newObj, ...helper(obj[key], key) }
        }
        return newObj;
    }
    return loop(obj);
}

// =================
// function stringifyNumbers(obj) {
//     if (!Object.keys(obj).length) return {};

//     const key = Object.keys(obj)[0];
//     const { [key]: val, ...left } = obj;

//     if (Number.isInteger(val)) {
//         obj[key] = String(val);
//     } else if (typeof val === 'object') {
//         obj[key] = stringifyNumbers(val);
//     }

//     return {
//         ...obj,
//         ...stringifyNumbers(left),
//     };
// }

// ==============================
// function stringifyNumbers(obj) {
//     var newObj = {};
//     for (var key in obj) {
//         if (typeof (obj[key]) === 'number') {
//             newObj[key] = obj[key].toString()
//         }
//         else if (typeof (obj[key]) === 'object' && !Array.isArray(obj[key])) {
//             newObj[key] = stringifyNumbers(obj[key])
//         }
//         else {
//             newObj[key] = obj[key];
//         }
//     }
//     return newObj;
// }

// let obj = {
//     num: 1,
//     test: [],
//     data: {
//         val: 4,
//         info: {
//             isRight: true,
//             random: 66
//         }
//     }
// }
// console.log(stringifyNumbers(obj))

//  ===============

function collectStrings(obj) {
    const arr = [];

    function helper(obj) {
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                arr.push(obj[key])
                console.log(`push key:${key}, value ${obj[key]}`)
            } else if (typeof obj[key] === "object") {
                helper(obj[key])
            }
        }
    }

    helper(obj);
    return arr
}


const obj = {
    stuff: "foo",
    data: {
        val: {
            thing: {
                info: "bar",
                moreInfo: {
                    evenMoreInfo: {
                        weMadeIt: "baz"
                    }
                }
            }
        }
    }
}

console.log(collectStrings(obj))