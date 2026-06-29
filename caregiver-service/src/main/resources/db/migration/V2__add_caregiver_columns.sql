-- Add bio and certifications_verified to caregivers table
ALTER TABLE caregivers ADD COLUMN bio TEXT;
ALTER TABLE caregivers ADD COLUMN certifications_verified BOOLEAN DEFAULT FALSE NOT NULL;
