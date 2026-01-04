/**
 * Shopify Storefront API service for fetching inventory data
 */

import { ShopifyProduct } from "@/types/product";

const SHOPIFY_STORE_DOMAIN = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_STOREFRONT_TOKEN = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "";
const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

interface ShopifyGraphQLResponse {
  data: {
    products: {
      edges: Array<{
        node: {
          handle: string;
          availableForSale: boolean;
          totalInventory: number;
        };
      }>;
    };
  };
}

/**
 * Fetch product inventory from Shopify Storefront API
 */
export async function fetchShopifyInventory(): Promise<ShopifyProduct[]> {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            handle
            availableForSale
            totalInventory
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data: ShopifyGraphQLResponse = await response.json();
    return data.data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("Error fetching inventory from Shopify:", error);
    throw error;
  }
}

/**
 * Fetch inventory for a specific product by handle
 */
export async function fetchShopifyProductInventory(
  handle: string
): Promise<ShopifyProduct | null> {
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        handle
        availableForSale
        totalInventory
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.productByHandle || null;
  } catch (error) {
    console.error("Error fetching product inventory from Shopify:", error);
    throw error;
  }
}
