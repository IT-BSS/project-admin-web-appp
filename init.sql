-- Расширение для шифрования
\encoding UTF8
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Таблица пользователя
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_passport BYTEA,
    user_ban BOOLEAN DEFAULT FALSE
);

-- Таблица действия пользователя
CREATE TABLE user_action (
    action_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    action_type VARCHAR(50),
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ролей
CREATE TABLE role (
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL
);

-- Таблица организации
CREATE TABLE organization (
    org_id BIGSERIAL PRIMARY KEY,
    org_name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    org_phone VARCHAR(20),
    org_author_id BIGINT REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- Таблица связи пользователь–организация–роль
CREATE TABLE user_organization_role (
    user_role_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    org_id BIGINT NOT NULL REFERENCES organization(org_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    role_id BIGINT NOT NULL REFERENCES role(role_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    UNIQUE (user_id, org_id, role_id)
);

-- Индексы
CREATE INDEX idx_user_action_user_id ON user_action(user_id);
CREATE INDEX idx_user_organization_role_user_id ON user_organization_role(user_id);
CREATE INDEX idx_user_organization_role_org_id ON user_organization_role(org_id);
CREATE INDEX idx_user_organization_role_role_id ON user_organization_role(role_id);

INSERT INTO users (full_name, birth_date, user_email, user_phone, password_hash) 
VALUES
('Иванов Иван Иванович','1990-05-12','ivanov@example.com','+79991112233',crypt('pass1',gen_salt('bf'))),
('Петров Петр Петрович','1985-03-22','petrov@example.com','+79992223344',crypt('pass2',gen_salt('bf')));