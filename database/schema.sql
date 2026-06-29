-- RAAS PostgreSQL Schema
-- Run against Supabase or Neon PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    role INTEGER NOT NULL DEFAULT 0,
    referral_code VARCHAR(20) NOT NULL UNIQUE,
    referred_by_user_id UUID REFERENCES users(id),
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    referral_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
    has_claimed_sample BOOLEAN NOT NULL DEFAULT FALSE,
    is_guest BOOLEAN NOT NULL DEFAULT FALSE,
    guest_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL DEFAULT 'Home',
    line1 VARCHAR(300) NOT NULL,
    line2 VARCHAR(300),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    story TEXT,
    health_benefits TEXT,
    usage_suggestions TEXT,
    ingredients TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    spice_level INTEGER NOT NULL DEFAULT 0,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rating DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    review_count INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    gallery_urls TEXT[],
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(300),
    discount_percent DECIMAL(5,2) NOT NULL,
    max_discount_amount DECIMAL(10,2),
    min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    usage_limit INTEGER NOT NULL DEFAULT 100,
    usage_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    status INTEGER NOT NULL DEFAULT 0,
    payment_method INTEGER NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    coupon_code VARCHAR(50),
    shipping_name VARCHAR(200) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    is_guest_order BOOLEAN NOT NULL DEFAULT FALSE,
    is_sample_order BOOLEAN NOT NULL DEFAULT FALSE,
    guest_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(200) NOT NULL,
    product_image_url VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id),
    referred_user_id UUID NOT NULL REFERENCES users(id),
    reward_amount DECIMAL(10,2) NOT NULL DEFAULT 50,
    is_rewarded BOOLEAN NOT NULL DEFAULT FALSE,
    rewarded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type INTEGER NOT NULL,
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    session_id VARCHAR(100),
    metadata TEXT,
    user_agent VARCHAR(500),
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_bestseller ON products(is_bestseller) WHERE is_active = TRUE;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created ON events(created_at);
CREATE INDEX idx_product_views_product ON product_views(product_id);

-- Seed categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Pickles', 'pickles', 'Traditional Rajasthani achar', 1),
('Papad', 'papad', 'Crispy handmade papads', 2),
('Masalas', 'masalas', 'Authentic spice blends', 3),
('Chutneys', 'chutneys', 'Tangy homemade chutneys', 4),
('Combos', 'combos', 'Curated gift packs', 5);

-- Seed sample products
INSERT INTO products (category_id, name, slug, description, story, health_benefits, usage_suggestions, ingredients, price, compare_at_price, stock, spice_level, is_bestseller, image_url, gallery_urls)
SELECT c.id, 'Rajasthani Mango Pickle', 'rajasthani-mango-pickle',
    'Sun-dried raw mangoes in mustard oil with traditional spices',
    'From the kitchens of Jodhpur, this pickle carries generations of family recipes passed down through Rajasthani homemakers.',
    'Rich in probiotics, aids digestion, boosts immunity with turmeric and mustard.',
    'Perfect with dal-rice, parathas, or as a side with Rajasthani thali.',
    'Raw mango, mustard oil, fenugreek, fennel, red chili, turmeric, salt',
    249.00, 299.00, 150, 2, TRUE,
    'https://images.unsplash.com/photo-1609501676725-7186f017a9fe?w=800',
    ARRAY['https://images.unsplash.com/photo-1609501676725-7186f017a9fe?w=800']
FROM categories c WHERE c.slug = 'pickles';

INSERT INTO products (category_id, name, slug, description, story, health_benefits, usage_suggestions, ingredients, price, stock, spice_level, is_bestseller, image_url)
SELECT c.id, 'Masala Papad', 'masala-papad',
    'Crispy urad dal papad with black pepper and cumin',
    'Hand-rolled under the desert sun of Bikaner, each papad is a testament to Rajasthani craftsmanship.',
    'High protein, low fat snack. Cumin aids digestion.',
    'Roast over flame or microwave. Serve with chutney and onions.',
    'Urad dal, black pepper, cumin, salt',
    89.00, 200, 0, TRUE,
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'
FROM categories c WHERE c.slug = 'papad';

-- Admin user (password: Admin@123)
INSERT INTO users (email, password_hash, full_name, role, referral_code)
VALUES ('admin@raas.in', '$2a$11$8K1p/a0dL1LXMIgoEDFrwOfMQgPaYqKqHqJqJqJqJqJqJqJqJqJqJq', 'RAAS Admin', 1, 'RAASADMIN');

-- Welcome coupon
INSERT INTO coupons (code, description, discount_percent, max_discount_amount, min_order_amount, valid_from, valid_until, usage_limit)
VALUES ('WELCOME10', '10% off on first order', 10, 100, 299, NOW(), NOW() + INTERVAL '1 year', 1000);
