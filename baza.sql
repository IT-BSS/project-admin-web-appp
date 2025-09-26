-- PostgreSQL Database Initialization Script
-- Полностью реляционная архитектура без JSON полей

-- Создание базы данных с правильной кодировкой (выполнить отдельно, если создаете новую БД)
-- CREATE DATABASE your_database_name
--     WITH ENCODING 'UTF8'
--     LC_COLLATE = 'ru_RU.UTF-8'
--     LC_CTYPE = 'ru_RU.UTF-8'
--     TEMPLATE = template0;

-- Подключение к созданной базе данных и установка кодировки для сессии
SET client_encoding = 'UTF8';

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    fio VARCHAR(255) NOT NULL,
    birth_date DATE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    passport_data TEXT,
    is_in_db BOOLEAN DEFAULT false,
    is_manager BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица организаций
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    inn_kpp VARCHAR(50),
    organization_phone VARCHAR(50),
    organization_email VARCHAR(255),
    author_id UUID REFERENCES users(id),
    is_in_archive BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Справочник ролей
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ролей пользователя в организации
CREATE TABLE user_organization_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, organization_id, role_id)
);

-- Таблица сотрудников организации
CREATE TABLE organization_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(organization_id, user_id)
);

-- Таблица паспортов проектов
CREATE TABLE project_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    direction VARCHAR(255) NOT NULL,
    goals TEXT,
    goal_element_type VARCHAR(100),
    tasks TEXT,
    task_element_type VARCHAR(100),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица кластеров
CREATE TABLE clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    passport_id UUID REFERENCES project_passports(id),
    is_in_archive BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица модераторов кластеров
CREATE TABLE cluster_moderators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(cluster_id, moderator_id)
);

-- Таблица профилей кластеров
CREATE TABLE cluster_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    profile_name VARCHAR(255) NOT NULL,
    profile_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица профессий
CREATE TABLE professions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    position VARCHAR(255) NOT NULL, -- должность (название)
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица используемых технологий
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name_or_position VARCHAR(255) NOT NULL, -- название либо должность
    description TEXT,
    is_in_archive BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица уровней освоения технологий пользователем
CREATE TABLE user_tech_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tech_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) NOT NULL, -- например: 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessed_by UUID REFERENCES users(id),
    is_current BOOLEAN DEFAULT true,
    UNIQUE(user_id, tech_id)
);

-- Таблица проектов
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Таблица экспертов проектов
CREATE TABLE project_experts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(project_id, expert_id)
);

-- Таблица кураторов проектов
CREATE TABLE project_curators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    curator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(project_id, curator_id)
);

-- Таблица действий пользователя
CREATE TABLE user_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- тип действия
    action_description TEXT,
    target_entity_type VARCHAR(100), -- на какую сущность направлено действие (user, project, etc.)
    target_entity_id UUID, -- ID целевой сущности
    action_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Справочник типов действий
CREATE TABLE action_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь проектов с кластерами
CREATE TABLE project_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, cluster_id)
);

-- Связь пользователей с профессиями
CREATE TABLE user_professions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profession_id UUID REFERENCES professions(id) ON DELETE CASCADE,
    experience_years INTEGER,
    is_primary BOOLEAN DEFAULT false,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, profession_id)
);

-- Создание индексов для улучшения производительности
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_guid ON users(guid);
CREATE INDEX idx_users_is_manager ON users(is_manager);
CREATE INDEX idx_users_is_admin ON users(is_admin);

CREATE INDEX idx_organizations_guid ON organizations(guid);
CREATE INDEX idx_organizations_author_id ON organizations(author_id);

CREATE INDEX idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX idx_user_actions_date_time ON user_actions(action_date_time);
CREATE INDEX idx_user_actions_type ON user_actions(action_type);

CREATE INDEX idx_user_org_roles_user_id ON user_organization_roles(user_id);
CREATE INDEX idx_user_org_roles_org_id ON user_organization_roles(organization_id);
CREATE INDEX idx_user_org_roles_role_id ON user_organization_roles(role_id);

CREATE INDEX idx_user_tech_levels_user_id ON user_tech_levels(user_id);
CREATE INDEX idx_user_tech_levels_tech_id ON user_tech_levels(tech_id);

CREATE INDEX idx_cluster_moderators_cluster_id ON cluster_moderators(cluster_id);
CREATE INDEX idx_cluster_moderators_moderator_id ON cluster_moderators(moderator_id);

CREATE INDEX idx_project_experts_project_id ON project_experts(project_id);
CREATE INDEX idx_project_experts_expert_id ON project_experts(expert_id);

CREATE INDEX idx_project_curators_project_id ON project_curators(project_id);
CREATE INDEX idx_project_curators_curator_id ON project_curators(curator_id);

