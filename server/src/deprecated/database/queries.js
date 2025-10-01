//queries.js
const { DB_NAME } = require('../utils/secrets')

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUsers = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(100) NULL,
    lastname VARCHAR(100) NULL,
    sex VARCHAR(10) NOT NULL,
    birth_day INT NULL,
    birth_month VARCHAR(20) NULL,
    birth_year INT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    is_email_confirmed TINYINT(1) NOT NULL DEFAULT 0,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ava_url VARCHAR(255) AS 
      (CASE 
        WHEN sex = 'Мужской' THEN 'https://i.imgur.com/4KQXvuq.jpg'
        WHEN sex = 'Женский' THEN 'https://i.imgur.com/eMJE152.jpg'
        ELSE NULL
      END)
  );
`;




const createTableTokens = `
CREATE TABLE IF NOT EXISTS tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    device_id VARCHAR(100) NOT NULL, -- Add device_id column for UUID
    access_token VARCHAR(1000) NOT NULL,
    refresh_token VARCHAR(1000) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
)
`;

const createTableResetPassword = `
CREATE TABLE IF NOT EXISTS resetPassword (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NULL,
    expires_on DATETIME NOT NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
)
`;

const createTableEmailConfirmed = `
CREATE TABLE IF NOT EXISTS email_confirmed (
    confirmed_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NULL,
    expires_on DATETIME NOT NULL,
    is_used TINYINT(1) NOT NULL DEFAULT 0,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
)
`;

const createTriggerAfterPasswordChange = `
CREATE TRIGGER delete_tokens_after_password_change
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.password <> OLD.password THEN
    DELETE FROM tokens WHERE user_id = OLD.user_id;
  END IF;
END;
`;

const createNewUser = `
INSERT INTO users 
(firstname, lastname, sex, birth_day, birth_month, birth_year, country, city, email, password, phone)
VALUES 
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const createNewToken = `
INSERT INTO tokens VALUES(null, ?, ?, ?, ?, NOW()) -- Add ?, to represent device_id
`;

const createResetToken = `
INSERT INTO resetPassword (user_id, token, expires_on)
VALUES (?, ?, ?);
`;

const createEmailConfirmedToken = `
INSERT INTO email_confirmed (user_id, token, expires_on)
VALUES (?, ?, ?);
`;

const findUserByEmail = `
SELECT * FROM users WHERE email = ?
`;

const findDataByAccessToken = `
SELECT user_id FROM tokens WHERE access_token = ?
`;

// Добавляем новый запрос для поиска refreshToken по deviceID
const findRefreshTokenByDeviceID = `
SELECT refresh_token FROM tokens WHERE device_id = ?;
`;

const findUserById = `
SELECT * FROM users WHERE user_id = ?
`;

const updateToken = `
UPDATE tokens 
SET 
  access_token = ?,
  refresh_token = ?,
  created_on = NOW()
WHERE 
  device_id = ?;
`;

const updatePassword = `
UPDATE users 
SET 
  password = ?
WHERE 
  user_id = ?;
`;

const usersTableAddAvaUrl = `
  ALTER TABLE users
ADD COLUMN ava_url VARCHAR(255) AS 
    (CASE 
        WHEN sex = 'Мужской' THEN 'https://i.imgur.com/4KQXvuq.jpg'
        WHEN sex = 'Женский' THEN 'https://i.imgur.com/eMJE152.jpg'
        ELSE NULL
    END);
`

module.exports = {
  createDB,
  dropDB,

  createTableUsers,
  createTableTokens,
  createTableResetPassword,
  createTableEmailConfirmed,

  createTriggerAfterPasswordChange,

  createNewUser,
  createNewToken,
  createResetToken,
  createEmailConfirmedToken,

  findUserByEmail,
  findDataByAccessToken,
  findRefreshTokenByDeviceID,
  findUserById,

  updateToken,
  updatePassword,
  usersTableAddAvaUrl
};
