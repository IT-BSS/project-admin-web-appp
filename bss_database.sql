--
-- PostgreSQL database dump
--

\restrict GFat8eb9fM7diMwfeyHP7e4cCYtZ5yOt0fzReU3LrC2hwT8hSDRXYnLEa2UPh6T

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: bss_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO bss_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: action_types; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.action_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.action_types OWNER TO bss_user;

--
-- Name: cluster_moderators; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.cluster_moderators (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cluster_id uuid,
    moderator_id uuid,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assigned_by uuid,
    is_active boolean DEFAULT true
);


ALTER TABLE public.cluster_moderators OWNER TO bss_user;

--
-- Name: TABLE cluster_moderators; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.cluster_moderators IS 'Модераторы кластеров (многие ко многим)';


--
-- Name: cluster_profiles; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.cluster_profiles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cluster_id uuid,
    profile_name character varying(255) NOT NULL,
    profile_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cluster_profiles OWNER TO bss_user;

--
-- Name: clusters; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.clusters (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    passport_id uuid,
    is_in_archive boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clusters OWNER TO bss_user;

--
-- Name: TABLE clusters; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.clusters IS 'Кластеры проектов';


--
-- Name: organization_employees; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.organization_employees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    organization_id uuid,
    user_id uuid,
    hired_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.organization_employees OWNER TO bss_user;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.organizations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    address text,
    inn_kpp character varying(50),
    organization_phone character varying(50),
    organization_email character varying(255),
    author_id uuid,
    is_in_archive boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.organizations OWNER TO bss_user;

--
-- Name: TABLE organizations; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.organizations IS 'Таблица организаций';


--
-- Name: professions; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.professions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "position" character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.professions OWNER TO bss_user;

--
-- Name: TABLE professions; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.professions IS 'Справочник профессий';


--
-- Name: project_clusters; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.project_clusters (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid,
    cluster_id uuid,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_clusters OWNER TO bss_user;

--
-- Name: project_curators; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.project_curators (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid,
    curator_id uuid,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assigned_by uuid,
    is_active boolean DEFAULT true
);


ALTER TABLE public.project_curators OWNER TO bss_user;

--
-- Name: TABLE project_curators; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.project_curators IS 'Кураторы проектов (многие ко многим)';


--
-- Name: project_experts; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.project_experts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid,
    expert_id uuid,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assigned_by uuid,
    is_active boolean DEFAULT true
);


ALTER TABLE public.project_experts OWNER TO bss_user;

--
-- Name: TABLE project_experts; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.project_experts IS 'Эксперты проектов (многие ко многим)';


--
-- Name: project_passports; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.project_passports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    direction character varying(255) NOT NULL,
    goals text,
    goal_element_type character varying(100),
    tasks text,
    task_element_type character varying(100),
    deadline date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_passports OWNER TO bss_user;

--
-- Name: TABLE project_passports; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.project_passports IS 'Паспорта проектов';


--
-- Name: projects; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid
);


ALTER TABLE public.projects OWNER TO bss_user;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO bss_user;

--
-- Name: TABLE roles; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.roles IS 'Справочник ролей в системе';


--
-- Name: technologies; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.technologies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name_or_position character varying(255) NOT NULL,
    description text,
    is_in_archive boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.technologies OWNER TO bss_user;

--
-- Name: TABLE technologies; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.technologies IS 'Справочник технологий';


--
-- Name: user_actions; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.user_actions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    action_type character varying(100) NOT NULL,
    action_description text,
    target_entity_type character varying(100),
    target_entity_id uuid,
    action_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address inet,
    user_agent text
);


ALTER TABLE public.user_actions OWNER TO bss_user;

--
-- Name: TABLE user_actions; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.user_actions IS 'Журнал действий пользователей';


--
-- Name: COLUMN user_actions.target_entity_type; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON COLUMN public.user_actions.target_entity_type IS 'Тип сущности: user, project, organization, cluster, etc.';


--
-- Name: user_organization_roles; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.user_organization_roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    organization_id uuid,
    role_id uuid,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assigned_by uuid,
    is_active boolean DEFAULT true
);


ALTER TABLE public.user_organization_roles OWNER TO bss_user;

--
-- Name: TABLE user_organization_roles; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.user_organization_roles IS 'Роли пользователей в организациях (многие ко многим)';


--
-- Name: user_professions; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.user_professions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    profession_id uuid,
    experience_years integer,
    is_primary boolean DEFAULT false,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_professions OWNER TO bss_user;

--
-- Name: TABLE user_professions; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.user_professions IS 'Связь пользователей с профессиями';


--
-- Name: user_tech_levels; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.user_tech_levels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    tech_id uuid,
    proficiency_level character varying(50) NOT NULL,
    assessed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assessed_by uuid,
    is_current boolean DEFAULT true
);


ALTER TABLE public.user_tech_levels OWNER TO bss_user;

--
-- Name: TABLE user_tech_levels; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.user_tech_levels IS 'Уровни владения технологиями пользователями';


--
-- Name: COLUMN user_tech_levels.proficiency_level; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON COLUMN public.user_tech_levels.proficiency_level IS 'Уровень владения: Beginner, Intermediate, Advanced, Expert';


--
-- Name: users; Type: TABLE; Schema: public; Owner: bss_user
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fio character varying(255) NOT NULL,
    birth_date date,
    email character varying(255),
    phone character varying(50),
    password_hash character varying(255) NOT NULL,
    passport_data text,
    is_in_db boolean DEFAULT false,
    is_manager boolean DEFAULT false,
    is_admin boolean DEFAULT false,
    access_token text,
    refresh_token text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    salt_password character varying(255)
);


ALTER TABLE public.users OWNER TO bss_user;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON TABLE public.users IS 'Основная таблица пользователей системы';


--
-- Name: COLUMN users.guid; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON COLUMN public.users.guid IS 'Публичный идентификатор пользователя';


