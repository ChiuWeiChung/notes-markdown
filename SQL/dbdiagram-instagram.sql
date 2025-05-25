Table users {
  id SERIAL [pk,increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  username VARCHAR(30)
  bio VARCHAR(400)
  avatar VARCHAR(200)
  phone VARCHAR(25)
  email VARCHAR(40)
  password VARCHAR(50)
  status VARCHAR(15)
}

Table posts {
  id SERIAL [pk,increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  url VARCHAR(200)
  user_id INTEGER [ref:> users.id]
  caption VARCHAR(240)
  lat REAL
  lng REAL
}

Table comments {
  id SERIAL [pk,increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  content VARCHAR(240)
  user_id INTEGER [ref:> users.id]
  post_id INTEGER [ref:> posts.id]
}

Table likes {
  id SERIAL [pk,increment]
  created_at TIMESTAMP
  post_id INTEGER [ref:>posts.id]
  comment_id INTEGER [ref:>comments.id]
}

Table photo_tags {
  id SERIAL [pk,increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  user_id INTEGER [ref:> users.id]
  post_id INTEGER [ref:> posts.id]
  x INTEGER 
  y INTEGER

}

Table caption_tags {
  id SERIAL [pk,increment]
  user_id INTEGER [ref:> users.id]
  post_id INTEGER [ref:> posts.id]
}

Table hashtags {
  id SERIAL [pk,increment]
  created_at TIMESTAMP
  title VARCHAR(20)
}

TABLE hashtags_posts{
  id SERIAL [pk,increment]  
  hashtag_id INTEGER [ref: > hashtags.id]
  post_id  INTEGER [ref: > posts.id]
}

TABLE followers {
  id SERIAL [pk,increment]
  createdat TIMESTAMP
  leader_id INTEGER [ref:>users.id]
  follower_id INTEGER [ref:>users.id]
}


