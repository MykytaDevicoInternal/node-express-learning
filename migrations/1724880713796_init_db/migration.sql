CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
); 

CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  creator_id INT,
  create_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (creator_id) REFERENCES users(id)
); 

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT,
  chat_id INT,
  creator_id INT,
  create_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status TINYINT(1) NOT NULL DEFAULT 1,
  forwarded_chat_id INT,
  forwarded_from_user_id INT,
  replied_message_id INT,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (forwarded_chat_id) REFERENCES chats(id) ON DELETE SET NULL,
  FOREIGN KEY (forwarded_from_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (replied_message_id) REFERENCES messages(id) ON DELETE SET NULL
); 

CREATE TABLE users_chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chat_id INT,
  user_id INT,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
