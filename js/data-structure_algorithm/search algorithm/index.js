
function insertionSort(arr) {

    for (let i = 1; i < arr.length; i++) {
        let position = i;
        const value = arr[i];
        while (i >= 0 && arr[position - 1] > value) {
            [arr[position], arr[position - 1]] = [arr[position - 1], arr[position]]
            position--
            console.log(arr)
        }
    }
    return arr
}


function selectionSort(arr) {

    for (let i = 0; i < arr.length; i++) {
        let min = arr[i];
        let minIndex = i;
        for (let j = i; j < arr.length; j++) {
            if (min > arr[j]) {
                min = arr[j];
                minIndex = j;
            }
        }
        [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]
    }
    return arr
}

function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                console.log(arr)
            }
        }
    }
    return arr;
}

// [4, 3, 2, 1, 0]