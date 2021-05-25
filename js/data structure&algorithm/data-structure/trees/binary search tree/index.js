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
    /// ================recursive way =========================
    // insert(val) {
    //     let node = new Node(val)
    //     if (!this.root) {
    //         this.root = node;
    //         return this;
    //     }
    //     let currentNode = this.root;
    //     function help(currentNode) {
    //         if (currentNode.val === val) return undefined
    //         if (val > currentNode.val) {
    //             if (!currentNode.right) return currentNode.right = node;
    //             currentNode = currentNode.right;
    //         } else {
    //             if (!currentNode.left) return currentNode.left = node;
    //             currentNode = currentNode.left;
    //         }
    //         return help(currentNode)
    //     }
    //     help(currentNode);
    //     return this;
    // }
    // ====================================================================
}

var Tree = new BinarySearchTree();
Tree.insert(10);
Tree.insert(5);
Tree.insert(13);
Tree.insert(11);
Tree.insert(2);
Tree.insert(16);
Tree.insert(16);
Tree.insert(7);

console.log(Tree.find(5))//Node {val: 5, left: Node, right: Node}

