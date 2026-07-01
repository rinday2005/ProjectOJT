-- Add booking_type column to care_services
ALTER TABLE care_services ADD COLUMN booking_type VARCHAR(50) DEFAULT 'REQUEST' NOT NULL;

-- Update existing services to REQUEST type
UPDATE care_services SET booking_type = 'REQUEST';

-- Add new individual/on-demand services (REQUEST type)
INSERT INTO care_services (name, description, base_price, tier, image, category, skill_level, duration_allowed, booking_type) VALUES
('Hourly Companion Walk', 'Social companionship, mental stimulation, and supervised outdoor walks.', 80000.00, 'BASIC', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80', 'Companion Care', 'Basic Support', '1h / 2h', 'REQUEST'),
('Medical Escort Service', 'Assisted transportation and supervision for hospital and clinical appointments.', 120000.00, 'BASIC', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80', 'Medical Care', 'Basic Support', '2h / 4h / 8h', 'REQUEST'),
('Physical Therapy Session', 'One-on-one professional rehabilitative and physical therapy exercises.', 200000.00, 'VIP', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80', 'Rehabilitation', 'Therapist', '1h / 2h', 'REQUEST');

-- Add new long-term package services (CONTRACT type)
INSERT INTO care_services (name, description, base_price, tier, image, category, skill_level, duration_allowed, booking_type) VALUES
('Weekly Care Package', 'Comprehensive daily living assistance and weekly nursing supervision contract.', 130000.00, 'BASIC', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80', 'Daily Care', 'Basic Care', 'Weekly (15h/week)', 'CONTRACT'),
('Monthly Medical Recovery', 'Continuous home nursing, rehabilitation exercises, and clinical care contract.', 210000.00, 'VIP', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80', 'Medical Care', 'Specialist Nurse', 'Monthly (40h/month)', 'CONTRACT'),
('24/7 Live-in Care Contract', 'Around-the-clock intensive medical and physical support contract with dedicated nurse team.', 260000.00, 'VIP', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80', 'Specialized', 'Specialist Team', '24h Shifts (Long-term)', 'CONTRACT');
