/**
 * Home page content service for fetching hero and features from Contentful
 * Uses the pageLanding content type to match the web project structure
 */

import { fetchLandingPageContent } from "./contentful";

export interface HomePageContent {
  heroTitle: string;
  heroDescription: string;
  bannerImage?: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Transform Contentful landing page to HomePageContent format
 */
async function transformLandingPage(landingPage: any): Promise<HomePageContent> {
  const fields = landingPage?.fields || {};

  // Extract hero content
  const heroBanner = fields.heroBanner?.fields || {};
  const heroTitle = heroBanner.heroBannerHeadline || "Hardcoded: Sale is now on!";
  const heroDescription =
    heroBanner.heroHeadlineText ||
    "Hardcoded: PayCo provides advanced, technology-based commerce solutions for all types of businesses. Discover our cutting-edge hardware products designed to power your success.";

  // Extract hero banner image
  let bannerImage: string | undefined;
  if (heroBanner.heroBannerImage?.file?.url) {
    // Image URL from Contentful asset
    bannerImage = `https:${heroBanner.heroBannerImage.file.url}`;
  } else if (heroBanner.heroBannerImage?.sys?.id) {
    // If it's just an asset ID, it should have been resolved by fetchLandingPageContent
    bannerImage = heroBanner.heroBannerImage.sys.id;
  }

  //console.log("Resolved banner image URL:", heroBanner.heroBannerImage, heroBanner.heroBannerImage?.file, heroBanner.heroBannerImage?.file?.url, bannerImage);

  // Extract features
  const features: Feature[] = [];

  if (fields.leftFeature?.fields) {
    features.push({
      id: fields.leftFeature.sys.id,
      title: fields.leftFeature.fields.title || "Fast & Reliable",
      description:
        fields.leftFeature.fields.description ||
        "Industry-leading performance and reliability for your business operations",
      icon: "bolt",
    });
  }

  if (fields.middleFeature?.fields) {
    features.push({
      id: fields.middleFeature.sys.id,
      title: fields.middleFeature.fields.title || "Secure Payments",
      description:
        fields.middleFeature.fields.description ||
        "Bank-level security with end-to-end encryption for all transactions",
      icon: "shield",
    });
  }

  if (fields.rightFeature?.fields) {
    features.push({
      id: fields.rightFeature.sys.id,
      title: fields.rightFeature.fields.title || "Quality Hardware",
      description:
        fields.rightFeature.fields.description ||
        "Premium hardware designed and tested for demanding business environments",
      icon: "cube",
    });
  }

  return {
    heroTitle,
    heroDescription,
    bannerImage,
    features,
  };
}

/**
 * Fetch home page content from Contentful
 */
export async function fetchHomePageContent(): Promise<HomePageContent> {
  try {
    const landingPage = await fetchLandingPageContent();

    if (!landingPage) {
      console.log("No landing page found, using defaults");
      return getDefaultContent();
    }

    return transformLandingPage(landingPage);
  } catch (error) {
    console.error("Error fetching home page content from Contentful:", error);
    // Return default content if fetch fails
    return getDefaultContent();
  }
}

/**
 * Get default home page content
 */
function getDefaultContent(): HomePageContent {
  return {
    heroTitle: "Sale is now on!",
    heroDescription:
      "PayCo provides advanced, technology-based commerce solutions for all types of businesses. Discover our cutting-edge hardware products designed to power your success.",
    features: [
      {
        id: "default-1",
        title: "Fast & Reliable - hardcoded",
        description: "Industry-leading performance and reliability for your business operations",
        icon: "bolt",
      },
      {
        id: "default-2",
        title: "Secure Payments",
        description: "Bank-level security with end-to-end encryption for all transactions",
        icon: "shield",
      },
      {
        id: "default-3",
        title: "Quality Hardware",
        description: "Premium hardware designed and tested for demanding business environments",
        icon: "cube",
      }, 
    ],
  };
}

/**
 * Fetch features from Contentful landing page
 */
export async function fetchFeatures(): Promise<Feature[]> {
  try {
    const content = await fetchHomePageContent();
    return content.features;
  } catch (error) {
    console.error("Error fetching features from Contentful:", error);
    return getDefaultContent().features;
  }
}
