-- Danh mục các gói dịch vụ
CREATE TABLE care_services (
                               id BIGSERIAL PRIMARY KEY,
                               name VARCHAR(150) NOT NULL,
                               description TEXT,
                               base_price DECIMAL(10, 2) NOT NULL,
                               tier VARCHAR(20) DEFAULT 'BASIC' NOT NULL -- 'BASIC', 'VIP'
);

-- Điều kiện kỹ năng tối thiểu của gói dịch vụ cần đáp ứng (Phục vụ thuật toán Matching Score)
CREATE TABLE service_requirements (
                                      id BIGSERIAL PRIMARY KEY,
                                      service_id BIGINT NOT NULL,
                                      required_skill VARCHAR(100) NOT NULL,
                                      CONSTRAINT fk_req_service FOREIGN KEY (service_id) REFERENCES care_services(id) ON DELETE CASCADE
);

-- Đơn yêu cầu đặt lịch dịch vụ từ Khách hàng
CREATE TABLE care_requests (
                               id BIGSERIAL PRIMARY KEY,
                               family_id BIGINT NOT NULL,    -- ID logic khách hàng
                               caregiver_id BIGINT NOT NULL, -- ID logic hộ lý được giao phối ca
                               patient_id BIGINT NOT NULL,   -- ID logic người bệnh cần chăm sóc
                               service_id BIGINT NOT NULL,   -- Khóa ngoại nội bộ liên kết gói dịch vụ
                               start_date DATE NOT NULL,
                               end_date DATE NOT NULL,
                               total_price DECIMAL(10, 2) NOT NULL,
                               status VARCHAR(20) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                               version BIGINT DEFAULT 0 NOT NULL,
                               CONSTRAINT fk_request_service FOREIGN KEY (service_id) REFERENCES care_services(id)
);

-- Hợp đồng ký kết pháp lý đi kèm đơn đặt lịch
CREATE TABLE contracts (
                           id BIGSERIAL PRIMARY KEY,
                           care_request_id BIGINT UNIQUE NOT NULL,
                           status VARCHAR(20) DEFAULT 'UNSIGNED' NOT NULL, -- 'UNSIGNED', 'SIGNED', 'EXPIRED'
                           file_id BIGINT, -- ID logic tài liệu PDF lưu trữ bên file-service
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                           CONSTRAINT fk_contract_request FOREIGN KEY (care_request_id) REFERENCES care_requests(id) ON DELETE CASCADE
);

-- Phân rã lịch trực chi tiết theo từng ca/ngày cụ thể cho Hộ lý
CREATE TABLE schedules (
                           id BIGSERIAL PRIMARY KEY,
                           care_request_id BIGINT NOT NULL,
                           caregiver_id BIGINT NOT NULL, -- ID logic hộ lý chịu trách nhiệm ca này
                           work_date DATE NOT NULL,
                           shift_start TIME NOT NULL,
                           shift_end TIME NOT NULL,
                           status VARCHAR(20) DEFAULT 'SCHEDULED' NOT NULL, -- 'SCHEDULED', 'CHECKED_IN', 'CHECKED_OUT', 'ABSENT'
                           CONSTRAINT fk_schedule_request FOREIGN KEY (care_request_id) REFERENCES care_requests(id) ON DELETE CASCADE
);

-- Nhật ký ghi nhận tình trạng sức khỏe bệnh nhân hàng ngày do Hộ lý viết
CREATE TABLE care_logs (
                           id BIGSERIAL PRIMARY KEY,
                           schedule_id BIGINT UNIQUE NOT NULL,
                           notes TEXT,
                           blood_pressure VARCHAR(20),
                           heart_rate INT,
                           temperature DOUBLE PRECISION,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                           CONSTRAINT fk_log_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);