-- Создание триггеров для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Начальные данные для справочника ролей
INSERT INTO roles (role_name, description) VALUES
    ('Administrator', 'Системный администратор'),
    ('Manager', 'Менеджер проекта'),
    ('Developer', 'Разработчик'),
    ('Analyst', 'Аналитик'),
    ('Tester', 'Тестировщик'),
    ('Designer', 'Дизайнер'),
    ('DevOps', 'DevOps инженер'),
    ('Team Lead', 'Руководитель команды');

-- Начальные данные для технологий
INSERT INTO technologies (name_or_position, description) VALUES
    ('PostgreSQL', 'Реляционная база данных'),
    ('Python', 'Язык программирования'),
    ('JavaScript', 'Язык программирования для веб-разработки'),
    ('React', 'JavaScript библиотека для создания пользовательских интерфейсов'),
    ('Docker', 'Платформа контейнеризации'),
    ('Kubernetes', 'Система оркестрации контейнеров'),
    ('Git', 'Система контроля версий'),
    ('Linux', 'Операционная система'),
    ('Java', 'Язык программирования'),
    ('Node.js', 'JavaScript runtime для серверной разработки');

-- Начальные данные для профессий
INSERT INTO professions (position, description) VALUES
    ('Backend разработчик', 'Разработка серверной части приложений'),
    ('Frontend разработчик', 'Разработка пользовательского интерфейса'),
    ('DevOps инженер', 'Автоматизация процессов разработки и развертывания'),
    ('Data Scientist', 'Анализ данных и машинное обучение'),
    ('Project Manager', 'Управление проектами'),
    ('System Administrator', 'Администрирование систем'),
    ('QA Engineer', 'Обеспечение качества ПО'),
    ('UI/UX Designer', 'Дизайн пользовательского интерфейса'),
    ('Business Analyst', 'Бизнес-анализ'),
    ('Team Lead', 'Руководство командой разработки');

-- Начальные данные для типов действий
INSERT INTO action_types (code, name, description) VALUES
    ('LOGIN', 'Вход в систему', 'Пользователь вошел в систему'),
    ('LOGOUT', 'Выход из системы', 'Пользователь вышел из системы'),
    ('CREATE_PROJECT', 'Создание проекта', 'Создан новый проект'),
    ('UPDATE_PROJECT', 'Обновление проекта', 'Проект был обновлен'),
    ('DELETE_PROJECT', 'Удаление проекта', 'Проект был удален'),
    ('ASSIGN_ROLE', 'Назначение роли', 'Пользователю назначена роль'),
    ('REMOVE_ROLE', 'Удаление роли', 'У пользователя удалена роль'),
    ('UPDATE_PROFILE', 'Обновление профиля', 'Профиль пользователя обновлен'),
    ('CREATE_ORGANIZATION', 'Создание организации', 'Создана новая организация'),
    ('UPDATE_TECH_LEVEL', 'Обновление уровня технологии', 'Обновлен уровень владения технологией');

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Основная таблица пользователей системы';
COMMENT ON TABLE organizations IS 'Таблица организаций';
COMMENT ON TABLE roles IS 'Справочник ролей в системе';
COMMENT ON TABLE user_organization_roles IS 'Роли пользователей в организациях (многие ко многим)';
COMMENT ON TABLE technologies IS 'Справочник технологий';
COMMENT ON TABLE professions IS 'Справочник профессий';
COMMENT ON TABLE clusters IS 'Кластеры проектов';
COMMENT ON TABLE cluster_moderators IS 'Модераторы кластеров (многие ко многим)';
COMMENT ON TABLE project_passports IS 'Паспорта проектов';
COMMENT ON TABLE user_actions IS 'Журнал действий пользователей';
COMMENT ON TABLE project_experts IS 'Эксперты проектов (многие ко многим)';
COMMENT ON TABLE project_curators IS 'Кураторы проектов (многие ко многим)';
COMMENT ON TABLE user_tech_levels IS 'Уровни владения технологиями пользователями';
COMMENT ON TABLE user_professions IS 'Связь пользователей с профессиями';

-- Комментарии к важным полям
COMMENT ON COLUMN users.guid IS 'Публичный идентификатор пользователя';
COMMENT ON COLUMN users.is_in_db IS 'Флаг подтверждения наличия пользователя в базе';
COMMENT ON COLUMN user_tech_levels.proficiency_level IS 'Уровень владения: Beginner, Intermediate, Advanced, Expert';
COMMENT ON COLUMN user_actions.target_entity_type IS 'Тип сущности: user, project, organization, cluster, etc.';

-- Установка прав доступа (раскомментировать при необходимости)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;