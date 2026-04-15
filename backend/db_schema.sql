CREATE DATABASE IF NOT EXISTS rentora_db;
USE rentora_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    age INT,
    membership VARCHAR(50) DEFAULT 'Bronze',
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rentals (Properties) Table
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50),
    type_display VARCHAR(50),
    building_type VARCHAR(50),
    building_type_display VARCHAR(50),
    activation_date VARCHAR(100),
    bathroom INT,
    floor INT,
    total_floor INT,
    furnishing VARCHAR(50),
    furnishing_display VARCHAR(50),
    gym BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    lease_type VARCHAR(50),
    lift BOOLEAN DEFAULT FALSE,
    locality VARCHAR(255),
    parking VARCHAR(50),
    property_age INT,
    property_size INT,
    swimming_pool BOOLEAN DEFAULT FALSE,
    pin_code VARCHAR(20),
    rent INT,
    deposit INT,
    image VARCHAR(500),
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    rental_id INT,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (rental_id) REFERENCES rentals(id)
);

-- Reviews Table (Optional)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    rental_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (rental_id) REFERENCES rentals(id)
);

-- User Activity Table (Optional)
CREATE TABLE IF NOT EXISTS user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type VARCHAR(100),
    activity_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
