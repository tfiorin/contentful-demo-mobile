/**
 * Product types for PayCo mobile app
 * Combines data from Contentful (content) and Shopify (inventory)
 */

export interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    price: number;
    image: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    shopifyHandle?: string;
  };
}

export interface ShopifyProduct {
  handle: string;
  availableForSale: boolean;
  totalInventory: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  inventory: number;
}

export interface FeatureHighlight {
  icon: string;
  title: string;
  description: string;
}
