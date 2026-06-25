-- Quản lý Metadata của mọi tập tin tải lên hệ thống (Avatar, Bệnh án, Hợp đồng...)
CREATE TABLE files (
                       id BIGSERIAL PRIMARY KEY,
                       file_name VARCHAR(255) NOT NULL,
                       file_type VARCHAR(100) NOT NULL, -- MIME Type: 'application/pdf', 'image/png'
                       file_path VARCHAR(500) NOT NULL, -- Đường dẫn vật lý đĩa đệm cục bộ hoặc link Object Storage (MinIO)
                       file_size BIGINT NOT NULL,       -- Kích thước tính bằng Byte
                       uploaded_by BIGINT,              -- ID logic tài khoản thực hiện tải file
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Ghi nhận báo cáo sự cố khẩn cấp phát sinh trong ca trực
CREATE TABLE incidents (
                           id BIGSERIAL PRIMARY KEY,
                           care_request_id BIGINT NOT NULL, -- ID logic ca đặt lịch xảy ra tai nạn
                           reported_by BIGINT NOT NULL,     -- ID logic người báo cáo
                           description TEXT NOT NULL,
                           severity VARCHAR(20) NOT NULL,   -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
                           status VARCHAR(20) DEFAULT 'OPEN' NOT NULL, -- 'OPEN', 'PROCESSING', 'RESOLVED'
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Lịch sử gửi thông báo Notification của người dùng
CREATE TABLE notifications (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT NOT NULL, -- ID logic người nhận thông báo
                               title VARCHAR(200) NOT NULL,
                               content TEXT NOT NULL,
                               type VARCHAR(30) NOT NULL, -- 'SYSTEM', 'CHAT', 'ALERT', 'BOOKING_UPDATE'
                               is_read BOOLEAN DEFAULT FALSE NOT NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Lưu lịch sử tin nhắn Chat Realtime qua WebSocket
CREATE TABLE chat_messages (
                               id BIGSERIAL PRIMARY KEY,
                               booking_id BIGINT NOT NULL,  -- Chat theo ngữ cảnh mã đơn đặt lịch cụ thể
                               sender_id BIGINT NOT NULL,   -- ID logic người gửi
                               receiver_id BIGINT NOT NULL, -- ID logic người nhận
                               message_text TEXT NOT NULL,
                               is_read BOOLEAN DEFAULT FALSE NOT NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_chat_booking ON chat_messages(booking_id);