class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // insert(val) {
    //     let node = new Node(val)
    //     if (!this.root) {
    //         this.root = node;
    //         return this;
    //     }
    //     let currentNode = this.root;
    //     function help(currentNode) {
    //         if (currentNode.val === val) return undefined
    //             if (val > currentNode.val) {
    //                 if (!currentNode.right) return currentNode.right = node;
    //                 currentNode = currentNode.right;
    //             } else {
    //                 if (!currentNode.left) return currentNode.left = node;
    //                 currentNode = currentNode.left;
    //             }
    //         return help(currentNode)
    //     }
    //     help(currentNode);
    //     return this;
    // }

    insert(val) {
        let newNode = new Node(val);
        if (!this.root) {
            this.root = newNode;
            return this
        }
        let currentNode = this.root;
        while (true) {
            if (val === currentNode.val) return undefined
            if (val > currentNode.val) {
                if (!currentNode.right) {
                    currentNode.right = newNode;
                    return this
                }
                currentNode = currentNode.right;
            } else if (val < currentNode.val) {
                if (!currentNode.left) {
                    currentNode.left = newNode;
                    return this
                }
                currentNode = currentNode.left;
            }
        }
    }

    find(val) {
        let currentNode = this.root;
        if (!currentNode) return false
        let found = false
        while (currentNode && !found) {
            if (val > currentNode.val) {
                currentNode = currentNode.right;
            } else if (val < currentNode.val) {
                currentNode = currentNode.left;
            } else {
                found = true;
            }
        }
        if (!found) return false
        return currentNode
    }

    BFS() {
        let data = [];
        let queue = [];
        let node = this.root;
        queue.push(node);
        // FIFO Queue (First In First Out)
        while (queue.length) {
            node = queue.shift();
            data.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return data;
    }
    // =======Structure============
    //          10
    //         /   \
    //        6    15
    //       / \     \
    //      3   8    20
    // ===============================
    // step : 0 data=[] queue=[10]
    // step : 1 data=[10] queue=[6,15]
    // step : 2 data=[10,6] queue=[15,3,8]
    // step : 3 data=[10,6,15] queue=[3,8,20]
    // step : 4 data=[10,6,15,3] queue=[8,20]
    // step : 5 data=[10,6,15,3,8] queue=[20]
    // step : 6 data=[10,6,15,3,8,20] queue=[]

    DFSPreOrder() {
        let currentNode = this.root;
        let data = [];
        if (!this.root) return data;

        function help(currentNode) {
            data.push(currentNode.val);
            if (currentNode.left) help(currentNode.left)
            if (currentNode.right) help(currentNode.right)
        }

        help(currentNode);
        return data;
    }

    DFSPostOrder() {
        // let queue = [];
        let data = [];
        let currentNode = this.root;
        if (!this.root) return data;

        function help(currentNode) {
            if (currentNode.left) help(currentNode.left)
            if (currentNode.right) help(currentNode.right)
            data.push(currentNode.val);
        }

        help(currentNode);
        return data;

    }

    //          10
    //         /   \
    //        6    15
    //       / \     \
    //      3   8    20
    //       \
    //        4
   
    DFSInOrder() {
        let data = [];
        let currentNode = this.root;

        function help(currentNode) {
            if (currentNode.left) help(currentNode.left);
            data.push(currentNode.val);
            if (currentNode.right) help(currentNode.right);
        }

        help(currentNode);
        return data;

    }



}

var Tree = new BinarySearchTree();
Tree.insert(10);
Tree.insert(6)
Tree.insert(15)
Tree.insert(3)
Tree.insert(8)
Tree.insert(20)

// console.log(Tree);
// console.log(Tree.find(5));
// console.log(Tree.BFS());
// [10,6,3,8,15,20]
// console.log(Tree.DFSPreOrder());
console.log(Tree.DFSPostOrder());
// console.log(Tree.DFSInOrder());


