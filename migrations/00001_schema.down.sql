-- NebulaChat Down Migration
-- Reverse the DDL and clean up the database

-- 1. Drop triggers and functions
DROP TRIGGER IF EXISTS trg_messages_tsv ON messages;
DROP FUNCTION IF EXISTS messages_tsv_trigger();

-- 2. Drop indexes (Optional, as dropping tables will also remove associated indexes)
DROP INDEX IF EXISTS idx_messages_tsv;
DROP INDEX IF EXISTS idx_attachments_message;
DROP INDEX IF EXISTS idx_messages_sender;
DROP INDEX IF EXISTS idx_messages_session_time;
DROP INDEX IF EXISTS idx_chat_participants_user;

-- 3. Drop tables (Ordered by dependency)
-- Attachments must go before messages
DROP TABLE IF EXISTS attachments;
-- Messages must go before users and chat_sessions
DROP TABLE IF EXISTS messages;
-- Participants must go before users and chat_sessions
DROP TABLE IF EXISTS chat_participants;
-- Base tables
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS users;

-- 4. Drop Custom Enums
DROP TYPE IF EXISTS chat_type;
DROP TYPE IF EXISTS user_status;
DROP TYPE IF EXISTS message_status;

-- 5. Drop Extension (Optional - use with caution if other schemas use pgcrypto)
-- DROP EXTENSION IF EXISTS "pgcrypto";