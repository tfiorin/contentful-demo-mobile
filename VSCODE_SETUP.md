# PayCo Mobile App - VS Code Setup & Execution Guide

## Overview

This guide provides step-by-step instructions to set up and run the PayCo mobile app in VS Code. The app integrates with Contentful CMS and Shopify for a complete commerce solution.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v9 or higher) - Install with: `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)
- **VS Code** - [Download](https://code.visualstudio.com/)

For mobile testing:
- **iOS**: Xcode (macOS only) or Expo Go app on physical iPhone
- **Android**: Android Studio or Expo Go app on physical Android device
- **Web**: Any modern browser

## Step 1: Clone or Open the Project in VS Code

### Option A: Clone from Repository
```bash
git clone <your-repo-url> payco-mobile-app
cd payco-mobile-app
code .
```

### Option B: Open Existing Project
```bash
cd /path/to/payco-mobile-app
code .
```

## Step 2: Install Dependencies

Open the integrated terminal in VS Code (`` Ctrl+` `` on Windows/Linux, `` Cmd+` `` on macOS) and run:

```bash
pnpm install
```

This installs all required packages including:
- React Native & Expo
- TypeScript
- NativeWind (Tailwind CSS)
- TanStack Query
- And other dependencies

**Expected time**: 3-5 minutes

## Step 3: Configure Environment Variables

The app requires Contentful and Shopify API credentials. These have already been configured in the project, but if you need to update them:

1. Open the Manus Management UI (accessible from the project card in the chat)
2. Navigate to **Settings → Secrets**
3. Update the following environment variables:
   - `EXPO_PUBLIC_CONTENTFUL_SPACE_ID`
   - `EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
   - `EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

## Step 4: Start the Development Server

In the VS Code terminal, run:

```bash
pnpm dev
```

This command:
- Starts the Metro bundler (React Native development server)
- Starts the backend API server
- Displays a QR code for mobile testing
- Opens the web preview at `http://localhost:8081`

**Expected output**:
```
✓ Metro Bundler started
✓ Backend server running on http://localhost:3000
✓ Web preview available at http://localhost:8081
✓ Scan QR code with Expo Go to test on mobile
```

## Step 5: Test the App

### Option A: Web Browser (Easiest)
1. The dev server automatically opens a web preview
2. Or manually navigate to `http://localhost:8081`
3. You should see the PayCo home screen with features and a "View Products" button

### Option B: iOS Simulator (macOS only)
1. In VS Code terminal, press `i`
2. Xcode simulator will launch automatically
3. App will install and run in the simulator

### Option C: Android Emulator
1. Start Android emulator from Android Studio
2. In VS Code terminal, press `a`
3. App will install and run in the emulator

### Option D: Physical Device (Recommended)
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. In VS Code terminal, press `w` to show QR code
3. Scan QR code with your phone camera (iOS) or Expo Go app (Android)
4. App will load on your device

## Step 6: Verify the App is Working

### Home Screen
- You should see the PayCo logo and "Sale is now on!" banner
- Three feature cards: Fast & Reliable, Secure Payments, Quality Hardware
- "View Products" button at the bottom

### Products Screen
- Tap "View Products" or the Products tab
- See a 2-column grid of products
- Each product shows: image, name, and price
- Out-of-stock products have a red indicator

### Product Detail
- Tap any product card
- See full product image, description, and stock status
- "Add to Cart" and "Buy Now" buttons (demo functionality)
- Tap back arrow to return to products

## Development Workflow

### Making Changes

1. **Edit files** in VS Code (e.g., `app/(tabs)/index.tsx`)
2. **Save** the file (Ctrl+S / Cmd+S)
3. **Hot reload** happens automatically - just refresh your browser or device
4. **Check console** in VS Code terminal for any errors

### Common File Locations

| File | Purpose |
|------|---------|
| `app/(tabs)/index.tsx` | Home screen |
| `app/(tabs)/products.tsx` | Products listing screen |
| `app/product/[slug].tsx` | Product detail screen |
| `services/contentful.ts` | Contentful API integration |
| `services/shopify.ts` | Shopify API integration |
| `lib/product-provider.tsx` | Product data management |
| `tailwind.config.js` | App styling configuration |
| `app.config.ts` | App metadata and branding |

### Useful VS Code Extensions

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **Thunder Client** - rangav.vscode-thunder-client (for API testing)
4. **GitLens** - eamodio.gitlens (for git history)

## Debugging

### View Logs
- All logs appear in the VS Code terminal
- Use `console.log()` in your code to debug

### TypeScript Errors
- Run `pnpm check` to check for TypeScript errors
- Errors will appear in VS Code's Problems panel

### Test API Integration
- Run `pnpm test` to run the test suite
- This validates Contentful and Shopify credentials

## Building for Production

### Web Build
```bash
pnpm build
```

### iOS Build
```bash
eas build --platform ios
```

### Android Build
```bash
eas build --platform android
```

*Note: Requires Expo account and EAS CLI setup*

## Troubleshooting

### Port Already in Use
If port 8081 is already in use:
```bash
# Kill the process using the port
lsof -ti:8081 | xargs kill -9

# Or use a different port
EXPO_PORT=8082 pnpm dev
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .expo
pnpm install
```

### API Connection Issues
1. Verify environment variables in Manus Management UI
2. Check internet connection
3. Run `pnpm test` to validate credentials
4. Check Contentful and Shopify dashboards for API status

### Hot Reload Not Working
1. Save the file again
2. Manually refresh the browser or device
3. Restart the dev server: `pnpm dev`

## Project Structure

```
payco-mobile-app/
├── app/                          # App screens and routing
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx             # Home screen
│   │   └── products.tsx          # Products listing
│   ├── product/
│   │   └── [slug].tsx            # Product detail (dynamic route)
│   └── _layout.tsx               # Root layout with providers
├── components/                   # Reusable components
│   ├── screen-container.tsx      # SafeArea wrapper
│   └── ui/
│       └── icon-symbol.tsx       # Icon component
├── services/                     # API integration
│   ├── contentful.ts             # Contentful API
│   ├── shopify.ts                # Shopify API
│   └── products.ts               # Combined product service
├── lib/                          # Utilities and providers
│   ├── product-provider.tsx      # Product context
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript types
│   └── product.ts                # Product interfaces
├── hooks/                        # Custom React hooks
│   └── use-colors.ts             # Theme colors hook
├── assets/                       # Images and icons
│   └── images/
│       ├── icon.png              # App icon
│       └── splash-icon.png       # Splash screen
├── app.config.ts                 # Expo configuration
├── tailwind.config.js            # Tailwind CSS config
├── theme.config.js               # Color tokens
├── package.json                  # Dependencies
└── design.md                     # Design documentation
```

## Next Steps

1. **Customize Styling**: Edit `theme.config.js` to match your brand colors
2. **Add More Features**: Implement cart functionality or user authentication
3. **Deploy**: Use Expo EAS or your preferred deployment platform
4. **Test on Devices**: Use Expo Go for quick testing on real devices

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Contentful API**: https://www.contentful.com/developers/
- **Shopify Storefront API**: https://shopify.dev/api/storefront

## Tips for Interview Presentation

1. **Show the app running** on web browser or device
2. **Demonstrate navigation** between Home and Products screens
3. **Explain the architecture**: Contentful for content, Shopify for inventory
4. **Show the code**: Highlight the API integration services
5. **Discuss design decisions**: Why you chose this tech stack and architecture
6. **Mention testing**: Show the API credential validation tests

---

**Happy coding! 🚀**
