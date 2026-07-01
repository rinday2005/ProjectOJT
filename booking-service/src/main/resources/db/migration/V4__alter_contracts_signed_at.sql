-- Add signed_at column to contracts to align with Contract entity
ALTER TABLE contracts ADD COLUMN signed_at TIMESTAMP;