--
-- Name: COLUMN users.is_in_db; Type: COMMENT; Schema: public; Owner: bss_user
--

COMMENT ON COLUMN public.users.is_in_db IS 'Флаг подтверждения наличия пользователя в базе';


--
-- Data for Name: action_types; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.action_types (id, code, name, description, created_at) FROM stdin;
8c04389f-f9f2-4218-ba9d-c717fe018007	LOGIN	Вход в систему	Пользователь вошел в систему	2025-09-26 03:48:09.707701
2158d5ad-3f03-4375-bf6c-0997b5d2e7c7	LOGOUT	Выход из системы	Пользователь вышел из системы	2025-09-26 03:48:09.707701
785625aa-ed1f-454e-9177-eb9bb66d5ffd	CREATE_PROJECT	Создание проекта	Создан новый проект	2025-09-26 03:48:09.707701
c4116d85-057d-4db4-9651-2038adb0a217	UPDATE_PROJECT	Обновление проекта	Проект был обновлен	2025-09-26 03:48:09.707701
22297b54-dcde-412d-a780-605c741e775f	DELETE_PROJECT	Удаление проекта	Проект был удален	2025-09-26 03:48:09.707701
15b0521b-ea5f-47cf-8177-86d24888e09c	ASSIGN_ROLE	Назначение роли	Пользователю назначена роль	2025-09-26 03:48:09.707701
f5790e1f-da5e-4310-9bf9-b67d04e1ad48	REMOVE_ROLE	Удаление роли	У пользователя удалена роль	2025-09-26 03:48:09.707701
c82d402c-cbdc-410c-acdc-f1c89a6abb0a	UPDATE_PROFILE	Обновление профиля	Профиль пользователя обновлен	2025-09-26 03:48:09.707701
fc543ccf-fa47-4186-b2f6-652f9b8eb092	CREATE_ORGANIZATION	Создание организации	Создана новая организация	2025-09-26 03:48:09.707701
cbbd1c67-bf64-43a3-a54b-f343c25fccdc	UPDATE_TECH_LEVEL	Обновление уровня технологии	Обновлен уровень владения технологией	2025-09-26 03:48:09.707701
\.


--
-- Data for Name: cluster_moderators; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.cluster_moderators (id, cluster_id, moderator_id, assigned_at, assigned_by, is_active) FROM stdin;
eb894383-3c29-4c72-8e14-d9b932bb076a	01ef3c9a-0554-46ff-a800-a0a5bdc640f1	97e98743-a91b-4702-8cc9-03ff3dad73b0	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
cac7a766-4bd4-43ae-85c3-085692dbd977	77f1968a-34f8-4f48-91fa-9bc43c1d3d90	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
3f8d7899-59f8-473e-a2fb-fe94552f31d8	6270952a-4f28-44b9-a0ac-e7344f22a5b5	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
\.


--
-- Data for Name: cluster_profiles; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.cluster_profiles (id, cluster_id, profile_name, profile_description, created_at) FROM stdin;
22633410-5195-4f39-8444-47e7527fd507	01ef3c9a-0554-46ff-a800-a0a5bdc640f1	Full-Stack профиль	Разработчики полного цикла веб-приложений	2025-09-26 03:54:57.288425
fec4db97-9c40-4d2f-8f7e-11e24df3303d	01ef3c9a-0554-46ff-a800-a0a5bdc640f1	Frontend профиль	Специалисты по пользовательским интерфейсам	2025-09-26 03:54:57.288425
0fc506e9-2277-42ab-a065-22c0eb4d6048	77f1968a-34f8-4f48-91fa-9bc43c1d3d90	iOS разработка	Разработка приложений для iOS	2025-09-26 03:54:57.288425
240784a8-2373-4610-b298-918b63897178	77f1968a-34f8-4f48-91fa-9bc43c1d3d90	Android разработка	Разработка приложений для Android	2025-09-26 03:54:57.288425
8a5e0125-2884-41ad-ba59-6876a076ab7e	6270952a-4f28-44b9-a0ac-e7344f22a5b5	Data Science профиль	Аналитики данных и специалисты по ML	2025-09-26 03:54:57.288425
\.


--
-- Data for Name: clusters; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.clusters (id, guid, name, description, passport_id, is_in_archive, created_at) FROM stdin;
01ef3c9a-0554-46ff-a800-a0a5bdc640f1	94a98633-5aff-445d-9273-e99338dbeb9b	Веб-технологии	Кластер проектов веб-разработки	f4ce11a8-236b-44d3-9ca3-66185ab72fc2	f	2025-09-26 03:54:57.288425
77f1968a-34f8-4f48-91fa-9bc43c1d3d90	10c58f59-90d1-4baa-a3e8-61d2a053d9bd	Мобильные технологии	Разработка мобильных приложений	b877f2e2-4a9d-4185-ac87-07c0d43b45f8	f	2025-09-26 03:54:57.288425
6270952a-4f28-44b9-a0ac-e7344f22a5b5	0b169f67-c83d-4096-9b5b-33ff6dade0c9	Анализ данных	Проекты по обработке и анализу данных	29bd05dd-0f76-4ad3-bf9f-8400e40adbce	f	2025-09-26 03:54:57.288425
\.


