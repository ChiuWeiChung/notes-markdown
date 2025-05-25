const { BTree } = require('./index.js');

// 創建 B-tree (Max Degree = 4)
const btree = new BTree(3);

console.log('=== B-Tree 插入與刪除示例 (Max Degree = 3) ===\n');

// 插入操作示例
console.log('--- 插入操作 ---');

const sequence = [10, 20, 5, 6, 12, 30, 7, 17];
// const sequence = [8,9,10,11,15,16,17,18,20,23];
// const sequence = [5,10,15,20,25,28,30,31,32,33,35,40,45,50,55,60,65];
// const sequence = [5,15,25,28,31,32,35,45,55,65,10,30,33,50,60,20,40];

sequence.forEach((value, index) => {
  console.log(`步驟 ${index + 1}: 插入 ${value}`);
  btree.insert(value);
  btree.print();
  console.log('');
});

console.log('=== 插入完成後的 B-tree ===');
btree.print();
btree.inorderTraversal();



// // 刪除操作示例
console.log('\n--- 刪除操作 ---');
const deleteSequence = [6, 20, 7];

deleteSequence.forEach((value, index) => {
  console.log(`\n刪除步驟 ${index + 1}: 刪除 ${value}`);
  btree.delete(value);
  btree.print();
  btree.inorderTraversal();
});

console.log('\n=== 最終結果 ===');
btree.print();
btree.inorderTraversal();

// // 展示更複雜的例子
// console.log('\n\n=== 複雜序列示例 ===');
// const btree2 = new BTree(4);
// const complexSequence = [38, 22, 75, 4, 59, 91, 13, 44, 68, 27, 82, 9, 33, 56, 99, 2, 47, 70, 17, 63];

// console.log('插入序列:', complexSequence.join(', '));
// complexSequence.forEach(val => btree2.insert(val));

// console.log('\n插入後的 B-tree:');
// btree2.print();
// btree2.inorderTraversal();

// console.log('\n刪除一些值: 59, 22, 91');
// btree2.delete(59);
// btree2.delete(22);
// btree2.delete(91);

// console.log('\n刪除後的 B-tree:');
// btree2.print();
// btree2.inorderTraversal(); 