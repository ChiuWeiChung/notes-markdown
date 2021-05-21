# Graph

#### From Wikipedia: A graph data structure consists of a finite (and possibly mutable) set of vertices or nodes or points, together with a set of unordered pairs of these vertices for an undirected graph or a set of ordered pairs for a directed graph.
* Nodes + Connections
* Social Networks
* Location/ Mapping
* Routing Algorithms
* Visual Hierarchy
* File System Optimizations
* EveryWhere!


## Types of Graphs

* Vertex - a node
* Edge - connection between nodes
* Directed and Undirected
* Weighted and Undrectied


## Terminology
```js        
//  C   F    A一E
//   \ / \  /
//    D 一 B
// 
```
## Undirected and Directed Graph
* Facebook: Undriected Graph
* Instagram: Directed Graph
#### To Be Done

## Weighted and Unweighted Graph

## How to achieve
* Adjacency Matrix
* Adjacency List

## Differences & Big O
* V : number of vertices
* E : number of edges

  Opertaion     | Adjacency List| Adjacency Matrix  |
  ----------    |:-------------:|:-----------------:|
  Add Vertex    |     O(1)      | O(V^2)            |
  Add Edge      |     O(1)      | O(1)              |
  Remove Vertex |     O(V+E)    | O(V^2)            |
  Remove Edge   |     O(E)      | O(1)              |
  Query         |     O(V+E)    | O(1)              |
  Storage       |     O(V+E)    | O(V^2)            |
  
## Adjacency List VS. Adjacency Matrix
* List: 1. Can tak up less space(in sparse graphs) 2. Faster to iterate over all edges 3. Can be slower to lookup specific edge
* Matrix: 1. Takes up more space(in sparse graphs). 2. Slower to iterate over all edges. 3. Faster to lookup specific edge.
#### We are going to use adjacency list because the real world tends to lend itself to sparse and larger graphs.