--
-- Data for Name: organization_employees; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.organization_employees (id, organization_id, user_id, hired_at, is_active) FROM stdin;
b32cb4bc-d46a-4849-87e2-15cd19d7542c	ee1a72d3-ddd9-4330-bfae-15f131086832	97e98743-a91b-4702-8cc9-03ff3dad73b0	2025-09-26 03:54:57.288425	t
396a9d28-703d-481b-9bc1-7aa1dca57c7f	ee1a72d3-ddd9-4330-bfae-15f131086832	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	2025-09-26 03:54:57.288425	t
81f81147-c5b6-4e55-9bf8-06d466b50eb0	ee1a72d3-ddd9-4330-bfae-15f131086832	1e39e5a2-786f-4665-96b9-cc0b9d480cb4	2025-09-26 03:54:57.288425	t
289d1d72-3e90-4ead-9032-09bbad07f765	33a5ae4e-a414-4c15-96c6-b020361af930	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	2025-09-26 03:54:57.288425	t
583aaab7-da12-4709-9b2a-6903c48fd5d2	33a5ae4e-a414-4c15-96c6-b020361af930	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	2025-09-26 03:54:57.288425	t
09d7edf9-3012-4c5d-bf9d-d801f9ab6267	33a5ae4e-a414-4c15-96c6-b020361af930	96acec9a-8a9e-4b1a-801a-63a01dd831c1	2025-09-26 03:54:57.288425	t
ef4c5ab0-621c-407b-b163-469c7d06a4bf	7c777106-c8b1-4674-9523-ee724fe823d5	923b03fd-b3b2-4981-8c0f-4d67fd33536c	2025-09-26 03:54:57.288425	t
fde95b91-bd8a-4fd1-afd6-d8781a2381cb	7c777106-c8b1-4674-9523-ee724fe823d5	0c0cdc7b-d9ad-4d82-ac84-cd859d3a00b7	2025-09-26 03:54:57.288425	t
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.organizations (id, guid, name, description, address, inn_kpp, organization_phone, organization_email, author_id, is_in_archive, created_at) FROM stdin;
ee1a72d3-ddd9-4330-bfae-15f131086832	9a813331-eed5-4faa-8168-707cb0804270	ООО "ТехноСофт"	Разработка программного обеспечения	Москва, ул. Тверская, д. 15	7701234567/770101001	+7 495 123-45-67	info@technosoft.ru	97e98743-a91b-4702-8cc9-03ff3dad73b0	f	2025-09-26 03:54:57.288425
33a5ae4e-a414-4c15-96c6-b020361af930	20caf33d-6501-4421-a854-7ccb621c9222	АО "ЦифраИнновации"	Цифровая трансформация бизнеса	СПб, Невский пр., д. 28	7802345678/780201002	+7 812 234-56-78	contact@cifra-innovation.ru	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	f	2025-09-26 03:54:57.288425
7c777106-c8b1-4674-9523-ee724fe823d5	52f9ff9f-49fe-4923-bebb-9dba3d952fb4	ИП Морозов А.Д.	Консультационные услуги по IT	Екатеринбург, ул. Ленина, д. 45	6661234567	+7 343 345-67-89	morozov.consulting@gmail.com	923b03fd-b3b2-4981-8c0f-4d67fd33536c	f	2025-09-26 03:54:57.288425
\.


--
-- Data for Name: professions; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.professions (id, guid, "position", description, created_at) FROM stdin;
a70383a2-a117-46f3-be78-392ea2c3ffbd	ec112899-b4da-47f1-b425-752841dd0e30	Backend разработчик	Разработка серверной части приложений	2025-09-26 03:48:09.707701
8998e713-2d49-470c-b474-185bba707d1c	a4455bfa-6f59-45b8-98f8-9b015d222d90	Frontend разработчик	Разработка пользовательского интерфейса	2025-09-26 03:48:09.707701
fbc9fecf-182e-4297-80d5-2329b7ba6986	1fe83963-b999-4292-9339-67ca63278a01	DevOps инженер	Автоматизация процессов разработки и развертывания	2025-09-26 03:48:09.707701
bc9841a9-38da-45e2-84c9-6bb1f40ae6ed	b73f39f7-21f4-45e7-8c6c-e8c1d80817a7	Data Scientist	Анализ данных и машинное обучение	2025-09-26 03:48:09.707701
a94da40b-2956-44f9-a850-c360e315200c	90932603-0985-469f-a4ae-23f7cbb34fe7	Project Manager	Управление проектами	2025-09-26 03:48:09.707701
dd2b8f7a-619d-4f72-8bde-aba58029cc05	b33fa408-9ffc-4602-941d-acc580065a04	System Administrator	Администрирование систем	2025-09-26 03:48:09.707701
918f9b0f-84be-4b41-848f-61fce313f9f9	c1e3a0d2-8442-4a35-979d-46bfffe6bb84	QA Engineer	Обеспечение качества ПО	2025-09-26 03:48:09.707701
512b0399-f061-4710-b7ae-21923607ba87	f41db6be-51a3-4149-8f85-df359800fdd4	UI/UX Designer	Дизайн пользовательского интерфейса	2025-09-26 03:48:09.707701
19886179-c727-4d81-9c32-8ddd0ec3d5da	919c0a01-b7c2-4f1f-baf2-23cb4c204a19	Business Analyst	Бизнес-анализ	2025-09-26 03:48:09.707701
b06224f1-2f29-4daa-9bdb-8c31b7a0b193	86f013b1-312b-4311-b2b1-68a39ef46266	Team Lead	Руководство командой разработки	2025-09-26 03:48:09.707701
\.


--
-- Data for Name: project_clusters; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.project_clusters (id, project_id, cluster_id, assigned_at) FROM stdin;
6dc83e0b-d0d2-4080-b2bc-add25791a887	5b5f75f6-dbbd-4bc9-8c55-57f1d75f4f67	01ef3c9a-0554-46ff-a800-a0a5bdc640f1	2025-09-26 03:54:57.288425
0285c12e-a92e-456d-934c-e66caa0b825a	96d4c9bd-ef84-4fca-b137-b63db4463e05	77f1968a-34f8-4f48-91fa-9bc43c1d3d90	2025-09-26 03:54:57.288425
af2c76f4-c479-4c75-9895-937d11f76dd6	efe48502-978a-40a4-9aaf-9e5000fca9b5	6270952a-4f28-44b9-a0ac-e7344f22a5b5	2025-09-26 03:54:57.288425
f865ba8b-f188-4d00-9e04-0b6e3e849111	3d5a5d02-e967-4acd-b832-b73b6c310de3	01ef3c9a-0554-46ff-a800-a0a5bdc640f1	2025-09-26 03:54:57.288425
5761117e-ef3e-4cf8-a101-5ce1e7ce4d13	ecdd8f66-c69a-4af8-9d46-af74e2248cc2	01ef3c9a-0554-46ff-a800-a0a5bdc640f1	2025-09-26 03:54:57.288425
\.


