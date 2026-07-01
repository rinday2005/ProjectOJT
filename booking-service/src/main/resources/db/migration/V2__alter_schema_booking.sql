-- Make caregiver_id nullable in care_requests
ALTER TABLE care_requests ALTER COLUMN caregiver_id DROP NOT NULL;

-- Add details for care requests
ALTER TABLE care_requests ADD COLUMN start_time TIME;
ALTER TABLE care_requests ADD COLUMN end_time TIME;
ALTER TABLE care_requests ADD COLUMN notes TEXT;
ALTER TABLE care_requests ADD COLUMN type VARCHAR(50);
ALTER TABLE care_requests ADD COLUMN address VARCHAR(255);

-- Add contract_url in contracts
ALTER TABLE contracts ADD COLUMN contract_url VARCHAR(500);

-- Add fields in care_services to match FE fields
ALTER TABLE care_services ADD COLUMN image VARCHAR(500);
ALTER TABLE care_services ADD COLUMN category VARCHAR(100);
ALTER TABLE care_services ADD COLUMN skill_level VARCHAR(50);
ALTER TABLE care_services ADD COLUMN duration_allowed VARCHAR(100);

-- Seed initial care services
INSERT INTO care_services (name, description, base_price, tier, image, category, skill_level, duration_allowed) VALUES
('Elderly Daily Care', 'Comprehensive support for daily activities, meals, and companion care.', 150000.00, 'BASIC', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80', 'Daily Care', 'Basic Care', '2h / 4h / 8h'),
('Clinical Nursing Support', 'Clinical care, medication administration, wound care, and health monitoring.', 250000.00, 'VIP', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80', 'Medical Care', 'Registered Nurse', '2h / 4h'),
('Post-Surgery Recovery', 'Specialized rehabilitation care, physical assistance, and monitoring post-operation.', 300000.00, 'VIP', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80', 'Specialized', 'Specialist Nurse', '4h / 8h / 24h');
