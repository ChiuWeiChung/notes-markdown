class BTreeNode {
  constructor(isLeaf = true) {
    this.keys = [];          // 存放鍵值（遞增）
    this.children = [];      // 子節點指標
    this.isLeaf = isLeaf;    // 是否為葉節點
    this.n = 0;              // 當前鍵值數量
  }
}

class BTree {
  constructor(maxDegree = 3) {   // Max Degree (每個節點最多 maxDegree-1 個鍵值)
    this.maxDegree = maxDegree;
    this.maxKeys = maxDegree - 1;  // 最多鍵值數量
    this.root = null;
  }

  // 插入鍵值
  insert(key) {
    if (this.root === null) {
      this.root = new BTreeNode(true);
      this.root.keys[0] = key;
      this.root.n = 1;
    } else {
      // 先插入到適當位置
      this.insertToNode(this.root, key);
      
      // 插入後檢查根節點是否需要分裂
      if (this.root.n > this.maxKeys) {
        this.splitRoot();
      }
    }
  }

  // 插入到節點
  insertToNode(node, key) {
    if (node.isLeaf) {
      // 葉節點：直接插入並保持排序
      let i = node.n - 1;
      while (i >= 0 && node.keys[i] > key) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
      node.n++;
    } else {
      // 內部節點：找到適當的子節點
      let i = 0;
      while (i < node.n && key > node.keys[i]) {
        i++;
      }

      // 遞歸插入到子節點
      this.insertToNode(node.children[i], key);
      
      // 插入後檢查子節點是否需要分裂
      if (node.children[i].n > this.maxKeys) {
        this.splitChild(node, i);
      }
    }
  }

  // 分裂根節點
  splitRoot() {
    const oldRoot = this.root;
    const newRoot = new BTreeNode(false);
    
    // 創建新的右子節點
    const rightChild = new BTreeNode(oldRoot.isLeaf);
    
    // 計算中間位置
    const middleIndex = Math.floor(oldRoot.n / 2);
    const middleKey = oldRoot.keys[middleIndex];
    
    // 右子節點獲得後半部分的鍵值
    for (let j = middleIndex + 1; j < oldRoot.n; j++) {
      rightChild.keys[j - middleIndex - 1] = oldRoot.keys[j];
    }
    rightChild.n = oldRoot.n - middleIndex - 1;
    
    // 左子節點保留前半部分的鍵值
    oldRoot.n = middleIndex;
    oldRoot.keys.length = middleIndex;
    
    // 如果不是葉節點，需要分配子節點
    if (!oldRoot.isLeaf) {
      // 右子節點獲得後半部分的子節點
      for (let j = middleIndex + 1; j <= oldRoot.children.length - 1; j++) {
        rightChild.children[j - middleIndex - 1] = oldRoot.children[j];
      }
      // 左子節點保留前半部分的子節點
      oldRoot.children.length = middleIndex + 1;
    }
    
    // 設置新根
    newRoot.keys[0] = middleKey;
    newRoot.n = 1;
    newRoot.children[0] = oldRoot;
    newRoot.children[1] = rightChild;
    
    this.root = newRoot;
  }

  // 分裂子節點
  splitChild(parent, index) {
    const fullChild = parent.children[index];
    const newChild = new BTreeNode(fullChild.isLeaf);
    
    // 計算中間位置
    const middleIndex = Math.floor(fullChild.n / 2);
    const middleKey = fullChild.keys[middleIndex];
    
    // 右子節點獲得後半部分的鍵值
    for (let j = middleIndex + 1; j < fullChild.n; j++) {
      newChild.keys[j - middleIndex - 1] = fullChild.keys[j];
    }
    newChild.n = fullChild.n - middleIndex - 1;
    
    // 左子節點保留前半部分的鍵值
    fullChild.n = middleIndex;
    fullChild.keys.length = middleIndex;
    
    // 如果不是葉節點，分配子節點
    if (!fullChild.isLeaf) {
      // 右子節點獲得後半部分的子節點
      for (let j = middleIndex + 1; j <= fullChild.children.length - 1; j++) {
        newChild.children[j - middleIndex - 1] = fullChild.children[j];
      }
      // 左子節點保留前半部分的子節點
      fullChild.children.length = middleIndex + 1;
    }
    
    // 在父節點中為新子節點騰出空間
    for (let j = parent.n; j > index; j--) {
      parent.children[j + 1] = parent.children[j];
    }
    parent.children[index + 1] = newChild;
    
    // 在父節點中插入中間鍵值
    for (let j = parent.n - 1; j >= index; j--) {
      parent.keys[j + 1] = parent.keys[j];
    }
    parent.keys[index] = middleKey;
    parent.n++;
  }

