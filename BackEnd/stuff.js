/*
CREATE TABLE Stuff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    item_name VARCHAR(255) NOT NULL,
    purchased_location VARCHAR(255),
    image VARCHAR(255),
    date_purchased DATETIME,
    amount_paid DECIMAL(10, 2),
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE Stuff_Groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/