--
-- Data for Name: project_curators; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.project_curators (id, project_id, curator_id, assigned_at, assigned_by, is_active) FROM stdin;
8cc80600-0a7d-4aa5-833a-06c155bb3bd9	5b5f75f6-dbbd-4bc9-8c55-57f1d75f4f67	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
a4fab600-6821-4cb4-9928-1deb1232c099	96d4c9bd-ef84-4fca-b137-b63db4463e05	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
2ffeba05-69ad-4f3d-9bd4-e0e7d78cb2b5	efe48502-978a-40a4-9aaf-9e5000fca9b5	923b03fd-b3b2-4981-8c0f-4d67fd33536c	2025-09-26 03:54:57.288425	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	t
\.


--
-- Data for Name: project_experts; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.project_experts (id, project_id, expert_id, assigned_at, assigned_by, is_active) FROM stdin;
ff717bd6-f07f-4637-a8c2-1faf93a1762b	5b5f75f6-dbbd-4bc9-8c55-57f1d75f4f67	97e98743-a91b-4702-8cc9-03ff3dad73b0	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
de507a60-7379-412d-be00-7d6d741b1029	5b5f75f6-dbbd-4bc9-8c55-57f1d75f4f67	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
2b1e3309-cbaa-4036-9297-ce0874ed6570	96d4c9bd-ef84-4fca-b137-b63db4463e05	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
7508b04c-36fa-4901-bc12-0bab536ccea6	efe48502-978a-40a4-9aaf-9e5000fca9b5	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	2025-09-26 03:54:57.288425	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	t
9104da98-b155-4162-bf34-2b38929d0a95	3d5a5d02-e967-4acd-b832-b73b6c310de3	923b03fd-b3b2-4981-8c0f-4d67fd33536c	2025-09-26 03:54:57.288425	923b03fd-b3b2-4981-8c0f-4d67fd33536c	t
\.


--
-- Data for Name: project_passports; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.project_passports (id, guid, direction, goals, goal_element_type, tasks, task_element_type, deadline, created_at) FROM stdin;
f4ce11a8-236b-44d3-9ca3-66185ab72fc2	b1611c72-e7b2-43be-a54a-25705dedb934	Веб-разработка	Создание современного интернет-магазина с удобным интерфейсом	Бизнес-цель	Разработка фронтенда, бэкенда, интеграция платежей	Техническая задача	2024-12-31	2025-09-26 03:54:57.288425
b877f2e2-4a9d-4185-ac87-07c0d43b45f8	b80f261f-9b03-455d-abbe-d17b01b83795	Мобильная разработка	Разработка мобильного приложения для управления задачами	Продуктовая цель	UI/UX дизайн, разработка для iOS и Android	Дизайн-задача	2024-06-30	2025-09-26 03:54:57.288425
29bd05dd-0f76-4ad3-bf9f-8400e40adbce	a61abba6-40df-408a-aa74-25a043693553	Data Science	Создание системы аналитики и прогнозирования	Аналитическая цель	Сбор данных, машинное обучение, визуализация	Аналитическая задача	2024-09-15	2025-09-26 03:54:57.288425
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.projects (id, name, description, created_at, created_by) FROM stdin;
5b5f75f6-dbbd-4bc9-8c55-57f1d75f4f67	E-commerce Platform	Интернет-магазин с полным функционалом	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0
96d4c9bd-ef84-4fca-b137-b63db4463e05	Task Manager Mobile	Мобильное приложение для управления задачами	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5
efe48502-978a-40a4-9aaf-9e5000fca9b5	Analytics Dashboard	Дашборд для бизнес-аналитики	2025-09-26 03:54:57.288425	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0
3d5a5d02-e967-4acd-b832-b73b6c310de3	CRM System	Система управления клиентами	2025-09-26 03:54:57.288425	923b03fd-b3b2-4981-8c0f-4d67fd33536c
ecdd8f66-c69a-4af8-9d46-af74e2248cc2	Social Network API	API для социальной сети	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.roles (id, guid, role_name, description, created_at) FROM stdin;
856f67e6-cd7b-4543-8fe2-dd8614206f17	45d4c733-7025-4beb-a463-080bdb97c7e4	Administrator	Системный администратор	2025-09-26 03:48:09.707701
0f86696c-b9dd-400b-8a00-bb869d8d6d3f	3bb9a893-a045-4975-a616-5c1f9ab875f4	Manager	Менеджер проекта	2025-09-26 03:48:09.707701
66b8617b-452c-4f18-984e-24e2f9d208a7	0ff1282f-8a8a-4fc7-b5ba-ece40dc176ed	Developer	Разработчик	2025-09-26 03:48:09.707701
5701e9f9-7bb7-4394-ae7c-1bd7df7bbcd1	6c8b29a7-a5c9-4f87-b25a-8256fb32d550	Analyst	Аналитик	2025-09-26 03:48:09.707701
7eba5dce-0c52-4113-80f7-ba1253c5c6bc	ef34d7d0-a200-443b-bfc3-e2dcc820d468	Tester	Тестировщик	2025-09-26 03:48:09.707701
0e0ad048-c8e8-407b-a57f-bbc0b17d9df7	b4ac8f8d-253b-476b-8140-84071a3ce1c8	Designer	Дизайнер	2025-09-26 03:48:09.707701
3293bbf1-3691-4def-9988-d1c56e858d97	b7e8205e-99b9-45f0-8213-4a902cd1a86f	DevOps	DevOps инженер	2025-09-26 03:48:09.707701
c666be29-d3d2-4a68-ba16-676fedb2f701	4c88aafd-df7d-4ca3-8d69-ba621702ad41	Team Lead	Руководитель команды	2025-09-26 03:48:09.707701
\.