  // 刪除鍵值
  delete(key) {
    if (!this.root) {
      console.log("Tree is empty");
      return;
    }

    this.deleteFromNode(this.root, key);

    // 如果根節點變空了
    if (this.root.n === 0) {
      if (!this.root.isLeaf && this.root.children[0]) {
        this.root = this.root.children[0];
      } else {
        this.root = null;
      }
    }
  }

  // 從節點中刪除鍵值
  deleteFromNode(node, key) {
    const idx = this.findKey(node, key);

    if (idx < node.n && node.keys[idx] === key) {
      // 找到了要刪除的鍵值
      if (node.isLeaf) {
        this.removeFromLeaf(node, idx);
      } else {
        this.removeFromNonLeaf(node, idx);
      }
    } else {
      // 鍵值不在當前節點中
      if (node.isLeaf) {
        console.log(`Key ${key} not found in tree`);
        return;
      }

      // 判斷鍵值是否在子樹中
      const isInSubtree = (idx === node.n) ? true : false;

      // 如果子節點的鍵值數量等於最小值，需要先填充
      if (node.children[idx].n === Math.ceil(this.maxKeys / 2)) {
        this.fill(node, idx);
      }

      // 遞歸刪除
      if (isInSubtree && idx > node.n) {
        this.deleteFromNode(node.children[idx - 1], key);
      } else {
        this.deleteFromNode(node.children[idx], key);
      }
    }
  }

  // 查找鍵值在節點中的位置
  findKey(node, key) {
    let idx = 0;
    while (idx < node.n && node.keys[idx] < key) {
      idx++;
    }
    return idx;
  }

  // 從葉節點刪除鍵值
  removeFromLeaf(node, idx) {
    // 將後面的鍵值前移
    for (let i = idx + 1; i < node.n; i++) {
      node.keys[i - 1] = node.keys[i];
    }
    node.n--;
  }

  // 從非葉節點刪除鍵值
  removeFromNonLeaf(node, idx) {
    const key = node.keys[idx];

    if (node.children[idx].n > Math.ceil(this.maxKeys / 2)) {
      // 從左子樹獲取前驅
      const pred = this.getPredecessor(node, idx);
      node.keys[idx] = pred;
      this.deleteFromNode(node.children[idx], pred);
    } else if (node.children[idx + 1].n > Math.ceil(this.maxKeys / 2)) {
      // 從右子樹獲取後繼
      const succ = this.getSuccessor(node, idx);
      node.keys[idx] = succ;
      this.deleteFromNode(node.children[idx + 1], succ);
    } else {
      // 合併鍵值和右子節點
      this.merge(node, idx);
      this.deleteFromNode(node.children[idx], key);
    }
  }

  // 獲取前驅鍵值
  getPredecessor(node, idx) {
    let curr = node.children[idx];
    while (!curr.isLeaf) {
      curr = curr.children[curr.n];
    }
    return curr.keys[curr.n - 1];
  }

  // 獲取後繼鍵值
  getSuccessor(node, idx) {
    let curr = node.children[idx + 1];
    while (!curr.isLeaf) {
      curr = curr.children[0];
    }
    return curr.keys[0];
  }

  // 填充子節點
  fill(node, idx) {
    const minKeys = Math.ceil(this.maxKeys / 2);

    // 如果前一個兄弟節點有多餘的鍵值，從前面借
    if (idx !== 0 && node.children[idx - 1].n > minKeys) {
      this.borrowFromPrev(node, idx);
    }
    // 如果後一個兄弟節點有多餘的鍵值，從後面借
    else if (idx !== node.n && node.children[idx + 1].n > minKeys) {
      this.borrowFromNext(node, idx);
    }
    // 如果兄弟節點都沒有多餘的鍵值，合併
    else {
      if (idx !== node.n) {
        this.merge(node, idx);
      } else {
        this.merge(node, idx - 1);
      }
    }
  }

