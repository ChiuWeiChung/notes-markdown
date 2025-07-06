# PostgreSQL 學習筆記 - Common Table Expression(CTE) 與 View

* Defined with a `WITH` before the main query.
* Produces a table that we can refer to anywhere else.
* To make a query easier to understand.
* Recursive form used to write queries that are otherwise impossible to write.



下方為簡單的 Common Table Expression 例子

```sql
WITH tags AS (
	SELECT user_id, created_at FROM caption_tags
	UNION ALL
	SELECT user_id, created_at FROM photo_tags
)

SELECT username, tags.created_at
FROM users
JOIN tags AS tags ON tags.user_id = users.id 
WHERE tags.created_at < '2010-01-07';
```

## Recursive Common Table Expression

* Useful anytime you have a tree or graph-type data structure
* Must use a `UNION` keyword


```sql
WITH RECURSIVE countdown(val) AS (
	SELECT 3 AS val -- Initial, Non-recursive query
	UNION
	SELECT val - 1 FROM countdown WHERE val > 1
)

SELECT *
FROM countdown
```

**執行結果**：
|val integer |
|------------|
|3           |
|2           |
|1           |

### Illustration

1. Define the results and working tables
2. Run the initial non-recursive statement, put the results into the results table and working table.
3. Run the recursive statement replacing the table name 'countdown' with a reference to the working table.
4. If recursive statement returns some rows, append them to the results table and run recursion again.
5. If recursive statement returns no rows stop recursion.

## Why use Recursive CTE's

舉例說明，如臉書上的「你可能認識 ....」機制(我的朋友 B，他的好友是 C，但我不認識，系統就可以透過這個方式推薦我)

```sql
WITH RECURSIVE suggestions(leader_id, follower_id, depth) AS (
	SELECT leader_id, follower_id, 1 AS depth
	FROM followers
	WHERE follower_id = 1 -- find suggestion from id = 1
	UNION
	SELECT followers.leader_id, followers.follower_id, depth+1
	FROM followers
	JOIN suggestions ON suggestions.leader_id = followers.follower_id
	WHERE depth < 3
)

SELECT DISTINCT users.id, users.username
FROM suggestions
JOIN users ON users.id = suggestions.leader_id
WHERE depth > 1
LIMIT 5 
```

## Create a View

* Create a fake table that has rows from other tables.
* These can be exact rows as the exist on another table, or a computed value.
* Can reference the view in any place where we'd normally reference a able.
* View doesn't actually create a new table or move any data around.
* Doesn't have to be used for a union! Can compute absolutely any values.

```sql
CREATE VIEW tags AS (
	SELECT id, created_at, user_id, post_id, 'pohoto_tag' AS type FROM photo_tags
	UNION ALL
	SELECT id, created_at, user_id, post_id, 'caption_tag' AS type FROM caption_tags
)
```

### When to use View?

待補充

> Query that gets executed every time we refer to it

### Delete and Changing View

```sql
CREATE OR REPLACE VIEW recent_posts AS (
	SELECT * 
	FROM recent_post
	ORDER BY created_at DESC
	LIMIT 15
)
```

```sql
DROP VIEW recent_post
```


## Materialized View


Query that gets executed only at very specific times, but the results are saved and can be referenced without rerunning the query.

```plaintext
+---------------+   +--------------+   +---------------+
|     likes     |   |    posts     |   |   comments    |
+---------------+   +--------------+   +---------------+
| id (PK)       |   | id (PK)      |   | id (PK)       |
| user_id (FK)  |   | user_id (FK) |   | user_id (FK)  |
| post_id (FK)  |   | created_at   |   | post_id (FK)  |
| comment_id(FK)|   | url          |   | contents      |
| created_at    |   | updated_at   |   | created_at    |
| 			    |   | cation	   |   | updated_at    |
|   		    |   | lat		   |   |     		   |
| 		    	|   | lng		   |   |  			   |
+---------------+   +--------------+   +---------------+
```


For example, for each week, show th number of likes that posts and comments received. Use the post and comment created_at date, not when the like was receive.

```sql
SELECT
	date_trunc('week', COALESCE(posts.created_at, comments.created_at)) AS week,
	COUNT(posts.id) AS num_likes_for_posts,
	COUNT(comments.id) AS num_likes_for_comments
FROM likes
LEFT JOIN posts ON posts.id = likes.post_id
LEFT JOIN comments ON comments.id = likes.comment_id
GROUP BY week
ORDER BY week;
```

If we need to run the query all the time, and it takes so much time, it's way too frequent or way too long, we don't want to run this query all day long or repeatedly if it's going to take quite such a long time. We need to find some efficient way of running this query.

```sql
CREATE MATERIALIZED VIEW weekly_likes AS (
SELECT
	date_trunc('week', COALESCE(posts.created_at, comments.created_at)) AS week,
	COUNT(posts.id) AS num_likes_for_posts,
	COUNT(comments.id) AS num_likes_for_comments
FROM likes
LEFT JOIN posts ON posts.id = likes.post_id
LEFT JOIN comments ON comments.id = likes.comment_id
GROUP BY week
ORDER BY week
) WITH DATA;
```

If we modify any of this underlying data (likes/ posts/ comments table), that is not going to modify those kind of cached results that are currently stored inside postgres. we have to manually tell postgres that it needs to update the materialized view.

```sql
REFRESH MATERIALIZED VIEW weekly_likes
```

使用 Materialized View 的時機應該是在該 Query 內的資料變化不容易隨著時間而改變得相當頻繁。