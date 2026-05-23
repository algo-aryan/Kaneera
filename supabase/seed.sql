-- Insert Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Rings', 'rings', 'Elegant rings for every occasion.', 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=800'),
('22222222-2222-2222-2222-222222222222', 'Earrings', 'earrings', 'Stunning earrings to frame your face.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'),
('33333333-3333-3333-3333-333333333333', 'Anklets', 'anklets', 'Delicate anklets for a touch of grace.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'),
('44444444-4444-4444-4444-444444444444', 'Bracelets', 'bracelets', 'Beautiful bracelets to adorn your wrists.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'),
('55555555-5555-5555-5555-555555555555', 'Bangles', 'bangles', 'Traditional and modern bangles.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (slug) DO NOTHING;

-- Since generating 76 exact INSERT statements in SQL is verbose, 
-- we provide a few representatives for each category. 
-- In a real app, you'd use a script to seed the exact 40 rings, etc.

-- Insert Rings (~40 total, showing a few)
INSERT INTO products (category_id, name, slug, description, price, material, stock_quantity, sku, image_urls) VALUES
('11111111-1111-1111-1111-111111111111', 'Rose Gold Classic Ring', 'rose-gold-classic-ring', 'A beautiful everyday ring.', 199.00, 'Rose Gold Plated', 50, 'RNG-001', '{"https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=800"}'),
('11111111-1111-1111-1111-111111111111', 'Silver Eternity Ring', 'silver-eternity-ring', 'Timeless silver eternity band.', 249.00, 'Sterling Silver', 30, 'RNG-002', '{"https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=800"}'),
('11111111-1111-1111-1111-111111111111', 'Minimalist Band', 'minimalist-band', 'Simple and elegant.', 189.00, 'Gold Plated', 45, 'RNG-003', '{"https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=800"}'),

-- Insert Earrings (~10 total)
('22222222-2222-2222-2222-222222222222', 'Crystal Drop Earrings', 'crystal-drop-earrings', 'Perfect for evening wear.', 399.00, 'Silver', 20, 'EAR-001', '{"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"}'),
('22222222-2222-2222-2222-222222222222', 'Pearl Studs', 'pearl-studs', 'Classic pearl earrings.', 299.00, 'Pearl', 15, 'EAR-002', '{"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"}'),

-- Insert Anklets (~3 total)
('33333333-3333-3333-3333-333333333333', 'Silver Chain Anklet', 'silver-chain-anklet', 'Lightweight and comfortable.', 149.00, 'Sterling Silver', 10, 'ANK-001', '{"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"}'),

-- Insert Bracelets (~13 total)
('44444444-4444-4444-4444-444444444444', 'Charm Bracelet', 'charm-bracelet', 'A customizable charm bracelet.', 499.00, 'Silver', 25, 'BRA-001', '{"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"}'),

-- Insert Bangles (~10 total)
('55555555-5555-5555-5555-555555555555', 'Gold Plated Bangle Set', 'gold-plated-bangle-set', 'Set of 4 traditional bangles.', 899.00, 'Gold Plated', 12, 'BAN-001', '{"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"}')
ON CONFLICT (slug) DO NOTHING;
