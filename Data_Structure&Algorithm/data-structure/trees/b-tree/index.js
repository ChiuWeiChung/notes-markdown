class BTreeNode {
  constructor(isLeaf = true) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}

class BTree {
  constructor(maxDegree = 3) {
    this.maxDegree = maxDegree; // m
    this.root = new BTreeNode(true);
  }

  /* ---------- INSERT ---------- */
  insert(key) {
    const maxKeys = this.maxDegree - 1; // m-1

    // root 滿就先分裂
    if (this.root.keys.length >= maxKeys) {
      const res = this._split(this.root);
      const newRoot = new BTreeNode(false);
      newRoot.keys = [res.promote];
      newRoot.children = [res.left, res.right];
      this.root = newRoot;
    }
    this._insert(this.root, key);
  }

  _insert(node, key) {
    const maxKeys = this.maxDegree - 1;

    if (node.isLeaf) {
      let i = node.keys.length - 1;
      while (i >= 0 && key < node.keys[i]) i--;
      node.keys.splice(i + 1, 0, key);
    } else {
      let i = node.keys.length - 1;
      while (i >= 0 && key < node.keys[i]) i--;
      i++;

      if (node.children[i].keys.length >= maxKeys) {
        const res = this._split(node.children[i]);
        node.keys.splice(i, 0, res.promote);
        node.children.splice(i, 1, res.left, res.right);
        if (key > res.promote) i++; // 決定往左或右
      }
      this._insert(node.children[i], key);
    }
  }

  /* ---------- SPLIT ---------- */
  _split(node) {
    // **修正這裡：取較小中位數**
    const mid = Math.floor(this.maxDegree / 2) - 1;
    const promote = node.keys[mid];

    const left = new BTreeNode(node.isLeaf);
    const right = new BTreeNode(node.isLeaf);

    left.keys = node.keys.slice(0, mid);
    right.keys = node.keys.slice(mid + 1);

    if (!node.isLeaf) {
      left.children = node.children.slice(0, mid + 1);
      right.children = node.children.slice(mid + 1);
    }

    return { promote, left, right };
  }

  /* ---------- DEBUG PRINT ---------- */
  print(node = this.root, lvl = 0) {
    console.log('  '.repeat(lvl) + `[${node.keys.join(', ')}]`);
    node.children.forEach((c) => this.print(c, lvl + 1));
  }
}

/* --------- 測試 --------- */
const btree = new BTree(3); // 每節點最多 2 keys
[10, 20, 5].forEach((x) => btree.insert(x));
btree.print(); // 期望輸出：
/*
[10]
  [5]
  [20]
*/
