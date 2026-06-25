-- Add keycloak_id and address to users table
ALTER TABLE users ADD COLUMN keycloak_id VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN address VARCHAR(255);
ALTER TABLE users ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- Allow password to be NULL since auth is handled by Keycloak
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
