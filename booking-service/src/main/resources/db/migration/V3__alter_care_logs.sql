-- Add activity_details column to care_logs to align with CareLog entity
ALTER TABLE care_logs ADD COLUMN activity_details TEXT;