  // 從前一個兄弟節點借一個鍵值
  borrowFromPrev(node, childIdx) {
    const child = node.children[childIdx];
    const sibling = node.children[childIdx - 1];

    // 將父節點的鍵值下移到子節點
    for (let i = child.n - 1; i >= 0; i--) {
      child.keys[i + 1] = child.keys[i];
    }

    if (!child.isLeaf) {
      for (let i = child.n; i >= 0; i--) {
        child.children[i + 1] = child.children[i];
      }
    }

    child.keys[0] = node.keys[childIdx - 1];

    if (!child.isLeaf) {
      child.children[0] = sibling.children[sibling.n];
    }

    node.keys[childIdx - 1] = sibling.keys[sibling.n - 1];

    child.n++;
    sibling.n--;
  }

  // 從後一個兄弟節點借一個鍵值
  borrowFromNext(node, childIdx) {
    const child = node.children[childIdx];
    const sibling = node.children[childIdx + 1];

    child.keys[child.n] = node.keys[childIdx];

    if (!child.isLeaf) {
      child.children[child.n + 1] = sibling.children[0];
    }

    node.keys[childIdx] = sibling.keys[0];

    for (let i = 1; i < sibling.n; i++) {
      sibling.keys[i - 1] = sibling.keys[i];
    }

    if (!sibling.isLeaf) {
      for (let i = 1; i <= sibling.n; i++) {
        sibling.children[i - 1] = sibling.children[i];
      }
    }

    child.n++;
    sibling.n--;
  }

  // 合併子節點
  merge(node, idx) {
    const child = node.children[idx];
    const sibling = node.children[idx + 1];

    // 將父節點的鍵值和右兄弟的所有鍵值拉到左子節點
    child.keys[child.n] = node.keys[idx];

    for (let i = 0; i < sibling.n; i++) {
      child.keys[i + child.n + 1] = sibling.keys[i];
    }

    if (!child.isLeaf) {
      for (let i = 0; i <= sibling.n; i++) {
        child.children[i + child.n + 1] = sibling.children[i];
      }
    }

    // 將父節點的鍵值前移
    for (let i = idx + 1; i < node.n; i++) {
      node.keys[i - 1] = node.keys[i];
    }

    // 將子節點指針前移
    for (let i = idx + 2; i <= node.n; i++) {
      node.children[i - 1] = node.children[i];
    }

    child.n += sibling.n + 1;
    node.n--;
  }

  // 打印 B-tree（層序遍歷）
  print() {
    if (!this.root) {
      console.log('Empty B-Tree');
      return;
    }

    console.log(`B-Tree structure (Max Degree = ${this.maxDegree}):`);
    this.printLevel(this.root, 0);
  }

  // 遞歸打印每一層
  printLevel(node, level) {
    if (!node) return;

    const indent = '  '.repeat(level);
    const keys = node.keys.slice(0, node.n);
    const keyStr = keys.length > 0 ? keys.join(', ') : 'empty';
    console.log(`${indent}Level ${level}: [${keyStr}]${node.isLeaf ? ' (leaf)' : ''}`);

    if (!node.isLeaf) {
      for (let i = 0; i <= node.n; i++) {
        if (node.children[i]) {
          this.printLevel(node.children[i], level + 1);
        }
      }
    }
  }

  // 中序遍歷打印（排序輸出）
  inorderTraversal() {
    const result = [];
    if (this.root) {
      this.traverse(this.root, result);
    }
    console.log('Inorder traversal:', result.join(', '));
    return result;
  }

  traverse(node, result) {
    if (!node) return;

    let i = 0;
    for (i = 0; i < node.n; i++) {
      if (!node.isLeaf && node.children[i]) {
        this.traverse(node.children[i], result);
      }
      result.push(node.keys[i]);
    }
    
    if (!node.isLeaf && node.children[i]) {
      this.traverse(node.children[i], result);
    }
  }
}

module.exports = { BTree, BTreeNode };