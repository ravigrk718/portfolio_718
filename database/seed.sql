-- Sample data for the shopping database

INSERT INTO categories (name, description, parent_id) VALUES
    ('Electronics', 'Devices and gadgets', NULL),
    ('Clothing', 'Apparel and accessories', NULL),
    ('Home & Kitchen', 'Household items', NULL),
    ('Laptops', 'Portable computers', 1),
    ('Phones', 'Smartphones and accessories', 1),
    ('Men', 'Men''s clothing', 2),
    ('Women', 'Women''s clothing', 2);

INSERT INTO products (category_id, name, description, price, stock_quantity, sku) VALUES
    (4, 'Pro Laptop 15"', '15-inch laptop with 16GB RAM', 1299.99, 25, 'LAP-PRO-15'),
    (4, 'Budget Laptop 14"', 'Lightweight laptop for everyday use', 599.99, 40, 'LAP-BUD-14'),
    (5, 'Smartphone X', 'Latest flagship smartphone', 899.00, 60, 'PHN-X-128'),
    (5, 'Wireless Earbuds', 'Noise-cancelling earbuds', 149.99, 120, 'ACC-EARBUDS'),
    (6, 'Classic T-Shirt', 'Cotton crew neck t-shirt', 24.99, 200, 'M-TEE-CLASSIC'),
    (7, 'Summer Dress', 'Floral print summer dress', 59.99, 75, 'W-DRS-SUMMER'),
    (3, 'Coffee Maker', '12-cup programmable coffee maker', 79.99, 35, 'HK-COFFEE-12');

INSERT INTO customers (email, first_name, last_name, phone) VALUES
    ('alice@example.com', 'Alice', 'Johnson', '555-0101'),
    ('bob@example.com', 'Bob', 'Smith', '555-0102'),
    ('carol@example.com', 'Carol', 'Williams', '555-0103');

INSERT INTO addresses (customer_id, label, street, city, state, postal_code, country, is_default) VALUES
    (1, 'Home', '123 Maple St', 'Portland', 'OR', '97201', 'US', 1),
    (1, 'Work', '500 Tech Blvd', 'Portland', 'OR', '97205', 'US', 0),
    (2, 'Home', '88 Oak Ave', 'Austin', 'TX', '73301', 'US', 1),
    (3, 'Home', '42 Pine Rd', 'Denver', 'CO', '80202', 'US', 1);

INSERT INTO cart_items (customer_id, product_id, quantity) VALUES
    (1, 3, 1),
    (1, 4, 2),
    (2, 5, 3);

INSERT INTO orders (customer_id, status, subtotal, tax_amount, shipping_amount, total_amount, shipping_address_id) VALUES
    (1, 'delivered', 1299.99, 104.00, 15.00, 1418.99, 1),
    (2, 'shipped', 74.97, 6.00, 5.99, 86.96, 3),
    (3, 'pending', 59.99, 4.80, 5.99, 70.78, 4);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 1299.99),
    (2, 5, 3, 24.99),
    (3, 6, 1, 59.99);

INSERT INTO payments (order_id, amount, payment_method, status, transaction_ref, paid_at) VALUES
    (1, 1418.99, 'card', 'completed', 'TXN-10001', datetime('now', '-5 days')),
    (2, 86.96, 'paypal', 'completed', 'TXN-10002', datetime('now', '-2 days')),
    (3, 70.78, 'card', 'pending', NULL, NULL);
