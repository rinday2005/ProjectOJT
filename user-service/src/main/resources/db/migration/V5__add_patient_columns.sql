-- Alter patients table to add new fields for Phase 5
ALTER TABLE patients ADD COLUMN relation VARCHAR(50);
ALTER TABLE patients ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL;
ALTER TABLE patients ADD COLUMN current_condition VARCHAR(255);
ALTER TABLE patients ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;
