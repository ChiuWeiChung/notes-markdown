# Hash Table

## What is a hash table

* Hash tables are used to store key-value pairs.
* They are likearrays, but the keys are not ordered.
* Unlike arrays, hash tables are fast for all of the following operations: finding values, adding new values, and removing values!

#### Nearly every programming language has some sort of hash table data structure. Because of their speed, has talbes are very commonly used! Python has Dictionaries, Javascript has Objects and Maps, Java, Go & Scala have Maps, Ruby has Hashes.

 

 ## What makes a good hash?
 * Fast (constant time).
 * Doesn't cluster outputs at specific indices, but distributes uniformly.
 * Deterministic (same input yeilds same output).

## Dealing with Collisions

1. Separate Chaining: Store multiple key-value pairs at the same index.
2. Linear Probing: Find a collision, we search through the array to find the next empty slot.

## Big O of Hash Table

* Insert: O(1)
* Deletion: O(1)
* Access: O(1)
