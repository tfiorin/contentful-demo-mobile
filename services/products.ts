/**
 * Product service that combines Contentful and Shopify data
 */

import { Product, ContentfulProduct, ShopifyProduct } from "@/types/product";
import { fetchContentfulProducts } from "./contentful";
import { fetchShopifyInventory } from "./shopify";

/**
 * Transform Contentful product to app Product format
 */
function transformContentfulProduct(
  contentfulProduct: ContentfulProduct,
  shopifyInventory: Map<string, ShopifyProduct>
): Product {
  const { sys, fields } = contentfulProduct;
  const imageUrl = fields.image?.fields?.file?.url
    ? `https:${fields.image.fields.file.url}`
    : "";

  // Match with Shopify inventory using slug or shopifyHandle
  const handle = fields.shopifyHandle || fields.slug;
  const shopifyData = shopifyInventory.get(handle);

  return {
    id: sys.id,
    title: fields.title,
    slug: fields.slug,
    description: fields.description,
    price: fields.price,
    imageUrl,
    inStock: shopifyData?.availableForSale ?? true,
    inventory: shopifyData?.totalInventory ?? 0,
  };
}

/**
 * Fetch all products with combined Contentful and Shopify data
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Fetch data from both sources in parallel
    const [contentfulProducts, shopifyProducts] = await Promise.all([
      fetchContentfulProducts(),
      fetchShopifyInventory(),
    ]);

    // Create a map of Shopify inventory by handle for quick lookup
    const shopifyInventoryMap = new Map<string, ShopifyProduct>(
      shopifyProducts.map((product) => [product.handle, product])
    );

    // Transform and combine the data
    const products = contentfulProducts.map((contentfulProduct) =>
      transformContentfulProduct(contentfulProduct, shopifyInventoryMap)
    );

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await fetchProducts();
    return products.find((product) => product.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
}
