CREATE TABLE payments (
                          id BIGSERIAL PRIMARY KEY,
                          care_request_id BIGINT UNIQUE NOT NULL, -- ID logic từ booking-service
                          amount DECIMAL(10, 2) NOT NULL,
                          payment_method VARCHAR(30) NOT NULL, -- 'VNPAY', 'MOMO', 'CASH'
                          status VARCHAR(20) DEFAULT 'UNPAID' NOT NULL, -- 'UNPAID', 'PAID', 'FAILED', 'REFUNDED'
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE payment_transactions (
                                      id BIGSERIAL PRIMARY KEY,
                                      payment_id BIGINT NOT NULL,
                                      transaction_no VARCHAR(100), -- Mã giao dịch phản hồi từ Gateway
                                      raw_response TEXT,           -- Lưu trọn vẹn JSON/QueryString từ bên thứ 3 trả về để đối soát lỗi
                                      status VARCHAR(20) NOT NULL,
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                      CONSTRAINT fk_tx_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);