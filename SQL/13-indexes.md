
==========================================================================================
section below should add mermaid illustration

### How an Index works?

#### Step 1: in creating an index is deciding which column we want to perform fast lookups on.

Let me explain what that means.

Earlier, we were discussing a query that tries to find a specific user by username.

So when we create an index, we create it on a specific column — the one we often use in filtering conditions.

In our case, we want an index on the **username** column, since that will allow us to quickly find users based on their username.

> ✅ We're building an index to speed up lookups **on the `username` column**.

Technically, indexes can include **multiple columns**, but for now, we’ll focus on a single-column index.

#### Step 2: Extract Values from the Heap File

Next, we go through the entire heap file (user table) and, for each row, we extract the value of the target column — in this case, the username.

Along with the username, we also record **where** that value came from — specifically, the **block number** and **index within the block**.

Example:
  - Nancy → Block 0, Index 1
  - Elf   → Block 0, Index 2
  - Gia   → Block 1, Index 1
  - Rick  → Block 1, Index 2

Importantly, we do **not** store any other data about the user in the index — no IDs, timestamps, bios, or avatars.
The index only contains:
  - The username
  - The corresponding block and index location

#### Step 3: Sort the Extracted Values

Once we have the values, we **sort** them.

- For strings, we sort alphabetically (A → Z).
- For numbers, we might sort ascending or descending.
- For dates, we could sort from earliest to latest.

In our case, we're sorting usernames alphabetically:
  - Elf
  - Gia
  - Nancy
  - Rick

#### Step 4: Build a Tree Data Structure (e.g., B-tree)

This is the most complex step.

We organize the sorted records into a **tree**, such as a B-tree.

If you're unfamiliar with trees, don’t worry — the diagram will help.

All records are inserted into **leaf nodes** in sorted order:
  - Elf
  - Gia
  - Nancy
  - Rick

We maintain alphabetical order from left to right.

#### Step 5: Add Helper Ranges to the Root Node

At the top of the tree is the **root node**, which contains **inequality ranges** that guide searches.

These inequalities describe which **leaf node** a search should go to, based on the value.

For example:
  - If the username is **≥ Elf** and **< Nancy**, go to the **left leaf node**
  - If the username is **≥ Nancy**, go to the **right leaf node**

This structure allows Postgres to **skip large portions** of the tree by evaluating a few conditions at the root.


#### Example: Using the Index

Suppose we search for user "Rick".

- Start at the root node.
- Evaluate the inequality ranges.
- Determine that "Rick" is **≥ Nancy**, so we go to the **right leaf node**.
- There, we find:
    - Rick → Block 1, Index 2

With this information, Postgres can go directly to:
  - Block 1
  - Index 2
  - And retrieve only that one record

✅ We skipped:
  - All of Block 0
  - The left leaf node
  - Any unrelated user data

#### Summary

An index allows us to:
  - Search for a specific record quickly
  - Avoid loading unnecessary blocks
  - Navigate using precomputed inequalities and sorted structure

The index tells us *exactly* where a record lives in the heap file.

→ And now that we understand how indexes work conceptually, we’ll move on to actually **creating** one in the next video.

section above should add mermaid illustration
========================================================================

## Creating an Index

```sql
CREATE INDEX ON users (username);
```

```sql
DROP INDEX users_username_idx;
```

To benchmarking the Queries w/ and w/o Index

```sql
EXPLAIN ANALYZE SELECT *
FROM users
WHERE username = 'Rick';
```


## Downsides of Indexes

Indexes: Great for Performance — But Not Always Free

We just saw how adding an index can dramatically improve the performance of a simple query.

At this point, it might seem tempting to create an index on every column of every table.

But in a real-world database, that’s not what we do — and here’s why.

⸻

Storage Cost of Indexes

When we create an index, we’re building a tree-like data structure behind the scenes.

For each row in our table:
	•	We extract the value of the indexed column
	•	And we store a pointer to that record’s location in the heap file (block number and offset)

This means:
➔ We’re duplicating a portion of the data, along with metadata.
➔ This structure is written to disk, not just kept in memory.
➔ It takes up physical storage space.

Example

Using pgAdmin, we can check the size of the table and the index:

```sql
SELECT pg_size_pretty(pg_relation_size('users'));            -- e.g., 880 kB
SELECT pg_size_pretty(pg_relation_size('users_username_idx')); -- e.g., 184 kB
```

At this small scale, 184kB for the index is negligible.

But imagine a real application where the users table is 80 GB.
That index might take 18 GB on its own!

That’s still manageable — but in hosted environments (e.g., managed Postgres services), storage often comes at a premium.

So if you have dozens of large indexes, you’re paying for it.

⸻

Write Performance Cost (INSERT / UPDATE / DELETE)

Every time you insert, update, or delete a record in a table, Postgres also has to:
	•	Update the corresponding index(es)

So if you insert 20 rows, Postgres performs:
	•	20 table inserts
	•	20 index updates (for each index!)

In write-heavy applications, having multiple indexes can significantly slow down write operations.

⸻

Postgres May Not Use the Index

Here’s something surprising:

➔ Just because an index exists doesn’t mean Postgres will use it.

Depending on:
	•	The query
	•	The data distribution
	•	The planner’s cost estimation

…Postgres might decide that a sequential scan is faster than using the index.

Practical Implication

You might end up:
	•	Paying for the storage of the index
	•	Slowing down writes
	•	Without any benefit, because the index isn’t used at all

That’s why, before adding an index, you should ask:

“Will this index actually be useful for the types of queries I expect to run?”

⸻

Summary: Don’t Index Everything

✅ Indexes can dramatically improve read performance

⚠️ But they come with:
	•	Additional storage cost
	•	Write penalties (on INSERT, UPDATE, DELETE)
	•	No guarantee of usage (Postgres might ignore it)

So, instead of indexing everything:
	•	Use them strategically
	•	Use tools like EXPLAIN to check query plans
	•	Monitor index size and usage


### 自動生成的 Index 

Postgres automatically creates an index for the primary key column of every table.
Postgres automatically creates an index for any 'unique' constraint

> These don't get listed under 'indexes' in PGAdmin

```sql
CREATE TABLE phones (
	id SERIAL PRIMARY KEY,
	name VARCHAR(20) UNIQUE
);
```
You realize that you have to find phones based on their name very often, and you want queries involving the name to be as fast as possible.  Actually we don't need create an index because there is alreaqdy a uniqueness check on that column. Postgres will have already created an index for us!