--
-- Data for Name: technologies; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.technologies (id, guid, name_or_position, description, is_in_archive, created_at) FROM stdin;
3ba32fc5-afff-476b-987d-c0364e7b6cfc	6c72771a-16a1-4a36-af0f-2535ffe0e06d	PostgreSQL	Реляционная база данных	f	2025-09-26 03:48:09.707701
466a95d2-d988-47d4-bc00-6871e8fba4c6	858b205a-a7c2-44dd-90b4-f65541ebbfc9	Python	Язык программирования	f	2025-09-26 03:48:09.707701
a5fcb2af-f10d-4a98-916a-15fda45b7f81	72e8e531-81f3-41e5-a6db-1d2064014f92	JavaScript	Язык программирования для веб-разработки	f	2025-09-26 03:48:09.707701
1b609e2d-b3d2-4e4b-9b47-a8ee1584df72	8b033dea-964e-48b0-ae64-c4f5545c3d01	React	JavaScript библиотека для создания пользовательских интерфейсов	f	2025-09-26 03:48:09.707701
d2eacb20-1c42-4662-9bf7-17b4bab888cf	53f5d1e4-97ad-48fe-b2b1-682a50f974a5	Docker	Платформа контейнеризации	f	2025-09-26 03:48:09.707701
48f7a179-b435-46a7-9971-68e0d46d957d	cbbf7412-9d48-4d6e-97b7-12c96d9fb438	Kubernetes	Система оркестрации контейнеров	f	2025-09-26 03:48:09.707701
557a6645-ba79-474f-ba31-b8c12907fa9e	671d54ef-e9b7-43c6-93ce-45486d67b460	Git	Система контроля версий	f	2025-09-26 03:48:09.707701
fa7e9186-e2da-47df-8905-c620ddef8644	a49222b4-d290-42a3-bc76-a8f728f3fa95	Linux	Операционная система	f	2025-09-26 03:48:09.707701
16be21e4-7685-45e3-97cc-249232e5f464	9c72e97a-484f-4501-849d-c68a0a062290	Java	Язык программирования	f	2025-09-26 03:48:09.707701
bb932c28-be76-4c11-b7f7-f65be8d8124d	93a44713-df03-44e4-be39-dcb744b88b76	Node.js	JavaScript runtime для серверной разработки	f	2025-09-26 03:48:09.707701
\.


--
-- Data for Name: user_actions; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.user_actions (id, guid, user_id, action_type, action_description, target_entity_type, target_entity_id, action_date_time, ip_address, user_agent) FROM stdin;
e725b286-4871-4358-99d9-4c0e576e81e4	034aea0c-2185-4f80-85e2-208a286e54ab	97e98743-a91b-4702-8cc9-03ff3dad73b0	LOGIN	Успешный вход в систему	user	97e98743-a91b-4702-8cc9-03ff3dad73b0	2025-09-26 03:54:57.288425	192.168.1.100	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
4396cda6-25e6-4938-8639-780bf9ef7f64	cd1a07a0-fbbf-4632-b890-b53dd4ab6161	97e98743-a91b-4702-8cc9-03ff3dad73b0	CREATE_PROJECT	Создан проект E-commerce Platform	project	5b5f75f6-dbbd-4bc9-8c55-57f1d75f4f67	2025-09-26 03:54:57.288425	192.168.1.100	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
b7a4c5db-dc84-4faf-8c46-d42d0b255c3d	1d3e4416-721f-4231-9698-39af86be4c7f	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	LOGIN	Успешный вход в систему	user	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	2025-09-26 03:54:57.288425	192.168.1.101	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
8d8f1b6d-ad81-4d20-bc92-665cf9457eba	2be3e906-01ba-400c-8568-c204fa7d4c67	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	CREATE_ORGANIZATION	Создана организация АО ЦифраИнновации	organization	33a5ae4e-a414-4c15-96c6-b020361af930	2025-09-26 03:54:57.288425	192.168.1.102	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36
6f5b5291-c7e2-4218-8aef-7a07d85d7cf7	2b03b44c-60e9-44c7-bf34-b53a93e0c28c	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	UPDATE_TECH_LEVEL	Обновлен уровень владения Python	technology	466a95d2-d988-47d4-bc00-6871e8fba4c6	2025-09-26 03:54:57.288425	192.168.1.103	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
\.


--
-- Data for Name: user_organization_roles; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.user_organization_roles (id, user_id, organization_id, role_id, assigned_at, assigned_by, is_active) FROM stdin;
7947d35d-215e-4709-a7cc-f9ff3ca5c8ef	97e98743-a91b-4702-8cc9-03ff3dad73b0	ee1a72d3-ddd9-4330-bfae-15f131086832	856f67e6-cd7b-4543-8fe2-dd8614206f17	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
78a2dd06-9b89-4d48-a3ac-c63757df508f	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	ee1a72d3-ddd9-4330-bfae-15f131086832	66b8617b-452c-4f18-984e-24e2f9d208a7	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
d809e34e-350b-49f2-9b25-a93c92213e80	1e39e5a2-786f-4665-96b9-cc0b9d480cb4	ee1a72d3-ddd9-4330-bfae-15f131086832	0e0ad048-c8e8-407b-a57f-bbc0b17d9df7	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
47808c99-155d-44df-b3db-ec7ac29b620c	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	33a5ae4e-a414-4c15-96c6-b020361af930	0f86696c-b9dd-400b-8a00-bb869d8d6d3f	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
4a6290b9-c88a-41f4-94b7-a059751a56d0	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	33a5ae4e-a414-4c15-96c6-b020361af930	5701e9f9-7bb7-4394-ae7c-1bd7df7bbcd1	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
890bbb12-43e2-4969-8bc4-43689fb51c19	96acec9a-8a9e-4b1a-801a-63a01dd831c1	33a5ae4e-a414-4c15-96c6-b020361af930	7eba5dce-0c52-4113-80f7-ba1253c5c6bc	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
\.


