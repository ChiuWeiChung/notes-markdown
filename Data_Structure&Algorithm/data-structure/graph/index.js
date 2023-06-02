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
}


const graph = new Graph;

graph.addVertex('Tokyo')
graph.addVertex('Dallas')
graph.addVertex('Aspen')
graph.addVertex('Los Angeles')
graph.addVertex('Hong Kong')
graph.addEdge('Tokyo', 'Dallas')
graph.addEdge('Aspen', 'Dallas')
graph.addEdge('Hong Kong', 'Tokyo')
graph.addEdge('Hong Kong', 'Dallas')
graph.addEdge('Los Angeles', 'Hong Kong')
graph.addEdge('Los Angeles', 'Aspen')
// console.log(graph.adjacencyList);
// graph.removeEdge('Tokyo', 'Dallas')
// console.log(graph.adjacencyList);
// graph.removeEdge('Aspen', 'Dallas')
console.log(graph.adjacencyList);
graph.removeVertex('Hong Kong')
console.log(graph.adjacencyList);