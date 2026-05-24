import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const newCategories = [
  { name: 'Under 399', slug: 'under-399', description: 'Gifts under 399' },
  { name: 'Under 799', slug: 'under-799', description: 'Gifts under 799' },
  { name: 'Sets', slug: 'sets', description: 'Jewelry Sets' },
  { name: 'Anklets', slug: 'anklets', description: 'Anklets' }
];

async function seed() {
  console.log("Seeding new categories...");
  for (const cat of newCategories) {
    const { error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' });
    
    if (error) {
      console.error(`Error inserting ${cat.name}:`, error.message);
    } else {
      console.log(`Successfully added/updated: ${cat.name}`);
    }
  }
  console.log("Done!");
}

seed();
