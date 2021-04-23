// function bubbleSort(arr) {

//     for (let i = 0; i < arr.length - 1; i++) {
//         let isSwap = false;
//         for (let j = 0; j < arr.length - i - 1; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//                 isSwap = true
//             }
//         }
//         if(!isSwap) break
//     }

//     return arr
// }


function selectSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i
        for (let j = i + 1; j < arr.length ; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }

    return arr
}

const arr = [44, 5, 38, 19, 47, 15]

// console.log(bubbleSort([11, 3, 54, 23, 2, 4, 5, 1]))
// console.log(bubbleSort([7, 3, 1, 5, 7, 2, 5, 22, 31]))
console.log(selectSort(arr))
console.log(selectSort([11, 3, 54, 23, 2, 4, 5, 1]))
console.log(selectSort([7, 3, 1, 5, 7, 2, 5, 22, 31]))