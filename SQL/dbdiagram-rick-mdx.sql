--- DBDiagram.io


Table users {
  id INTEGER [primary key]
  username varchar
  email varchar
  provider varchar
  created_at timestamp // default CURRENT_TIMESTAMP
}

Table posts {
  id INTEGER [primary key]
  title varchar
  file_path varchar
  cover_path varchar
  user_id INTEGER [ref:> users.id]
  category_id INTEGER [ref:>categories.id]
  visible boolean 
  created_at timestamp // default CURRENT_TIMESTAMP
  updated_at timestamp // default CURRENT_TIMESTAMP
}

Table post_memos {
  id INTEGER [primary key]
  post_id INTEGER [ref:>posts.id]
  block_id varchar
  start_offset INTEGER
  end_offset INTEGER 
}

TABLE categories {
  id INTEGER [primary key]
  name TEXT UNIQUE
}

Table tags {
  id INTEGER [primary key]
  name TEXT UNIQUE
}

TABLE post_tags {
  id INTEGER [primary key]
  post_id INTEGER [ref:> posts.id]
  tag_id INTEGER [ref:> tags.id]
}

--- SQL in PostgreSQL

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  email VARCHAR,
  provider VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, email)
);


CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR,
  file_path varchar,
  cover_path varchar,
  user_id INTEGER REFERENCES users(id),
  category_id INTEGER DEFAULT 1 REFERENCES categories(id) ON DELETE SET DEFAULT,
  visible BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_memos (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  block_id VARCHAR,
  start_offset INTEGER,
  end_offset INTEGER
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
