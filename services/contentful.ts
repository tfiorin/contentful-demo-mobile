/**
 * Contentful service for fetching product and landing page content
 * Uses the REST API to match the web project's Contentful structure
 */

import { ContentfulProduct } from "@/types/product";

const CONTENTFUL_SPACE_ID = process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID || "";
const CONTENTFUL_ACCESS_TOKEN = process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "";
const CONTENTFUL_API_URL = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries`;

export interface ContentfulResponse {
  items: any[];
  includes?: {
    Asset: Array<{
      sys: { id: string };
      fields: {
        file: {
          url: string;
        };
      };
    }>;
    Entry: any[];
  };
}

/**
 * Transform Contentful REST API response to ContentfulProduct format
 */
function transformContentfulEntry(entry: any): ContentfulProduct {
  const fields = entry.fields;

  return {
    sys: {
      id: entry.sys.id,
    },
    fields: {
      title: fields.name || fields.title || "",
      slug: fields.slug || "",
      description: fields.description || "",
      price: fields.price || 0,
      image: {
        fields: {
          file: {
            url: fields.featuredProductImage?.sys?.id || "",
          },
        },
      },
      shopifyHandle: fields.sku || "",
    },
  };
}

/**
 * Resolve asset URL from includes
 */
function resolveAssetUrl(assetId: string, includes?: ContentfulResponse["includes"]): string {
  if (!includes?.Asset) return "";
  const asset = includes.Asset.find((a) => a.sys.id === assetId);
  return asset?.fields.file.url || "";
}

/**
 * Resolve entry from includes
 */
function resolveEntry(entryId: string, includes?: ContentfulResponse["includes"]): any {
  if (!includes?.Entry) return null;
  return includes.Entry.find((e) => e.sys.id === entryId);
}

/**
 * Fetch all products from Contentful (pageProduct content type)
 */
export async function fetchContentfulProducts(): Promise<ContentfulProduct[]> {
  try {
    const url = new URL(CONTENTFUL_API_URL);
    url.searchParams.append("content_type", "pageProduct");
    url.searchParams.append("access_token", CONTENTFUL_ACCESS_TOKEN);
    url.searchParams.append("include", "2");
    url.searchParams.append("limit", "100");
    url.searchParams.append("locale", "en-US");

    console.log("Fetching products from Contentful");

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Contentful API error response:", errorData);
      throw new Error(`Contentful API error: ${response.status}`);
    }

    const data: ContentfulResponse = await response.json();
    console.log(`Fetched ${data.items.length} products from Contentful`);

    // Transform entries and resolve asset URLs
    const products = data.items.map((entry) => {
      const product = transformContentfulEntry(entry);

      // Resolve image URL if it's an asset ID
      if (product.fields.image?.fields?.file?.url && data.includes?.Asset) {
        const assetUrl = resolveAssetUrl(product.fields.image.fields.file.url, data.includes);
        if (assetUrl) {
          product.fields.image.fields.file.url = `https:${assetUrl}`;
        }
      }

      return product;
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from Contentful:", error);
    throw error;
  }
}

/**
 * Fetch a single product by slug from Contentful
 */
export async function fetchContentfulProductBySlug(
  slug: string
): Promise<ContentfulProduct | null> {
  try {
    const url = new URL(CONTENTFUL_API_URL);
    url.searchParams.append("content_type", "pageProduct");
    url.searchParams.append("fields.slug", slug);
    url.searchParams.append("access_token", CONTENTFUL_ACCESS_TOKEN);
    url.searchParams.append("include", "2");
    url.searchParams.append("limit", "1");
    url.searchParams.append("locale", "en-US");

    console.log("Fetching product by slug from Contentful:", slug);

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Contentful API error response:", errorData);
      throw new Error(`Contentful API error: ${response.status}`);
    }

    const data: ContentfulResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      console.log(`No product found with slug: ${slug}`);
      return null;
    }

    const entry = data.items[0];
    const product = transformContentfulEntry(entry);

    // Resolve image URL if it's an asset ID
    if (product.fields.image?.fields?.file?.url && data.includes?.Asset) {
      const assetUrl = resolveAssetUrl(product.fields.image.fields.file.url, data.includes);
      if (assetUrl) {
        product.fields.image.fields.file.url = `https:${assetUrl}`;
      }
    }

    return product;
  } catch (error) {
    console.error("Error fetching product from Contentful:", error);
    throw error;
  }
}

/**
 * Fetch landing page content from Contentful (pageLanding content type)
 */
export async function fetchLandingPageContent(): Promise<any> {
  try {
    const url = new URL(CONTENTFUL_API_URL);
    url.searchParams.append("content_type", "pageLanding");
    url.searchParams.append("access_token", CONTENTFUL_ACCESS_TOKEN);
    url.searchParams.append("include", "3");
    url.searchParams.append("limit", "1");
    url.searchParams.append("locale", "en-US");

    console.log("Fetching landing page from Contentful");

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Contentful API error response:", errorData);
      throw new Error(`Contentful API error: ${response.status}`);
    }

    const data: ContentfulResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      console.log("No landing page found in Contentful");
      return null;
    }

    const landingPage = data.items[0];
    const fields = landingPage.fields;

    // Resolve hero banner entry
    const heroBanner = fields.heroBanner?.sys?.id
      ? resolveEntry(fields.heroBanner.sys.id, data.includes)
      : null;

    console.log("Resolved hero banner:", heroBanner);

    // Resolve feature entries
    const leftFeature = fields.leftFeature?.sys?.id
      ? resolveEntry(fields.leftFeature.sys.id, data.includes)
      : null;

    const middleFeature = fields.middleFeature?.sys?.id
      ? resolveEntry(fields.middleFeature.sys.id, data.includes)
      : null;

    const rightFeature = fields.rightFeature?.sys?.id
      ? resolveEntry(fields.rightFeature.sys.id, data.includes)
      : null;

    return {
      sys: landingPage.sys,
      fields: {
        heroBanner,
        leftFeature,
        middleFeature,
        rightFeature,
      },
    };
  } catch (error) {
    console.error("Error fetching landing page from Contentful:", error);
    throw error;
  }
}
