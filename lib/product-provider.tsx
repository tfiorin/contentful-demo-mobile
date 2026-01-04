/**
 * Product context provider for managing product data across the app
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/types/product";
import { fetchProducts } from "@/services/products";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_CACHE_KEY = "@payco_products_cache";
const CACHE_EXPIRY_MS = 1 * 10 * 1000;

interface CachedData {
  products: Product[];
  timestamp: number;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load products from cache
   */
  const loadFromCache = async (): Promise<Product[] | null> => {
    try {
      const cached = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      const isExpired = Date.now() - cachedData.timestamp > CACHE_EXPIRY_MS;

      if (isExpired) {
        await AsyncStorage.removeItem(PRODUCTS_CACHE_KEY);
        return null;
      }

      return cachedData.products;
    } catch (error) {
      console.error("Error loading products from cache:", error);
      return null;
    }
  };

  /**
   * Save products to cache
   */
  const saveToCache = async (products: Product[]) => {
    try {
      const cachedData: CachedData = {
        products,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(cachedData));
    } catch (error) {
      console.error("Error saving products to cache:", error);
    }
  };

  /**
   * Fetch products from APIs
   */
  const loadProducts = async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from cache first
      if (useCache) {
        const cachedProducts = await loadFromCache();
        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data from APIs
      const freshProducts = await fetchProducts();
      setProducts(freshProducts);
      await saveToCache(freshProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh products (force fetch from APIs)
   */
  const refreshProducts = async () => {
    await loadProducts(false);
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

/**
 * Hook to access product context
 */
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
