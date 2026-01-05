import { ScrollView, Text, View, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useHomePageContent } from "@/lib/homepage-provider";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const colors = useColors();

  // Map icon strings to icon names
  const iconMap: Record<string, "bolt.fill" | "shield.fill" | "cube.fill"> = {
    bolt: "bolt.fill",
    shield: "shield.fill",
    cube: "cube.fill",
  };

  const iconName = (iconMap[icon] || "cube.fill") as "bolt.fill" | "shield.fill" | "cube.fill";

  return (
    <View className="bg-surface rounded-2xl p-6 border border-border">
      <View className="items-center mb-4">
        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center">
          <IconSymbol name={iconName} size={32} color={colors.primary} />
        </View>
      </View>
      <Text className="text-lg font-semibold text-foreground text-center mb-2">{title}</Text>
      <Text className="text-sm text-muted text-center leading-relaxed">{description}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { content, loading, error, refreshContent } = useHomePageContent();
  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setImageError(false);
    await refreshContent();
    setRefreshing(false);
  };

  const handleViewProducts = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/products");
  };

  // Determine which features to display
  const featuresToDisplay =
    content && content.features && content.features.length > 0
      ? content.features
      : [
          {
            id: "default-1",
            title: "Fast & Reliable",
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
        ];

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {loading && !content ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-muted mt-4">Loading home page...</Text>
          </View>
        ) : error && !content ? (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Text className="text-error text-center mb-4">{error}</Text>
            <TouchableOpacity onPress={handleRefresh} className="bg-primary px-6 py-3 rounded-full">
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 gap-8">
            {/* Hero Section */}
            <View className="items-center gap-4 px-6">
              {/* Hero Banner Image */}
              {content?.bannerImage && !imageError && (
                <View className="w-full">
                  <Image
                    source={{ uri: content.bannerImage }}
                    style={{ 
                      width: '100%', 
                      height: 250,
                      resizeMode: 'cover'
                    }}
                    onError={() => {
                      console.error("Failed to load banner image:", content.bannerImage);
                      setImageError(true);
                    }}
                    onLoad={() => console.log("Banner image loaded successfully")}
                  />
                </View>
              )}
              <View className="bg-primary/10 px-6 py-2 rounded-full">
                <Text className="text-primary font-semibold text-base">
                  {content?.heroTitle || "Sale is now on!"}
                </Text>
              </View>
              <Text className="text-4xl font-bold text-foreground text-center">PayCo</Text>
              <Text className="text-base text-muted text-center leading-relaxed">
                {content?.heroDescription ||
                  "Advanced, technology-based commerce solutions for all types of businesses. Discover our cutting-edge hardware products designed to power your success."}
              </Text>
            </View>

            {/* Feature Highlights */}
            <View className="gap-4 px-6">
              {featuresToDisplay.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </View>

            {/* CTA Button */}
            <View className="items-center pb-8">
              <TouchableOpacity
                onPress={handleViewProducts}
                className="bg-primary px-8 py-4 rounded-full active:opacity-80"
              >
                <Text className="text-white font-semibold text-base">View Products</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}