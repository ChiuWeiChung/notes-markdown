# 資料結構筆記-圖 (Graph)

> 本文為 [JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/) 之學習筆記，經自己理解歸納後以筆記形式記錄下來，部分程式碼非原創。

圖 (Graph)的資料結構時常運用在 1. 社群網站 (Facebook, Instagram...) 2. 地圖系統 (Google map)，路徑計算等方面。

從[維基百科](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))的描述中對於圖 (Graph) 的解釋為: 「 A graph data structure consists of a finite (and possibly mutable) set of `vertices` or nodes or points, together with a set of unordered pairs of these `vertices` for an `undirected` graph or a set of ordered pairs for a `directed` graph.」  

上面的解釋包含了許多的專有名詞，所以這裡針對專有名詞做紀錄:

* Vertex : 就是圖的節點 (node)。
* Edge :  vertex 與 Vertex 之間的連結。
* Directed 與 Undirected : 對於 Directed Graph 而言，兩個 vertex 之間僅能進行單向溝通 ( v1 -> v2 )，對於 Undirected Graph 而言，兩個 vertex 之間可以雙向溝通 ( v1 -> v2 也可以 v2 -> v1 )。
* Weighted與 Unweighted : 若 Edge 上有儲存資訊，則稱為 Weighted Graph ，若無則稱為 Unweighted Graph 。

### Directed Graph 的應用
如 Instagram ，在 A 追蹤 B ，但 B 沒有追蹤 A 的情況下 (即 A --> B )，因此 A 可以觀察到 B 所發出的貼文、動態，然而在 B 則無法觀察到 A 所發的貼文。

### Undirected Graph 的應用
如 Facebook ， A 與 B 互相是好友，也因此兩人所發出的貼文都可以互相被看到 ( A <--> B )。另外在 Weighted Graph 的應用上如 Google Map ，倘若我要確認 A 點與 B 點之間的距離，負責 A 與 B 的連結 (Edge) 就會儲存著兩者的距離。

## 如何實現 圖 (Graph)

可以透過 1. Adjacency Matrix (鄰接矩陣) 或是 2. Adjacency List (鄰接表) 兩種方法。假設有一 Graph 共有 6 個 vertex ( A - F )，它們互相的關係可以透過下方兩種範例的呈現。

### **Adjacency Matrix**

Adjacency Matrix 是以矩陣來表示各 vertex 之間的關係，對於鬆散的圖結構 (Sparse Graph) 而言會佔據較多的記憶體，也因此在遍歷所有 Edges 時，會花上較多的時間，但在搜尋特定的 Edge 時後，它的時間複雜度為 O (1)。

```js
//  ====Graph Structure====Adjacency Matrix方法====
//                            A  B  C  D  E  F
//            A               一 一 一 一 一 一
//          /   \          A |0  1  0  0  0  1
//         B     C         B |1  0  1  0  0  0
//         |     |         C |0  1  0  1  0  0
//         D     E         D |0  0  1  0  1  0
//          \   /          E |0  0  0  1  0  1
//            E            F |1  0  0  0  1  0
```

### **Adjacency List**

Adjacency List 是透過列表方式表示各 vertex 的關係，對於鬆散的圖結構而言，因為佔據較少的記憶體，在遍歷所有 Edges 時所花的時間較少，但是在搜尋特定的 Edge 時，它的時間複雜度為 O ( V + E )，其中 V 與 E 分別為 Vertex 與 Edge 的數量。


```js
//  ====Graph Structur====Adjacency List方法====
//            A       List={
//          /   \           "A":["B","C"],
//         B     C          "B":["A","D"],
//         |     |          "C":["A","E"],
//         D     E          "D":["B","F"],
//          \   /           "E":["C","F"],
//            F             "F":{"D","E"}
//                         } 
```

## JavaScript 實現 圖 (Graph)

由於在現實生活上，透過 Graph 來描述現實生活上各種情況時，通常有很大機率傾向較鬆散的結構 (Sparse Graph ，也就是 Vertex 多，但 Edge 較少) ，也因此在這裡透過 Adjacency List 方式來實現。

## 新增 Vertex 以及 Edge 

