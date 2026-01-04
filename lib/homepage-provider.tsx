/**
 * Home page content provider for managing hero and features data
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomePageContent, fetchHomePageContent } from "@/services/homepage";

interface HomePageContextType {
  content: HomePageContent | null;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined);

const HOMEPAGE_CACHE_KEY = "@payco_homepage_cache";
const CACHE_EXPIRY_MS = 1 * 10 * 1000;

interface CachedData {
  content: HomePageContent;
  timestamp: number;
}

export function HomePageProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load content from cache
   */
  const loadFromCache = async (): Promise<HomePageContent | null> => {
    try {
      const cached = await AsyncStorage.getItem(HOMEPAGE_CACHE_KEY);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      const isExpired = Date.now() - cachedData.timestamp > CACHE_EXPIRY_MS;

      if (isExpired) {
        await AsyncStorage.removeItem(HOMEPAGE_CACHE_KEY);
        return null;
      }

      return cachedData.content;
    } catch (error) {
      console.error("Error loading home page content from cache:", error);
      return null;
    }
  };

  /**
   * Save content to cache
   */
  const saveToCache = async (content: HomePageContent) => {
    try {
      const cachedData: CachedData = {
        content,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(HOMEPAGE_CACHE_KEY, JSON.stringify(cachedData));
    } catch (error) {
      console.error("Error saving home page content to cache:", error);
    }
  };

  /**
   * Load home page content
   */
  const loadContent = async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from cache first
      if (useCache) {
        const cachedContent = await loadFromCache();
        if (cachedContent) {
          setContent(cachedContent);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data from Contentful
      const freshContent = await fetchHomePageContent();
      setContent(freshContent);
      await saveToCache(freshContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load home page content");
      console.error("Error loading home page content:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh content (force fetch from API)
   */
  const refreshContent = async () => {
    await loadContent(false);
  };

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  return (
    <HomePageContext.Provider
      value={{
        content,
        loading,
        error,
        refreshContent,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
}

/**
 * Hook to access home page context
 */
export function useHomePageContent() {
  const context = useContext(HomePageContext);
  if (context === undefined) {
    throw new Error("useHomePageContent must be used within a HomePageProvider");
  }
  return context;
}
