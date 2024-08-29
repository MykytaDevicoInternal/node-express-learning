CREATE TABLE user_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  refresh_token TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)