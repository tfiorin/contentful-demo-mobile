import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useProducts } from "@/lib/product-provider";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ProductDetailScreen() {
  const colors = useColors();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { products, loading } = useProducts();

  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [products, slug]);

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAddToCart = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      "Added to Cart",
      `${product?.title} has been added to your cart.`,
      [{ text: "OK" }]
    );
  };

  const handleBuyNow = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      "Purchase Initiated",
      `Proceeding to checkout for ${product?.title}.`,
      [{ text: "OK" }]
    );
  };

  if (loading && !product) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="text-muted mt-4">Loading product...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!product) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-foreground text-xl font-semibold mb-4">Product Not Found</Text>
          <TouchableOpacity onPress={handleBack} className="bg-primary px-6 py-3 rounded-full">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {/* Back Button */}
          <View className="p-4">
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center gap-2 self-start"
            >
              <IconSymbol name="arrow.left" size={24} color={colors.primary} />
              <Text className="text-primary font-semibold">Back to Products</Text>
            </TouchableOpacity>
          </View>

          {/* Product Image */}
          <View className="aspect-square bg-background mx-4 rounded-2xl overflow-hidden border border-border">
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <IconSymbol name="cube.fill" size={80} color={colors.muted} />
              </View>
            )}
          </View>

          {/* Product Info */}
          <View className="p-6 gap-4">
            {/* Title and Price */}
            <View>
              <Text className="text-3xl font-bold text-foreground mb-2">{product.title}</Text>
              <Text className="text-2xl font-bold text-primary">${product.price}</Text>
            </View>

            {/* Stock Status */}
            <View className="flex-row items-center gap-2">
              {product.inStock ? (
                <>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  <Text className="text-success font-semibold">In Stock</Text>
                </>
              ) : (
                <>
                  <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
                  <View>
                    <Text className="text-error font-semibold">Out of Stock</Text>
                    <Text className="text-muted text-sm">Currently unavailable</Text>
                  </View>
                </>
              )}
            </View>

            {/* Description */}
            <View>
              <Text className="text-xl font-semibold text-foreground mb-2">Description</Text>
              <Text className="text-base text-muted leading-relaxed">{product.description}</Text>
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mt-4">
              <TouchableOpacity
                onPress={handleAddToCart}
                disabled={!product.inStock}
                className={`border-2 border-primary py-4 rounded-full ${
                  !product.inStock ? "opacity-50" : ""
                }`}
              >
                <Text className="text-primary font-semibold text-center text-base">
                  Add to Cart
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBuyNow}
                disabled={!product.inStock}
                className={`bg-primary py-4 rounded-full ${!product.inStock ? "opacity-50" : ""}`}
              >
                <Text className="text-white font-semibold text-center text-base">Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
