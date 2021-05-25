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
                  // =======Structure============
Tree.insert(10);  //          10
Tree.insert(6)    //         /   \
Tree.insert(15)   //        6     15
Tree.insert(3)    //       / \    /  \
Tree.insert(8)    //      3   8  14  20
Tree.insert(20)   //         /  /    / \
Tree.insert(17)   //        7  12   17  31
Tree.insert(31)   //                /    /   
Tree.insert(28)   //               16   28   
Tree.insert(14)   // ===============================
Tree.insert(7)
Tree.insert(12)
Tree.insert(16)

// Tree.BFS(); //[10, 6, 15, 3, 8, 14, 20, 7, 12, 17, 31, 16, 28]
// Tree.DFSPreOrder(); //[10, 6, 3, 8, 7, 15, 14, 12, 20, 17, 16, 31, 28]
// Tree.DFSPostOrder(); //[3, 7, 8, 6, 12, 14, 16, 17, 28, 31, 20, 15, 10]
// Tree.DFSInOrder(); //[3, 6, 7, 8, 10, 12, 14, 15, 16, 17, 20, 28, 31]

