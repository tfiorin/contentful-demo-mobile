import { describe, it, expect } from "vitest";

/**
 * Test to validate Contentful and Shopify API credentials
 */

describe("API Credentials", () => {
  it("should have Contentful credentials configured", () => {
    const spaceId = process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID;
    const accessToken = process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

    expect(spaceId).toBeDefined();
    expect(spaceId).toBeTruthy();
    expect(spaceId?.length).toBeGreaterThan(0);

    expect(accessToken).toBeDefined();
    expect(accessToken).toBeTruthy();
    expect(accessToken?.length).toBeGreaterThan(0);
  });

  it("should have Shopify credentials configured", () => {
    const storeDomain = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

    expect(storeDomain).toBeDefined();
    expect(storeDomain).toBeTruthy();
    expect(storeDomain?.includes("myshopify.com")).toBe(true);

    expect(storefrontToken).toBeDefined();
    expect(storefrontToken).toBeTruthy();
    expect(storefrontToken?.length).toBeGreaterThan(0);
  });

  it("should be able to fetch from Contentful API", async () => {
    const spaceId = process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID;
    const accessToken = process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&limit=1`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("items");
  }, 15000);

  it("should be able to fetch from Shopify Storefront API", async () => {
    const storeDomain = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

    const query = `
      query {
        products(first: 1) {
          edges {
            node {
              handle
              availableForSale
            }
          }
        }
      }
    `;

    const response = await fetch(
      `https://${storeDomain}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken || "",
        },
        body: JSON.stringify({ query }),
      }
    );

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("data");
  }, 15000);
});
