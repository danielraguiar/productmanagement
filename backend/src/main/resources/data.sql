-- Clear existing users
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with generated password
INSERT INTO users (username, password, role, created_at, updated_at)
VALUES (
    'admin',
    '$2a$10$FZQMPjr1U8GIhQSxAw.NheeGBH.qyDz3rtpCMRMVgS6OCTU0ExC1G',
    'ROLE_ADMIN',
    NOW(),
    NOW()
);

-- Clear existing categories
DELETE FROM categories;

-- Main Categories (Nível 1)
INSERT INTO categories (name, path, parent_id, created_at, updated_at) VALUES
-- Electronics
('Electronics', 'Electronics', NULL, NOW(), NOW()),
-- Fashion
('Fashion', 'Fashion', NULL, NOW(), NOW()),
-- Home & Decor
('Home & Decor', 'Home & Decor', NULL, NOW(), NOW()),
-- Books
('Books', 'Books', NULL, NOW(), NOW()),
-- Sports & Outdoors
('Sports & Outdoors', 'Sports & Outdoors', NULL, NOW(), NOW());

-- Electronics Subcategories (Nível 2)
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Electronics/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Electronics'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Smartphones'),
    ('Computers'),
    ('Audio'),
    ('Gaming'),
    ('Cameras')
) AS subcat(name);

-- Electronics/Smartphones subcategories (Nível 3)
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Electronics/Smartphones/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Smartphones' AND path LIKE 'Electronics/%'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Apple'),
    ('Samsung'),
    ('Google'),
    ('Xiaomi'),
    ('OnePlus')
) AS subcat(name);

-- Electronics/Computers subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Electronics/Computers/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Computers' AND path LIKE 'Electronics/%'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Laptops'),
    ('Desktops'),
    ('Tablets'),
    ('Accessories'),
    ('Components')
) AS subcat(name);

-- Electronics/Computers/Laptops subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Electronics/Computers/Laptops/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Laptops' AND path LIKE 'Electronics/Computers/%'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Gaming Laptops'),
    ('Business Laptops'),
    ('Ultrabooks'),
    ('Budget Laptops'),
    ('2-in-1 Laptops')
) AS subcat(name);

-- Fashion Subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Fashion/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Fashion'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Men'),
    ('Women'),
    ('Kids'),
    ('Accessories'),
    ('Shoes')
) AS subcat(name);

-- Fashion/Men subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Fashion/Men/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Men' AND path LIKE 'Fashion/%'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Shirts'),
    ('Pants'),
    ('Suits'),
    ('Activewear'),
    ('Outerwear')
) AS subcat(name);

-- Books Subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Books/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Books'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Fiction'),
    ('Non-Fiction'),
    ('Academic'),
    ('Children'),
    ('Comics & Manga')
) AS subcat(name);

-- Books/Fiction subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Books/Fiction/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Fiction' AND path LIKE 'Books/%'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Science Fiction'),
    ('Fantasy'),
    ('Mystery'),
    ('Romance'),
    ('Historical Fiction')
) AS subcat(name);

-- Sports & Outdoors Subcategories
INSERT INTO categories (name, path, parent_id, created_at, updated_at)
SELECT 
    subcat.name, 
    CONCAT('Sports & Outdoors/', subcat.name),
    (SELECT id FROM categories WHERE name = 'Sports & Outdoors'),
    NOW(),
    NOW()
FROM (
    VALUES 
    ('Fitness'),
    ('Team Sports'),
    ('Outdoor Recreation'),
    ('Water Sports'),
    ('Winter Sports')
) AS subcat(name); 