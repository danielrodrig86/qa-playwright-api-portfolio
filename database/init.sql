CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    size VARCHAR(40) NOT NULL,
    industry VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (name, email, size, industry) VALUES
('Alpha Logistics', 'alpha@demo.com', 'Medium', 'Logistics'),
('Beta Retail', 'beta@demo.com', 'Enterprise', 'Retail'),
('Gamma Tech', 'gamma@demo.com', 'Large Enterprise', 'Technology'),
('Delta HR', 'delta@demo.com', 'Small', 'HR'),
('Epsilon Finance', 'epsilon@demo.com', 'Large Enterprise', 'Finance'),
('Nova Logistics', 'nova@demo.com', 'Small', 'Logistics'),
('Orion Retail', 'orion@demo.com', 'Medium', 'Retail'),
('Pixel Technology', 'pixel@demo.com', 'Enterprise', 'Technology'),
('People HR', 'people@demo.com', 'Medium', 'HR'),
('Capital Finance', 'capital@demo.com', 'Large Enterprise', 'Finance'),
('Road Logistics', 'road@demo.com', 'Enterprise', 'Logistics'),
('Market Retail', 'market@demo.com', 'Small', 'Retail'),
('TechTudo', 'tech@demo.com', 'Very Large Enterprise', 'HR');