--
-- Data for Name: user_professions; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.user_professions (id, user_id, profession_id, experience_years, is_primary, assigned_at) FROM stdin;
e9abcfba-1c47-4662-9aa8-eb5116c4f420	97e98743-a91b-4702-8cc9-03ff3dad73b0	dd2b8f7a-619d-4f72-8bde-aba58029cc05	8	t	2025-09-26 03:54:57.288425
23c8b116-2073-4970-8440-e08103b227ba	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	8998e713-2d49-470c-b474-185bba707d1c	5	t	2025-09-26 03:54:57.288425
da9dcd18-60d7-4a0b-9190-33b0dadb4963	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	a94da40b-2956-44f9-a850-c360e315200c	7	t	2025-09-26 03:54:57.288425
467c3ce1-4c6c-4635-8655-00176c21dfce	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	19886179-c727-4d81-9c32-8ddd0ec3d5da	6	t	2025-09-26 03:54:57.288425
4b895877-cdac-43aa-ad3a-ddd415248a97	1e39e5a2-786f-4665-96b9-cc0b9d480cb4	512b0399-f061-4710-b7ae-21923607ba87	3	t	2025-09-26 03:54:57.288425
8c1a0498-6d8d-4516-be0b-06bb40ebd7da	923b03fd-b3b2-4981-8c0f-4d67fd33536c	a70383a2-a117-46f3-be78-392ea2c3ffbd	9	t	2025-09-26 03:54:57.288425
5e61b6b4-0707-4738-a376-e989ff7eb5b0	96acec9a-8a9e-4b1a-801a-63a01dd831c1	918f9b0f-84be-4b41-848f-61fce313f9f9	4	t	2025-09-26 03:54:57.288425
8be32f44-9b7b-4f25-b5ae-4833d4d29a92	0c0cdc7b-d9ad-4d82-ac84-cd859d3a00b7	fbc9fecf-182e-4297-80d5-2329b7ba6986	6	t	2025-09-26 03:54:57.288425
\.


--
-- Data for Name: user_tech_levels; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.user_tech_levels (id, user_id, tech_id, proficiency_level, assessed_at, assessed_by, is_current) FROM stdin;
81278b4c-0b9a-4d81-ade0-3ff07df81037	97e98743-a91b-4702-8cc9-03ff3dad73b0	3ba32fc5-afff-476b-987d-c0364e7b6cfc	Advanced	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
d8495487-7798-4458-aff9-68a05c5d8c86	97e98743-a91b-4702-8cc9-03ff3dad73b0	bb932c28-be76-4c11-b7f7-f65be8d8124d	Expert	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
3524aaef-f787-4322-a18b-78bfe5826b44	97e98743-a91b-4702-8cc9-03ff3dad73b0	d2eacb20-1c42-4662-9bf7-17b4bab888cf	Advanced	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
367e64cd-6f04-47a5-84c1-988ddc97d88e	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	a5fcb2af-f10d-4a98-916a-15fda45b7f81	Advanced	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
9964c076-6345-46e2-87f7-8bb3cbd1fde0	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	1b609e2d-b3d2-4e4b-9b47-a8ee1584df72	Expert	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
2c94f4eb-0283-4c9e-959e-25e4b2c90175	dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	557a6645-ba79-474f-ba31-b8c12907fa9e	Advanced	2025-09-26 03:54:57.288425	97e98743-a91b-4702-8cc9-03ff3dad73b0	t
292a6f98-0690-46eb-8ab8-0ee0831099ad	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	557a6645-ba79-474f-ba31-b8c12907fa9e	Intermediate	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
a9b7bb0a-0088-450b-9c03-46b8e05d610d	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	d2eacb20-1c42-4662-9bf7-17b4bab888cf	Beginner	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
49123933-dc59-4453-a1dc-a0cc3460bb99	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	466a95d2-d988-47d4-bc00-6871e8fba4c6	Expert	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
aeebafcf-3832-4b6d-bb8f-b2bb4265091b	e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	3ba32fc5-afff-476b-987d-c0364e7b6cfc	Advanced	2025-09-26 03:54:57.288425	a1bae7fe-d3e8-488c-b39a-76f483ed9de5	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bss_user
--

