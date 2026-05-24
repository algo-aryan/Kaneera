-- Run this in your Supabase Dashboard SQL Editor
ALTER TABLE products ADD COLUMN IF NOT EXISTS recipient TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS material_color VARCHAR(100);
