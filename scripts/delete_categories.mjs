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

async function deleteCategories() {
  console.log("Deleting Under 399 and Under 799 categories...");
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .in('slug', ['under-399', 'under-799']);
  
  if (error) {
    console.error(`Error deleting categories:`, error.message);
  } else {
    console.log(`Successfully deleted categories!`);
  }
}

deleteCategories();