COPY public.users (id, guid, fio, birth_date, email, phone, password_hash, passport_data, is_in_db, is_manager, is_admin, access_token, refresh_token, created_at, updated_at, salt_password) FROM stdin;
97e98743-a91b-4702-8cc9-03ff3dad73b0	3e3db815-5cb2-469b-8f3f-6c7985bca363	Иванов Иван Иванович	1990-05-15	ivanov@example.com	+7 925 123-45-67	hashed_password_1	1234 567890	f	f	t	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
a1bae7fe-d3e8-488c-b39a-76f483ed9de5	225ec8a9-b97f-49ed-9114-5f9fdc744093	Петров Петр Петрович	1985-08-22	petrov@example.com	+7 903 234-56-78	hashed_password_2	2345 678901	f	t	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
dac9fbf2-3df5-4062-bd1e-6b4fdb97d62e	0706beaf-ecec-4986-ad51-5225cc9511fe	Сидорова Анна Сергеевна	1992-03-10	sidorova@example.com	+7 916 345-67-89	hashed_password_3	3456 789012	f	f	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
e7717e71-55f3-4b0c-9ed2-6cfc47c828b0	f6680fb3-4b1f-4528-bc89-df5e4ac6218d	Козлов Михаил Александрович	1988-11-03	kozlov@example.com	+7 977 456-78-90	hashed_password_4	4567 890123	f	t	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
1e39e5a2-786f-4665-96b9-cc0b9d480cb4	971b540b-8863-44ef-a380-b7b6f08c7e35	Новикова Елена Викторовна	1995-07-18	nolikova@example.com	+7 965 567-89-01	hashed_password_5	5678 901234	f	f	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
923b03fd-b3b2-4981-8c0f-4d67fd33536c	410c1a3d-3938-4ad7-a941-86c9a40a238c	Морозов Алексей Дмитриевич	1987-12-25	morozov@example.com	+7 926 678-90-12	hashed_password_6	6789 012345	f	t	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
96acec9a-8a9e-4b1a-801a-63a01dd831c1	128f1036-66fb-4f0e-b168-112eeda45b94	Волкова Ольга Николаевна	1991-09-14	volkova@example.com	+7 915 789-01-23	hashed_password_7	7890 123456	f	f	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
0c0cdc7b-d9ad-4d82-ac84-cd859d3a00b7	2cad0c0a-a0e7-4c6b-8b2a-9ac8396bc18b	Лебедев Сергей Иванович	1984-04-07	lebedev@example.com	+7 968 890-12-34	hashed_password_8	8901 234567	f	t	f	\N	\N	2025-09-26 03:54:57.288425	2025-09-26 03:54:57.288425	\N
\.


--
-- Name: action_types action_types_code_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.action_types
    ADD CONSTRAINT action_types_code_key UNIQUE (code);


--
-- Name: action_types action_types_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.action_types
    ADD CONSTRAINT action_types_pkey PRIMARY KEY (id);


--
-- Name: cluster_moderators cluster_moderators_cluster_id_moderator_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_moderators
    ADD CONSTRAINT cluster_moderators_cluster_id_moderator_id_key UNIQUE (cluster_id, moderator_id);


--
-- Name: cluster_moderators cluster_moderators_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_moderators
    ADD CONSTRAINT cluster_moderators_pkey PRIMARY KEY (id);


--
-- Name: cluster_profiles cluster_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_profiles
    ADD CONSTRAINT cluster_profiles_pkey PRIMARY KEY (id);


--
-- Name: clusters clusters_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_guid_key UNIQUE (guid);


--
-- Name: clusters clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_pkey PRIMARY KEY (id);


--
-- Name: organization_employees organization_employees_organization_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organization_employees
    ADD CONSTRAINT organization_employees_organization_id_user_id_key UNIQUE (organization_id, user_id);


--
-- Name: organization_employees organization_employees_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organization_employees
    ADD CONSTRAINT organization_employees_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_guid_key UNIQUE (guid);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: professions professions_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.professions
    ADD CONSTRAINT professions_guid_key UNIQUE (guid);


--
-- Name: professions professions_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.professions
    ADD CONSTRAINT professions_pkey PRIMARY KEY (id);


--
-- Name: project_clusters project_clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_clusters
    ADD CONSTRAINT project_clusters_pkey PRIMARY KEY (id);


--
-- Name: project_clusters project_clusters_project_id_cluster_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_clusters
    ADD CONSTRAINT project_clusters_project_id_cluster_id_key UNIQUE (project_id, cluster_id);


--
-- Name: project_curators project_curators_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_curators
    ADD CONSTRAINT project_curators_pkey PRIMARY KEY (id);


--
-- Name: project_curators project_curators_project_id_curator_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_curators
    ADD CONSTRAINT project_curators_project_id_curator_id_key UNIQUE (project_id, curator_id);


--
-- Name: project_experts project_experts_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_experts
    ADD CONSTRAINT project_experts_pkey PRIMARY KEY (id);


--
-- Name: project_experts project_experts_project_id_expert_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_experts
    ADD CONSTRAINT project_experts_project_id_expert_id_key UNIQUE (project_id, expert_id);


--
-- Name: project_passports project_passports_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_passports
    ADD CONSTRAINT project_passports_guid_key UNIQUE (guid);


--
-- Name: project_passports project_passports_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_passports
    ADD CONSTRAINT project_passports_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: roles roles_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_guid_key UNIQUE (guid);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: technologies technologies_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_guid_key UNIQUE (guid);


--
-- Name: technologies technologies_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.technologies
    ADD CONSTRAINT technologies_pkey PRIMARY KEY (id);


--
-- Name: user_actions user_actions_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_actions
    ADD CONSTRAINT user_actions_guid_key UNIQUE (guid);


--
-- Name: user_actions user_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_actions
    ADD CONSTRAINT user_actions_pkey PRIMARY KEY (id);


--
-- Name: user_organization_roles user_organization_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_organization_roles
    ADD CONSTRAINT user_organization_roles_pkey PRIMARY KEY (id);


--
-- Name: user_organization_roles user_organization_roles_user_id_organization_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_organization_roles
    ADD CONSTRAINT user_organization_roles_user_id_organization_id_role_id_key UNIQUE (user_id, organization_id, role_id);


--
-- Name: user_professions user_professions_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_professions
    ADD CONSTRAINT user_professions_pkey PRIMARY KEY (id);


--
-- Name: user_professions user_professions_user_id_profession_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_professions
    ADD CONSTRAINT user_professions_user_id_profession_id_key UNIQUE (user_id, profession_id);


--
-- Name: user_tech_levels user_tech_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_tech_levels
    ADD CONSTRAINT user_tech_levels_pkey PRIMARY KEY (id);


