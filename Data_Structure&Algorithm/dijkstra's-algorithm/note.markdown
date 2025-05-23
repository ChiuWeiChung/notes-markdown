# 演算法筆記-代克思托演算法(Dijkstra's algorithm)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。

## 甚麼是代克思托演算法?

是由荷蘭電腦科學家艾茲赫爾·戴克斯特拉在 1956 年發現的演算法，主要用途在 `尋找 Graph 內兩節點 (Vertex) 間的最短路徑` ，因此可以運用在 GPS 、傳染病路徑、交通訂票系統 (尋找最便宜的車票) 上面。

## 透過 JavaScript 實現- 1. 建立優先佇列 (Priority Queue)

主要透過廣度優先搜尋 (BFS) 方法解決路徑問題，並且透過 `PriorityQueue` 來決定每一次要拜訪節點 (選擇擁有最短路徑的節點進行拜訪) ，並計算**起點**->**節點**->**節點的鄰居們**整段路徑是否較先前計算的短，並紀錄再 `distance` 物件內。

下方程式碼呈現出簡易的優先佇列 (Priority Queue) 結構，透過 JavaScript 內建的排列函式( `Array.sort`, 時間複雜度 O (n log n) )，將每一階段擁有最短路徑的節點排在陣列第一位。

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

## 透過 JavaScript 實現- 2. 建立 Graph

建立一個 `Weighted Graph` ，儲存各節點與路徑資訊。

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

## 透過 JavaScript 實現- 3. 建立 Dijkstra function

在 WeigthedGraph Class 中建立 Dijkstra function ，並在內部建立一個稱為 `node` 的 PriorityQueue 用來作為下一個要拜訪節點的依據。

```js
class WeightedGraph {
    ...
    Dijkstra(start, end) {
        // node 負責排程下一個要拜訪的節點
        const node = new PriorityQueue();
        // distance 負責記錄由起點至各節點的最短路徑
        const distance = {};
        // 紀錄由起點至終點所經過的各個節點
        const previous = {};
        // 結束時將 previous 內的各節點轉為陣列存放於 path 之內
        const path = [];

        // 先將 distance 以及 node 內的資料初始化，最初階段時，僅起點的 val 為 0 ，其他節點的 val 都設為 Infinity
        for (let key in this.adjacencyList) {
            if (key === start) {
                distance[key] = 0;
                node.enqueue(key, 0)
            } else {
                distance[key] = Infinity;
                node.enqueue(key, Infinity)
            }
            // 由於尚未拜訪各節點，因此 previous 內的節點都設為 null 
            previous[key] = null;
        }
        // 透過 while loop 進行，當陣列內沒有物件時則停止
        while (node.queue.length) {
            // 將擁有最短路徑的節點從 node 內部傳入 currentNode
            let currentNode = node.dequeue().key;

            //當遍歷的節點為終點時，則將最短路徑傳至 path 中，並停止迭代
            if (currentNode === end) {
                while (previous[currentNode]) {
                    path.push(currentNode);
                    currentNode = previous[currentNode];
                }
                break
            }
            // 當要遍歷的節點存在，且由起點至該節點的值不為 Infinity 時
            if (currentNode || distance[currentNode] !== Infinity) {
                // 確認該節點所擁有的鄰居節點
                for (let index in this.adjacencyList[currentNode]) {
                    let neighborNode = this.adjacencyList[currentNode][index];
                    let neighborName = neighborNode.node;
                    // 計算由起點至 currentNode 再到 currentNode 的鄰居節點的路徑
                    let distanceToNode = distance[currentNode] + neighborNode.weight;
                    // 倘若 distanceToNode 的值較低
                    if (distanceToNode < distance[neighborName]) {
                        // 1. 更新 distance 內的資料
                        distance[neighborName] = distanceToNode;
                        // 2. 更新最短路徑所需要經歷的節點
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

假設要尋找路徑的 Graph 結構如下圖，只要了解節點的數量以及各節點之間的路徑，即可透過 Graph 內的 `addVertex` 以及 `addEdge` 建構出來，如下方程式碼。

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

## 優化 優先佇列 (Priority Queue)
由於上述的 優先佇列 (Priority Queue) 是透過 JavaScript 內的 `Array.prototoype.sort` 來實現，其時間複雜度為 O(n log n)，因此可以將優先佇列改寫成 [Binary Heap](https://github.com/ChiuWeiChung/notes-markdown/blob/main/data%20structure%26algorithm/data-structure/binary%20heaps/notes.markdown) 的形式，此時的時間複雜度可以減少為 O(log n)。

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