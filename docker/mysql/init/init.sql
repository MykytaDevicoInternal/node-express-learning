-- Create a new database
CREATE DATABASE IF NOT EXISTS chatapp;

-- Create a new user and grant privileges
CREATE USER IF NOT EXISTS 'chatuser'@'%' IDENTIFIED BY 'Fishki123!';

-- Grant full privileges to the new user for the new database
GRANT ALL PRIVILEGES ON chatapp.* TO 'chatuser'@'%';

-- Apply changes
FLUSH PRIVILEGES;