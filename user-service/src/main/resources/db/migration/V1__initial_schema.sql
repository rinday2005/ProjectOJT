-- Bảng lưu thông tin tài khoản (Xác thực qua Keycloak hoặc JWT nội bộ)
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       full_name VARCHAR(100) NOT NULL,
                       phone VARCHAR(20) NOT NULL,
                       role VARCHAR(20) NOT NULL, -- 'ADMIN', 'OPERATOR', 'CAREGIVER', 'FAMILY'
                       status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL, -- 'ACTIVE', 'INACTIVE'
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                       version BIGINT DEFAULT 0 NOT NULL -- Dùng cho Optimistic Lock
);

-- Bảng lưu thông tin Người bệnh (Gắn liền với tài khoản FAMILY)
CREATE TABLE patients (
                          id BIGSERIAL PRIMARY KEY,
                          family_id BIGINT NOT NULL, -- ID logic liên kết sang bảng users,BIGINT nhằm đảm bảo tính độc lập của từng Database per Service.
                          name VARCHAR(100) NOT NULL,
                          dob DATE NOT NULL,
                          gender VARCHAR(10) NOT NULL,
                          medical_history TEXT,
                          address VARCHAR(255) NOT NULL,
                          latitude DOUBLE PRECISION,  -- Tọa độ phục vụ tính khoảng cách di chuyển
                          longitude DOUBLE PRECISION,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                          version BIGINT DEFAULT 0 NOT NULL
);

-- Tạo Index tăng tốc truy vấn tìm kiếm bệnh nhân theo gia đình
CREATE INDEX idx_patients_family ON patients(family_id);