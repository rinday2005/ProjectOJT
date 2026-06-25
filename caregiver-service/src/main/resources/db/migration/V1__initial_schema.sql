-- Bảng hồ sơ chi tiết Caregivers
CREATE TABLE caregivers (
                            id BIGSERIAL PRIMARY KEY,
                            user_id BIGINT UNIQUE NOT NULL, -- ID logic từ user-service
                            specialization VARCHAR(255),
                            experience_years INT DEFAULT 0 NOT NULL,
                            hourly_rate DECIMAL(10, 2) NOT NULL,
                            status VARCHAR(20) DEFAULT 'AVAILABLE' NOT NULL, -- 'AVAILABLE', 'BUSY'
                            average_rating DOUBLE PRECISION DEFAULT 0.0 NOT NULL, -- Điểm số trung bình phục vụ Matching thuật toán
                            total_reviews INT DEFAULT 0 NOT NULL,
                            version BIGINT DEFAULT 0 NOT NULL
);

-- Bảng danh mục kỹ năng của từng Hộ lý
CREATE TABLE caregiver_skills (
                                  id BIGSERIAL PRIMARY KEY,
                                  caregiver_id BIGINT NOT NULL,
                                  skill_name VARCHAR(100) NOT NULL, -- 'Elderly care', 'Emergency handling', v.v.
                                  level VARCHAR(20) NOT NULL,        -- 'BASIC', 'ADVANCED'
                                  CONSTRAINT fk_skill_caregiver FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE
);

-- Bảng lưu chứng chỉ hành nghề (Bằng cấp)
CREATE TABLE certificates (
                              id BIGSERIAL PRIMARY KEY,
                              caregiver_id BIGINT NOT NULL,
                              name VARCHAR(255) NOT NULL,
                              organization VARCHAR(255) NOT NULL,
                              issue_date DATE NOT NULL,
                              expiry_date DATE,
                              file_id BIGINT, -- ID logic liên kết sang File Metadata bên notification-service
                              CONSTRAINT fk_cert_caregiver FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE
);

-- Bảng lưu lịch sử feedback và đánh giá sao từ phía gia đình khách hàng
CREATE TABLE caregiver_reviews (
                                   id BIGSERIAL PRIMARY KEY,
                                   caregiver_id BIGINT NOT NULL,
                                   family_id BIGINT NOT NULL,  -- ID logic người dùng đánh giá
                                   booking_id BIGINT NOT NULL, -- ID logic ca trực để đối soát hợp lệ
                                   rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
                                   comment TEXT,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                   CONSTRAINT fk_review_caregiver FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE
);