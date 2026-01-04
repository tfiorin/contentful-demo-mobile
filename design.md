# PayCo Mobile App - Design Document

## Overview

PayCo is a mobile commerce application showcasing professional hardware solutions for businesses. The app integrates with **Contentful CMS** for content management and **Shopify** for inventory tracking, replicating the functionality of the Next.js demo website.

## Design Philosophy

The app follows **Apple Human Interface Guidelines (HIG)** to deliver a native iOS experience while maintaining cross-platform compatibility. The design prioritizes clarity, efficiency, and one-handed usability in portrait orientation (9:16 aspect ratio).

## Color Palette

The app uses a professional, technology-focused color scheme that conveys trust and reliability:

- **Primary Brand Color**: `#0a7ea4` (Teal Blue) - Used for accents, CTAs, and interactive elements
- **Background**: `#ffffff` (Light) / `#151718` (Dark)
- **Surface**: `#f5f5f5` (Light) / `#1e2022` (Dark) - Cards and elevated surfaces
- **Text Primary**: `#11181C` (Light) / `#ECEDEE` (Dark)
- **Text Secondary**: `#687076` (Light) / `#9BA1A6` (Dark)
- **Border**: `#E5E7EB` (Light) / `#334155` (Dark)
- **Success**: `#22C55E` (In Stock indicator)
- **Error**: `#EF4444` (Out of Stock indicator)

## Screen Structure

### 1. Home Screen (Main Tab)

**Purpose**: Welcome users and showcase the brand's value propositions

**Layout**:
- Hero section with promotional banner ("Sale is now on!")
- Brand tagline explaining PayCo's mission
- Three feature highlight cards in a vertical stack:
  - Fast & Reliable (Lightning icon)
  - Secure Payments (Shield icon)
  - Quality Hardware (Box icon)
- "View Products" call-to-action button
- Smooth scroll experience with pull-to-refresh capability

**Content Source**: Contentful (hero text, feature descriptions)

### 2. Products Screen (Products Tab)

**Purpose**: Display all available hardware products in a browsable grid

**Layout**:
- Section header: "Our Products" with subtitle
- 2-column grid layout optimized for mobile viewing
- Each product card contains:
  - Product image (square aspect ratio)
  - Product name
  - Price (prominent display)
  - Stock status badge (if out of stock)
- Cards have subtle shadows and rounded corners
- Tap interaction scales card slightly (0.97) with haptic feedback

**Content Source**: 
- Product details from Contentful (name, description, images)
- Inventory status from Shopify (in stock / out of stock)

### 3. Product Detail Screen (Modal/Push)

**Purpose**: Show comprehensive information about a selected product

**Layout**:
- Large product image at top (full width, 1:1 aspect ratio)
- Back button in top-left corner
- Product information section:
  - Product name (large, bold)
  - Price (prominent)
  - Stock status indicator with icon and text
  - Description section with heading
  - Full product description text
- Action buttons at bottom:
  - "Add to Cart" (outlined, secondary style)
  - "Buy Now" (filled, primary style)
- Buttons are full-width with proper spacing

**Content Source**: 
- Contentful (product details, descriptions, images)
- Shopify (stock availability)

**Note**: For this demo, cart and purchase functionality will show confirmation messages rather than full e-commerce flow.

## Navigation Pattern

**Bottom Tab Navigation** (iOS standard):
- **Home Tab**: House icon - Welcome screen with features
- **Products Tab**: Grid icon - Product catalog

Tab bar styling:
- Height: 56px + safe area bottom inset
- Background: Matches app background color
- Active tint: Primary brand color
- Inactive tint: Muted text color
- Subtle top border for separation

## Typography

Following iOS typography standards:
- **Large Title**: 34px, Bold - Screen headers
- **Title 1**: 28px, Bold - Section headers
- **Title 2**: 22px, Semibold - Card headers
- **Body**: 17px, Regular - Main content
- **Subheadline**: 15px, Regular - Secondary text
- **Caption**: 13px, Regular - Metadata, labels

Line height: 1.4× font size for optimal readability

## Interaction Design

**Touch Targets**: Minimum 44×44pt for all interactive elements

**Feedback Patterns**:
- Primary buttons: Scale to 0.97 + light haptic
- Product cards: Opacity to 0.7 on press + light haptic
- Tab switches: Medium haptic feedback

**Animations**: Subtle and purposeful
- Screen transitions: Standard iOS push/modal animations
- Card press: 80ms scale animation
- Loading states: Spinner with brand color

## Product Data Structure

### Contentful Content Model

```
Product {
  title: String
  slug: String
  description: Text
  price: Number
  image: Media
  category: String (optional)
}
```

### Shopify Integration

The app queries Shopify's Storefront API to fetch:
- Product availability (in stock / out of stock)
- Inventory quantities
- Product variants (if applicable)

Products are matched between Contentful and Shopify using product slugs or SKUs.

## Key User Flows

### Flow 1: Browse Products
1. User opens app → Lands on Home screen
2. User taps "View Products" or switches to Products tab
3. Products grid loads with images, names, and prices
4. User scrolls through available products

### Flow 2: View Product Details
1. User taps a product card from Products screen
2. Product detail screen opens with full information
3. User reads description and checks stock status
4. User can tap back to return to product list

### Flow 3: Product Actions (Demo)
1. User taps "Add to Cart" → Shows confirmation message
2. User taps "Buy Now" → Shows confirmation message
3. For demo purposes, no actual cart or checkout is implemented

## Technical Implementation Notes

**API Integration**:
- Contentful Delivery API for fetching product content
- Shopify Storefront API for inventory data
- Data is fetched on app launch and cached locally
- Pull-to-refresh updates product data

**State Management**: 
- React Context for global product data
- AsyncStorage for caching product information
- TanStack Query for API data fetching and caching

**Performance**:
- Images optimized and cached using Expo Image
- Lazy loading for product images
- Efficient FlatList rendering for product grid

**Error Handling**:
- Graceful fallbacks if API calls fail
- Cached data shown while refreshing
- User-friendly error messages

## Accessibility

- All interactive elements have accessible labels
- Sufficient color contrast ratios (WCAG AA)
- Support for dynamic type sizing
- VoiceOver/TalkBack compatible navigation

## Platform Considerations

**iOS**: 
- Native SF Symbols for icons
- Standard iOS navigation patterns
- Haptic feedback on interactions

**Android**: 
- Material Icons as fallback
- Edge-to-edge display with proper insets
- Vibration feedback on interactions

**Web**: 
- Responsive layout adapts to browser window
- Mouse hover states for interactive elements
- Keyboard navigation support
