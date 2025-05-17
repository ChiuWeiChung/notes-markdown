# Subquery

## 本文會用下方的資料表作為範例：

```plaintext
+---------------+   +----------------+   +----------------+ 
|     users     |   |    products    |   |     orders     | 
+---------------+   +----------------+   +----------------+ 
| id (PK)       |   | id (PK)        |   | id (PK)        | 
| first_name    |   | name           |   | user_id (FK)   | 
| last_name     |   | department     |   | product_id (FK)| 
|               |   | price          |   | paid           |
|               |   | weight         |   | weight         |
+---------------+   +----------------+   +----------------+
```

List the name and price of all products that are more expensive than all products in the 'Toys' department

```sql
SELECT
  name,
  price
FROM
  products
WHERE
  price > (
    SELECT
      MAX(price)
    FROM
      products
    WHERE
      department = 'Toys'
  )
```

解釋：待補充



## Thinking About the Structure of Data

Subqueries can be used as ...

```sql
SELECT
  p1.name,
  (SELECT COUNT(name) FROM products)  -- A source of a value
FROM (SELECT * FROM products) AS p1 -- A source of rows
JOIN (SELECT * FROM products) AS p2 ON p1.id = p2.id -- A source of rows
WHERE p1.id IN (SELECT id FROM products); -- A source of a column
```

待補充 subquery 要如何解讀


> Gotcha: subquery in `FROM` must have an alias



### Exercise: 

Calculate the average price of phones for each manufacturer.  Then print the highest average price. Rename this value to max_average_price

For reference, here is the phones table:

| name         | manufacturer | price | units_sold |
|--------------|--------------|-------|------------|
| N1280        | Nokia        | 199   | 1925       |
| Iphone 4     | Apple        | 399   | 9436       |
| Galaxy S     | Samsung      | 299   | 2359       |
| S5620 Monte  | Samsung      | 250   | 2385       |
| N8           | Nokia        | 150   | 7543       |
| Droid        | Motorola     | 150   | 8395       |
| Wave S8500   | Samsung      | 175   | 9259       |

solution:

```sql
SELECT
  MAX(p.average_price) as max_average_price
FROM
  (
    SELECT
      AVG(price) as average_price
    FROM
      phones
    GROUP BY
      manufacturer
  ) AS p
```


## Subqueries in a `JOIN` clause

list the first_name of all the people who ordered the product with product_id =3 

```sql
SELECT
  first_name
FROM
  users
  JOIN (
    SELECT
      user_id
    FROM
      orders
    WHERE
      product_id = 3
  ) AS o ON o.user_id = users.id
```

or 

```sql
SELECT
  first_name
FROM
  users
  JOIN orders ON users.id = orders.user_id
WHERE
  product_id = 3;
```

## More Useful - Subqueries use case

Show the id of order that involve a product with a price/weight ratio greater than 50

```sql
SELECT
  id
FROM
  orders
WHERE
  product_id IN (
    SELECT
      id
    FROM
      products
    WHERE
      price / weight > 50
  )
```

## Data Structure with `WHERE` Subqueries

Show the name of all products with a price greater than the average product price.


```sql
SELECT
  name
FROM
  products
WHERE
  price > (
    SELECT
      AVG(price)
    FROM
      products
  )
```

## NOT IN 用法

Show the name of all products that are not in the same department as products with a price less than 100.

```sql
SELECT
  name
FROM
  products
WHERE
  department NOT IN (
    SELECT
      department
    FROM
      products
    WHERE
      price < 100
  )
```

## ALL 的用法
Show the name, department, and price of products that are more expensive than all products in the 'Industrial' department.

```sql
SELECT
  name,
  department,
  price
FROM
  products
WHERE
  price > ALL(
    SELECT
      price
    FROM
      products
    WHERE
      department = 'Industrial'
  )
```

## SOME 的用法

Show the name of products that are more expensive than at least one product in the 'Industrial' department.

```sql
SELECT
  name
FROM
  products
WHERE
  price > SOME (
    SELECT
      price
    FROM
      products
    WHERE
      department = 'Industrial'
  )
```

## Correlated Subquery

Show the name, department, and price of the most expensive product in each department

```sql
SELECT
  name,
  department,
  price
FROM
  products AS p1
WHERE
  p1.price = (
    SELECT
      MAX(price)
    FROM
      products AS p2
    WHERE
      p2.department = p1.department
  )
```
詳解待補充


Without using a join or a group by, print the number of orders for each product.

```sql
SELECT
  p1.name,
  (
    SELECT
      COUNT(*)
    FROM
      orders AS o1
    WHERE
      o1.product_id = p1.id
  ) AS num_orders
FROM
  products AS p1
```
詳解待補充


## Select Without a From

to do so ,A subquery should return a single value!

```sql
SELECT
  (
    SELECT
      MAX(price)
    FROM
      products
  )
``