--
-- Name: user_tech_levels user_tech_levels_user_id_tech_id_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_tech_levels
    ADD CONSTRAINT user_tech_levels_user_id_tech_id_key UNIQUE (user_id, tech_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_guid_key; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_guid_key UNIQUE (guid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_cluster_moderators_cluster_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_cluster_moderators_cluster_id ON public.cluster_moderators USING btree (cluster_id);


--
-- Name: idx_cluster_moderators_moderator_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_cluster_moderators_moderator_id ON public.cluster_moderators USING btree (moderator_id);


--
-- Name: idx_organizations_author_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_organizations_author_id ON public.organizations USING btree (author_id);


--
-- Name: idx_organizations_guid; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_organizations_guid ON public.organizations USING btree (guid);


--
-- Name: idx_project_curators_curator_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_project_curators_curator_id ON public.project_curators USING btree (curator_id);


--
-- Name: idx_project_curators_project_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_project_curators_project_id ON public.project_curators USING btree (project_id);


--
-- Name: idx_project_experts_expert_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_project_experts_expert_id ON public.project_experts USING btree (expert_id);


--
-- Name: idx_project_experts_project_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_project_experts_project_id ON public.project_experts USING btree (project_id);


--
-- Name: idx_user_actions_date_time; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_actions_date_time ON public.user_actions USING btree (action_date_time);


--
-- Name: idx_user_actions_type; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_actions_type ON public.user_actions USING btree (action_type);


--
-- Name: idx_user_actions_user_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_actions_user_id ON public.user_actions USING btree (user_id);


--
-- Name: idx_user_org_roles_org_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_org_roles_org_id ON public.user_organization_roles USING btree (organization_id);


--
-- Name: idx_user_org_roles_role_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_org_roles_role_id ON public.user_organization_roles USING btree (role_id);


--
-- Name: idx_user_org_roles_user_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_org_roles_user_id ON public.user_organization_roles USING btree (user_id);


--
-- Name: idx_user_tech_levels_tech_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_tech_levels_tech_id ON public.user_tech_levels USING btree (tech_id);


--
-- Name: idx_user_tech_levels_user_id; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_user_tech_levels_user_id ON public.user_tech_levels USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_guid; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_users_guid ON public.users USING btree (guid);


--
-- Name: idx_users_is_admin; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_users_is_admin ON public.users USING btree (is_admin);


--
-- Name: idx_users_is_manager; Type: INDEX; Schema: public; Owner: bss_user
--

CREATE INDEX idx_users_is_manager ON public.users USING btree (is_manager);


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: bss_user
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cluster_moderators cluster_moderators_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_moderators
    ADD CONSTRAINT cluster_moderators_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: cluster_moderators cluster_moderators_cluster_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_moderators
    ADD CONSTRAINT cluster_moderators_cluster_id_fkey FOREIGN KEY (cluster_id) REFERENCES public.clusters(id) ON DELETE CASCADE;


--
-- Name: cluster_moderators cluster_moderators_moderator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_moderators
    ADD CONSTRAINT cluster_moderators_moderator_id_fkey FOREIGN KEY (moderator_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cluster_profiles cluster_profiles_cluster_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.cluster_profiles
    ADD CONSTRAINT cluster_profiles_cluster_id_fkey FOREIGN KEY (cluster_id) REFERENCES public.clusters(id) ON DELETE CASCADE;


--
-- Name: clusters clusters_passport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_passport_id_fkey FOREIGN KEY (passport_id) REFERENCES public.project_passports(id);


--
-- Name: organization_employees organization_employees_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organization_employees
    ADD CONSTRAINT organization_employees_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_employees organization_employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organization_employees
    ADD CONSTRAINT organization_employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: organizations organizations_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: project_clusters project_clusters_cluster_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_clusters
    ADD CONSTRAINT project_clusters_cluster_id_fkey FOREIGN KEY (cluster_id) REFERENCES public.clusters(id) ON DELETE CASCADE;


--
-- Name: project_clusters project_clusters_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_clusters
    ADD CONSTRAINT project_clusters_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_curators project_curators_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_curators
    ADD CONSTRAINT project_curators_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: project_curators project_curators_curator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_curators
    ADD CONSTRAINT project_curators_curator_id_fkey FOREIGN KEY (curator_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_curators project_curators_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_curators
    ADD CONSTRAINT project_curators_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_experts project_experts_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_experts
    ADD CONSTRAINT project_experts_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: project_experts project_experts_expert_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_experts
    ADD CONSTRAINT project_experts_expert_id_fkey FOREIGN KEY (expert_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_experts project_experts_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.project_experts
    ADD CONSTRAINT project_experts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: user_actions user_actions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_actions
    ADD CONSTRAINT user_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_organization_roles user_organization_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_organization_roles
    ADD CONSTRAINT user_organization_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: user_organization_roles user_organization_roles_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_organization_roles
    ADD CONSTRAINT user_organization_roles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: user_organization_roles user_organization_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_organization_roles
    ADD CONSTRAINT user_organization_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE RESTRICT;


--
-- Name: user_organization_roles user_organization_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_organization_roles
    ADD CONSTRAINT user_organization_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_professions user_professions_profession_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_professions
    ADD CONSTRAINT user_professions_profession_id_fkey FOREIGN KEY (profession_id) REFERENCES public.professions(id) ON DELETE CASCADE;


--
-- Name: user_professions user_professions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_professions
    ADD CONSTRAINT user_professions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_tech_levels user_tech_levels_assessed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_tech_levels
    ADD CONSTRAINT user_tech_levels_assessed_by_fkey FOREIGN KEY (assessed_by) REFERENCES public.users(id);


--
-- Name: user_tech_levels user_tech_levels_tech_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_tech_levels
    ADD CONSTRAINT user_tech_levels_tech_id_fkey FOREIGN KEY (tech_id) REFERENCES public.technologies(id) ON DELETE CASCADE;


--
-- Name: user_tech_levels user_tech_levels_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bss_user
--

ALTER TABLE ONLY public.user_tech_levels
    ADD CONSTRAINT user_tech_levels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict GFat8eb9fM7diMwfeyHP7e4cCYtZ5yOt0fzReU3LrC2hwT8hSDRXYnLEa2UPh6T

