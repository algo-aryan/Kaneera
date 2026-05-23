"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const imageUrlsString = formData.get('imageUrls') as string;

  if (!name || !price || !categoryId || !imageUrlsString) {
    throw new Error("Missing required fields");
  }

  const imageUrls = JSON.parse(imageUrlsString);

  // Create slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      slug,
      description,
      price,
      category_id: categoryId,
      image_urls: imageUrls,
      is_active: true
    });

  if (error) {
    console.error("Error inserting product:", error);
    throw new Error("Failed to add product");
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/'); // Revalidate public catalog
}

export async function editProduct(id: string, formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const imageUrlsString = formData.get('imageUrls') as string;

  if (!name || !price || !categoryId || !imageUrlsString) {
    throw new Error("Missing required fields");
  }

  const imageUrls = JSON.parse(imageUrlsString);

  // Create slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      name,
      slug,
      description,
      price,
      category_id: categoryId,
      image_urls: imageUrls
    })
    .eq('id', id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to edit product");
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath(`/product/${slug}`);
}

export async function archiveProduct(id: string, currentStatus: boolean) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: !currentStatus }) // toggle it
    .eq('id', id);

  if (error) {
    console.error("Error archiving product:", error);
    throw new Error("Failed to archive product");
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function hardDeleteProduct(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error hard deleting product:", error);
    throw new Error("Failed to delete product permanently");
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/');
}
