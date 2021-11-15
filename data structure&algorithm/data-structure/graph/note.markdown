# 資料結構筆記-圖 (Graph)

> 本文為[JavaScript Algorithms and Data Structures Masterclass](https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/)之課程筆記，部分程式碼非原創，內文敘述為課程內容吸收後，透過自己的理解歸納記錄下來。

圖 (Graph)的資料結構時常運用在 1. 社群網站 (Facebook, Instagram...) 2. 地圖系統 (Google map)，路徑計算等方面。

從[維基百科](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))的描述中對於圖 (Graph)的解釋為: 「 A graph data structure consists of a finite (and possibly mutable) set of `vertices` or nodes or points, together with a set of unordered pairs of these `vertices` for an `undirected` graph or a set of ordered pairs for a `directed` graph.」  

上面的解釋包含了許多的專有名詞，所以這裡針對專有名詞做紀錄:

* Vertex : 就是圖的節點 (node)。
* Edge : Vertex與Vertex之間的連結。
* Directed與Undirected: 對於Directed Graph而言，兩個vertex之間僅能進行單向溝通 (v1->v2)，對於Undirected Graph而言，兩個vertex之間可以雙向溝通 (v1->v2也可以v2->v1)。
* Weighted與Unweighted : 若Edge上有儲存資訊，則稱為Weighted Graph，若無則稱為Unweighted Graph。

### Directed Graph的應用
如Instagram，在A追蹤B，但B沒有追蹤A的情況下 (即A-->B)，因此A可以觀察到B所發出的貼文、動態，然而在B則無法觀察到A所發的貼文。

### Undirected Graph的應用
如Facebook，A與B互相是好友，也因此兩人所發出的貼文都可以互相被看到 (A<-->B)。另外在Weighted Graph的應用上如Google Map，倘若我要確認A點與B點之間的距離，負責連結A與的連結 (Edge)就會儲存著兩者的距離。

## 如何實現Graph(圖)

可以透過 1. Adjacency Matrix (鄰接矩陣) 或是 2. Adjacency List (鄰接表) 兩種方法。假設有一Graph共有6個vertex (A-F)，它們互相的關係可以透過下方兩種範例的方式呈現。

其中的Adjacency Matrix是以矩陣來表示各vertex之間的關係，對於鬆散的圖結構 (Sparse Graph)而言會佔據較多的記憶體，也因此在遍歷所有Edges時，會花上較多的時間，但在搜尋特定的Edge時後，它的時間複雜度為O (1)。

而Adjacency List是透過列表方式表示各vertex的關係，對於鬆散的圖結構而言，因為佔據較少的記憶體，在遍歷所有Edges時所花的時間較少，但是在搜尋特定的Edge時，它的時間複雜度為 (V+E)，其中V與E分別為Vertex與Edge的數量。

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

## JavaScript實現Graph(圖)

由於在現實生活上，透過Graph來描述現實生活上各種情況時，通常有很大機率傾向較鬆散的結構(Sparse Graph，也就是Vertex多，但Edge較少)，也因此在這裡透過Adjacency List方式來實現。

## 新增Vertex以及Edge

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

## 移除Vertex以及Edge

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

圖的遍歷可以透過 1. Breadth First Search或是 2. Depth First Search來實現。

```js
class Graph {
    ...
    //DFS透過遞迴方式實現
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

    //DFS也可以透過迭代方式(while)實現
    depthFirstIterative(start) {
        // 透過Stack控制遍歷的排程(Last In, First Out)
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
        // 透過Queue控制遍歷的排程(First In, First Out)
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

## 圖(Graph)的時間複雜度

  Opertaion     | Adjacency List| Adjacency Matrix  |
  ----------    |:-------------:|:-----------------:|
  Add Vertex    |     O(1)      | O(V^2)            |
  Add Edge      |     O(1)      | O(1)              |
  Remove Vertex |     O(V+E)    | O(V^2)            |
  Remove Edge   |     O(E)      | O(1)              |
  Query         |     O(V+E)    | O(1)              |
  Storage       |     O(V+E)    | O(V^2)            |
  

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
