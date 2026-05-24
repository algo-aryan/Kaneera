-- Run this in your Supabase Dashboard SQL Editor
-- We need recipient to be an array of text so a product can have multiple recipients (e.g. Mother AND Sister)
ALTER TABLE products DROP COLUMN IF EXISTS recipient;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recipient TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS material_color VARCHAR(100);
