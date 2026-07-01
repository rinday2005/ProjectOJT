-- Create user_appeals table for user block appeal requests
CREATE TABLE IF NOT EXISTS user_appeals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'REPLIED'
    reply_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_appeal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
