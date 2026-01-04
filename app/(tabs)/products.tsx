import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useProducts } from "@/lib/product-provider";
import { router } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

function ProductCard({ product, onPress }: ProductCardProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-surface rounded-2xl overflow-hidden border border-border mb-4 active:opacity-70"
    >
      {/* Product Image */}
      <View className="aspect-square bg-background">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <IconSymbol name="cube.fill" size={48} color={colors.muted} />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-4">
        <Text className="text-base font-semibold text-foreground mb-1" numberOfLines={2}>
          {product.title}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary">${product.price}</Text>
          {!product.inStock && (
            <View className="flex-row items-center gap-1">
              <IconSymbol name="xmark.circle.fill" size={16} color={colors.error} />
              <Text className="text-xs text-error font-medium">Out of Stock</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductsScreen() {
  const { products, loading, error, refreshProducts } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.slug}` as any);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View className="flex-1 p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              Our Products
            </Text>
            <Text className="text-base text-muted text-center">
              Explore our range of professional hardware solutions
            </Text>
          </View>

          {/* Loading State */}
          {loading && products.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" />
              <Text className="text-muted mt-4">Loading products...</Text>
            </View>
          )}

          {/* Error State */}
          {error && products.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-error text-center mb-4">{error}</Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className="bg-primary px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product Grid - 2 columns */}
          {products.length > 0 && (
            <View className="flex-row flex-wrap justify-between">
              {products.map((product, index) => (
                <View key={product.id} className="w-[48%]">
                  <ProductCard product={product} onPress={() => handleProductPress(product)} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