```js
class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    addEdge(vertex1, vertex2) {
        if (this.adjacencyList[vertex1] && this.adjacencyList[vertex2]) {
            this.adjacencyList[vertex1].push(vertex2)
            this.adjacencyList[vertex2].push(vertex1)
        }
    }
}
const graph = new Graph;
graph.addVertex("A"), graph.addVertex("B"), graph.addVertex("C")
graph.addVertex("D"), graph.addVertex("E"), graph.addVertex("F")
graph.addEdge("A", "B"), graph.addEdge("A", "C"), graph.addEdge("B", "D");
graph.addEdge("C", "E"), graph.addEdge("D", "F"), graph.addEdge("E", "F");
// A: (2) ["B", "C"]
// B: (2) ["A", "D"]
// C: (2) ["A", "E"]
// D: (2) ["B", "F"]
// E: (2) ["C", "F"]
// F: (2) ["D", "E"]
```

## 移除 Vertex 以及 Edge

```js
class Graph {
    ...
    removeEdge(vertex1, vertex2) {
        let vt1 = this.adjacencyList[vertex1];
        let vt2 = this.adjacencyList[vertex2];
        if (vt1 && vt2) {
            this.adjacencyList[vertex1] = vt1.filter(el => el !== vertex2);
            this.adjacencyList[vertex2] = vt2.filter(el => el !== vertex1);
        }
    }

    removeVertex(vertex) {
        if (this.adjacencyList[vertex]) {
            let list = this.adjacencyList[vertex];
            list.forEach(el => this.removeEdge(el));
            delete this.adjacencyList[vertex];
        }
    }
}
graph.removeEdge("A", "B");
// A: ["C"]
// B: ["D"]
// C: (2) ["A", "E"]
// D: (2) ["B", "F"]
// E: (2) ["C", "F"]
// F: (2) ["D", "E"]
graph.removeVertex("A");
// B: ["D"]
// C: ["E"]
// D: (2) ["B", "F"]
// E: (2) ["C", "F"]
// F: (2) ["D", "E"]
```

## 圖遍歷 (Graph Traversal)

圖的遍歷可以透過 1. Breadth First Search或是 2. Depth First Search 來實現。

```js
class Graph {
    ...
    //DFS 透過遞迴方式實現
    depthFirstRecursive(start) {
        let visitedObj = {};
        let result = [];
        const dfs = (vertex) => {
            if (!vertex) return null;
            visitedObj[vertex] = true;
            result.push(vertex);
            this.adjacencyList[vertex].forEach(el => {
                if (!visitedObj[el]) return dfs(el)
            })
        }
        dfs(start)
        return result;
    }

    //DFS 也可以透過迭代方式 (while) 實現
    depthFirstIterative(start) {
        // 透過 Stack 控制遍歷的排程 (Last In, First Out)
        if (!this.adjacencyList[start]) return null;
        let stack = [start];
        let visitedObj = {};
        let result = [];
        visitedObj[start] = true;
        while (stack.length !== 0) {
            let vertex = stack.pop();
            result.push(vertex);
            this.adjacencyList[vertex].forEach(el => {
                if (!visitedObj[el]) {
                    visitedObj[el] = true;
                    stack.push(el);
                }
            })
        }
        return result
    }

    breadthFirstSearch(start) {
        // 透過 Queue 控制遍歷的排程 (First In, First Out)
        if (!this.adjacencyList[start]) return null;
        const queue = [start];
        const result = [];
        const visitedObj = {};
        visitedObj[start] = true;
        while (queue.length) {
            let vertex = queue.shift();
            result.push(vertex);
            this.adjacencyList[vertex].forEach((el) => {
                if (!visitedObj[el]) {
                    visitedObj[el] = true;
                    queue.push(el);
                }
            })
        }
        return result
    }
}
```

## 圖 (Graph) 的時間複雜度

  Opertaion     | Adjacency List| Adjacency Matrix  |
  ----------    |:-------------:|:-----------------:|
  Add Vertex    |     O(1)     | O(V^2)           |
  Add Edge      |     O(1)     | O(1)             |
  Remove Vertex |     O(V+E)   | O(V^2)           |
  Remove Edge   |     O(E)     | O(1)             |
  Query         |     O(V+E)   | O(1)             |
  Storage       |     O(V+E)   | O(V^2)           |
  

> V : number of vertices, E : number of edges

<!-- ## Adjacency List VS. Adjacency Matrix

* List: 1. Can tak up less space(in sparse graphs) 2. Faster to iterate over all edges 3. Can be slower to lookup specific edge
* Matrix: 1. Takes up more space(in sparse graphs). 2. Slower to iterate over all edges. 3. Faster to lookup specific edge.

We are going to use adjacency list because the real world tends to lend itself to sparse and larger graphs. -->

<!-- ## 應用層面

* Nodes + Connections
* Social Networks
* Location/ Mapping
* Routing Algorithms
* Visual Hierarchy
* File System Optimizations
* EveryWhere! -->
