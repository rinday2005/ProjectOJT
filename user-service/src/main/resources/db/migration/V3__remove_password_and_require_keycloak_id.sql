-- Remove password column from users table
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Make keycloak_id column NOT NULL as it is the mandatory binding link
ALTER TABLE users ALTER COLUMN keycloak_id SET NOT NULL;
