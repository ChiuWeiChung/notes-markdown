class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    addEdge(vertex1, vertex2) {
        let vt1 = this.adjacencyList[vertex1];
        let vt2 = this.adjacencyList[vertex2];
        if (vt1 && vt2) {
            vt1.push(vertex2);
            vt2.push(vertex1);
        }
    }

    removeEdge(vertex1, vertex2) {
        let vt1 = this.adjacencyList[vertex1];
        let vt2 = this.adjacencyList[vertex2];
        this.adjacencyList[vertex1] = vt1.filter(el => el !== vertex2);
        this.adjacencyList[vertex2] = vt2.filter(el => el !== vertex1);
    }

    removeVertex(vertex) {
        let listItem = this.adjacencyList[vertex];
        listItem.forEach(el => this.removeEdge(el, vertex));

        // =============Another way================
        // while (this.adjacencyList[vertex].length) {
        //     const adjacentVertex = this.adjacencyList[vertex].pop();
        //     this.removeEdge(adjacentVertex, vertex);
        // }
        // ==========================================
        delete this.adjacencyList[vertex];
    }
    depthFirstRecursive(start) {
        // if (!this.adjacencyList[start]) return undefined
        // const visitedObj = { [start]: true };
        // const result = [];
        // result.push(start);
        // const dfs = (vertex) => {
        //     this.adjacencyList[vertex].forEach((el) => {
        //         if (!visitedObj[el]) {
        //             result.push(el);
        //             visitedObj[el] = true;
        //             dfs(el)
        //         }
        //     })
        // }
        // dfs(start)

        // =============Anotoher Way==============
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

    depthFirstIterative(start) {
        if (!this.adjacencyList[start]) return null;
        let stack = [start];
        let visitedObj = {};
        let result = [];

        visitedObj[start] = true;

        while (stack.length !== 0) {
            console.log(stack);
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
        // using queue strcture
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

const graph = new Graph;

graph.addVertex('A')
graph.addVertex('B')
graph.addVertex('C')
graph.addVertex('D')
graph.addVertex('E')
graph.addVertex('F')
graph.addEdge('A', 'B')
graph.addEdge('A', 'C')
graph.addEdge('B', 'D')
graph.addEdge('C', 'E')
graph.addEdge('D', 'E')
graph.addEdge('D', 'F')
graph.addEdge('E', 'F')
// graph.adjacencyList;
// graph.depthFirstRecursive('A');
// graph.depthFirstIterative('A');
graph.breadthFirstSearch("A");

//========= Raw Data ============ Graph Structure ======
// A: (2) ["B", "C"]       |         A
// B: (2) ["A", "D"]       |       /   \ 
// C: (2) ["A", "E"]       |      B     C
// D: (3) ["B", "E", "F"]  |      |     |
// E: (3) ["C", "D", "F"]  |      D --- E 
// F: (2) ["D", "E"]       |       \   /
//                         |         F

// ===============Iterative way==========================
// visited={A}, stack=[A] , --> visited={A,B,C}, stack=[B, C]
// visited={A,B,C}, stack=[B, C]--> visited={A,B,C,E}, stack=[B, E]
// visited={A,B,C,E}, stack=[B, E]--> visited={A,B,C,E,D,F}, stack=[B, D, F]
// visited={A,B,C,E,D,F}, stack=[B, D, F]--> stack=[B, D]
// visited={A,B,C,E,D,F}, stack=[B, D]--> stack=[B]
// visited={A,B,C,E,D,F}, stack=[B]--> stack=[];

