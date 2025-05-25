Id's of top five most liked posts
```sql
SELECT 
FROM posts
JOIN likes ON likes.post_id = posts.id
GROUP BY posts.id
ORDER BY count(*) DESC
LIMIT 5
```

URL of posts that user with id =4 liked
```sql
SELECT url
FROM likes
JOIN posts ON posts.id = likes.user_id
WHERE likes.user_id =4
```