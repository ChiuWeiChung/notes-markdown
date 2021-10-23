# 演算法筆記-代克思托演算法(Dijkstra's algorithm)

> 本文為[JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

## 甚麼是代克思托演算法?

是由荷蘭電腦科學家艾茲赫爾·戴克斯特拉在1956年發現的演算法，主要用途在 `尋找Graph內兩節點(Vertex)間的最短路徑` ，因此可以運用在GPS、傳染病路徑、交通訂票系統(尋找最便宜的車票)上面。

## 透過JavaScript實現-1. 建立Priority Queue

主要透過廣度優先搜尋(BFS)方法解決路徑問題，並且透過[PriorityQueue]()來決定每一次要拜訪節點(選擇擁有最短路徑的節點進行拜訪)，並計算起點經->節點->節點 `鄰居們` 的路徑是否較先前計算的短，並紀錄再distance物件內。

下方程式碼呈現出簡易的Priority Queue結構，透過Javascript內建的排列函式(Array.sort, 時間複雜度O(nlogn))，將每一階段擁有最短路徑的節點排在陣列第一位。

```js
class PriorityQueue {
    constructor() {
        this.queue = [];
    }
    enqueue(key, val) {
        this.queue.push({
            key,
            val
        });
        this.queue.sort((a, b) => a.val - b.val)
    }
    dequeue() {
        return this.queue.shift();
    }
}
const node = new PriorityQueue();
// node.enqueue("A", 10), node.enqueue("B", 3), node.enqueue("C", 6), node.enqueue("D", 4);
// console.log(node.queue)
//[{key: "B", val: 3}, {key: "D", val: 4}, {key: "C", val: 6},{key: "A", val: 10}];
```

## 透過JavaScript實現-2. 建立Graph

建立一個[Weighted Graph]()，儲存各節點與路徑資訊。

```js
class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1, vertex2, weight) {
        if (this.adjacencyList[vertex2] && this.adjacencyList[vertex1]) {
            this.adjacencyList[vertex1].push({
                node: vertex2,
                weight
            })
            this.adjacencyList[vertex2].push({
                node: vertex1,
                weight
            })
        }
    }
}
```

## 透過JavaScript實現-3. 建立Dijkstra function

在WeigthedGraph Class中建立Dijkstra function，並在內部建立一個稱為node的PriorityQueue用來作為下一個要拜訪節點的依據。

```js
class WeightedGraph {
    ...
    Dijkstra(start, end) {
        // node負責排程下一個要拜訪的節點
        const node = new PriorityQueue();
        // distance負責記錄由起點至各節點的最短路徑
        const distance = {};
        // 紀錄由起點至終點所經過的各個節點
        const previous = {};
        // 結束時將previous內的各節點轉為陣列存放於path之內
        const path = [];

        // 先將distance以及node內的資料初始化，最初階段時，僅起點的val為0，其他節點的val都設為Infinity
        for (let key in this.adjacencyList) {
            if (key === start) {
                distance[key] = 0;
                node.enqueue(key, 0)
            } else {
                distance[key] = Infinity;
                node.enqueue(key, Infinity)
            }
            // 由於尚未拜訪各節點，因此previous內的節點都設為null
            previous[key] = null;
        }
        // 透過while loop進行，當陣列內沒有物件時則停止
        while (node.queue.length) {
            // 將擁有最短路徑的節點從node內部傳入currentNode
            let currentNode = node.dequeue().key;

            //當遍歷的節點為終點時，則將最短路徑傳至path中，並停止迭代
            if (currentNode === end) {
                while (previous[currentNode]) {
                    path.push(currentNode);
                    currentNode = previous[currentNode];
                }
                break
            }
            // 當要遍歷的節點存在，且由起點至該節點的值不為Infinity時
            if (currentNode || distance[currentNode] !== Infinity) {
                // 確認該節點所擁有的鄰居節點
                for (let index in this.adjacencyList[currentNode]) {
                    let neighborNode = this.adjacencyList[currentNode][index];
                    let neighborName = neighborNode.node;
                    // 計算由起點至currentNode再到currentNode的鄰居節點的路徑
                    let distanceToNode = distance[currentNode] + neighborNode.weight;
                    // 倘若distanceToNode的值較低
                    if (distanceToNode < distance[neighborName]) {
                        // 1.更新distance內的資料
                        distance[neighborName] = distanceToNode;
                        // 2.更新最短路徑所需要經歷的節點
                        previous[neighborName] = currentNode;
                        // 3.將未來要拜訪的節點傳入node中
                        node.enqueue(neighborName, distanceToNode)
                    }
                }
            }
        }
        return path.concat(start).reverse()
    }
}
```

## 測試結果

假設要尋找路徑的Graph結構如下圖，只要了解節點的數量以及各節點之間的路徑，即可透過Graph內的addVertex以及addEdge建構出來，如下方程式碼

```js
//             
//  A---1.5---B  
//  | \     / |    
//  1  3   3  1
//  |   \ /   |   
//  C----D----E-------F
//    0.5  0.5    1

// ======新增節點==========
graph.addVertex("A"), graph.addVertex("B"), graph.addVertex("C"), graph.addVertex("D"), graph.addVertex("E"), graph.addVertex("F");
// ======新增Weighted Edge==========
graph.addEdge('A', 'B', 1.5), graph.addEdge('A', 'C', 1), graph.addEdge('A', 'D', 3), graph.addEdge('B', 'D', 3);
graph.addEdge('B', 'E', 1), graph.addEdge('C', 'D', 0.5), graph.addEdge('D', 'E', 0.5), graph.addEdge('E', 'F', 1),
// ======執行Dijkstra function，尋找A->F最短路徑========
graph.Dijkstra('A', 'F'); // ["A", "C", "D", "E", "F"]
```

## 優化Priority Queue
由於上述的Priority Queue是透過JavaScript內的Array.prototoype.sort來實現，其時間複雜度為O(n log n)，因此可以將PriorityQueue改寫成Binary Heap的形式，此時的時間複雜度可以減少為O(log n)。
```js
// 透過Binary Heap改寫Priority Queue

class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        let currentIndex = this.values.length;
        if (!currentIndex) return this.values.push(newNode);
        this.values.push(newNode);
        this.bubbleUp(currentIndex);
    }

    bubbleUp(index) {
        if (index === 0) return
        let parentIndex = index % 2 ? ((index - 1) / 2) : ((index - 2) / 2);
        if (this.values[parentIndex].priority >= this.values[index].priority) {
            [this.values[parentIndex], this.values[index]] = [this.values[index], this.values[parentIndex]];
            this.bubbleUp(parentIndex);
        }
    }


    dequeue() {
        let index = this.values.length - 1;
        let min = this.values[0];
        if (index === 0) {
            this.values.pop();
            return this.values;
        }
        if (index < 0) return undefined;
        this.values[0] = this.values.pop()
        this.bubbleDown(0)
        return min;
    }

    bubbleDown(index) {
        let childIndex = index * 2;
        let leftIndex = childIndex + 1;
        let rightIndex = childIndex + 2;
        let leftChild = this.values[leftIndex];
        let rightChild = this.values[rightIndex];

        if (leftChild !== undefined && rightChild !== undefined) {
            let nextIndex = this.values[leftIndex].priority < this.values[rightIndex].priority ? leftIndex : rightIndex;
            if (this.values[index].priority > this.values[nextIndex].priority) {
                [this.values[index], this.values[nextIndex]] = [this.values[nextIndex], this.values[index]]
                this.bubbleDown(nextIndex);
            }
        } else if (rightChild === undefined && leftChild !== undefined) {
            if (this.values[index].priority > leftChild.priority) {
                [this.values[index], this.values[leftIndex]] = [this.values[leftIndex], this.values[index]]
            }
        }
    }
}
```


<!-- ## Why is it useful

* GPS
* Network Routing - finds open shortest path for data
* Biology - used to model the spread of viruses among humans
* Airline tickets - finding cheapest route to your destination.

## The approach

1. Every time we look to visit a new node, we pick the node with the smallest known distance to visit first.
2. Once we've moved to the node we're going to visit, we look at each of its neighbors
3. For each neighboring node, we calculate the distance by summing the total edges that lead to the node we're checking from the starting node.
4. If the new total distance to a node is less than the previous total, we store the new shorter distance for that node.

## Pseudocode

* This function should accept a starting and ending vertex
* Create an object(we'll call it distances) and set each key to be every vertex in the adjacency list with a vlue of infinity, except for the starting vertex which should have a value of 0.
* After setting a vlue in the distance object, add each vertex with a priority of infinity to the priority queue, except the starting vertex, which should have a priority of 0 because that's where we begin.
* Create another object called previous and set each key to be every vertex in the adjacency list with a vlue of null.
* Start looping as long as there is anything in the priority queue.
    - dequeue a vertex from the priority queue.
    - If that vertex is the same as the ending vertex - we are done!
    - Otherwise loop through each value in the adjacency list at that vertex
        * Calculate the distance to that vertex from the starting vertex
        * if the distance is less than what is currently stored in our distances object
            * update the distances object with new lower distance
            * update the previous object to contain that vertex
            * enqueue the vertex with the total distance from the start node. -->
