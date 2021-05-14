


// function getDigit(num, index) {
//     const str = String(num)
//     const digit = str.length;
//     return str[digit - index-1]
// }

// Another way

function getDigit(num, index) {
    return Math.floor(Math.abs(num) / Math.pow(10, index) % 10)
}

// console.log(getDigit(4321, 3))

// ===================================================================

// function digitCount(num) {
//     return String(num).length
// }

// Another way  
function digitCount(num) {
    if (num === 0) return 1
    return Math.floor(Math.log10(num)) + 1
}

// console.log(digitCount(4321))

// ===================================================================
function mostDigits(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        let countDigits = digitCount(arr[i])
        max = max < countDigits ? countDigits : max
    }
    return max
}

// console.log(mostDigits([21,311,42,1,32]))
// ===================================================================


// Anotehr way

function radixSort(arr) {
    const loopTime = mostDigits(arr);
    for (let k = 0; k < loopTime; k++) {
        let digitBuckets = Array.from({ length: 10 }, () => []);
        console.log(`k:${k}`)
        for (let i = 0; i < arr.length; i++) {
            // console.log(getDigit(arr[i], k))
            let digit = getDigit(arr[i], k);
            digitBuckets[digit].push(arr[i])
        }
        console.log(digitBuckets)
        arr = [].concat(...digitBuckets)
        console.log(arr)
    }
    return arr
}


console.log(radixSort([43221, 1, 10, 9680, 577, 9420, 7, 5622]))
// console.log(radixSort([20,300,4000,1,5,7]))


function merge(arr1, arr2) {
    let index1 = 0;
    let index2 = 0;
    let loopTime = 0;

    let newArr = [];
    while (loopTime < (arr1.length + arr2.length)) {
        if (arr1[index1] <= arr2[index2] || !arr2[index2]) {
            newArr.push(arr1[index1])
            index1++;
        } else if (arr1[index1] > arr2[index2] || !arr1[index1]) {
            newArr.push(arr2[index2])
            index2++;
        }
        loopTime++

    }
    return newArr
}

// merge([4, 5, 6], [2, 4])

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    let middle = Math.floor(arr.length / 2);

    let left = mergeSort(arr.slice(0, middle));
    let right = mergeSort(arr.slice(middle, arr.length));

    return merge(left, right)
}

mergeSort([1,5,8,4,2,5,7,9,3,2,1])
