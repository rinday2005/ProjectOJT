-- Add created_at and version columns to schedules to align with Schedule entity
ALTER TABLE schedules ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
ALTER TABLE schedules ADD COLUMN version BIGINT DEFAULT 0 NOT NULL;

-- Rename shift columns to match entity property mapping
ALTER TABLE schedules RENAME COLUMN shift_start TO start_time;
ALTER TABLE schedules RENAME COLUMN shift_end TO end_time;
