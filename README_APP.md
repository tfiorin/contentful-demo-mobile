# PayCo Mobile App

A professional mobile commerce application showcasing advanced hardware solutions for businesses. Built with React Native, Expo, and integrated with Contentful CMS and Shopify for a complete commerce experience.

## Features

### Core Functionality
- **Home Screen**: Promotional banner with brand features and value propositions
- **Product Catalog**: Browse products in a responsive 2-column grid
- **Product Details**: View comprehensive product information with stock status
- **Real-time Inventory**: Shopify integration for live stock availability
- **Content Management**: Contentful CMS for easy product content updates
- **Pull-to-Refresh**: Update product data with a simple swipe

### Design & UX
- **Native iOS Experience**: Follows Apple Human Interface Guidelines
- **Dark Mode Support**: Automatic light/dark theme switching
- **Responsive Layout**: Optimized for all mobile screen sizes
- **Haptic Feedback**: Tactile feedback on interactions
- **Smooth Animations**: Polished transitions and interactions
- **Accessible**: WCAG AA compliant with proper contrast and labels

### Technical Stack
- **React Native 0.81** with Expo SDK 54
- **TypeScript 5.9** for type safety
- **NativeWind 4** (Tailwind CSS for React Native)
- **Expo Router 6** for navigation
- **TanStack Query** for data fetching and caching
- **AsyncStorage** for local data persistence
- **React Context** for state management

## Project Structure

```
app/                    # App screens and routing
├── (tabs)/             # Tab-based navigation
│   ├── index.tsx       # Home screen
│   └── products.tsx    # Products listing
├── product/
│   └── [slug].tsx      # Product detail (dynamic route)
└── _layout.tsx         # Root layout with providers

components/            # Reusable UI components
├── screen-container.tsx
└── ui/icon-symbol.tsx

services/              # API integration
├── contentful.ts      # Contentful API client
├── shopify.ts         # Shopify Storefront API
└── products.ts        # Combined product service

lib/                   # Utilities and providers
├── product-provider.tsx
└── utils.ts

types/                 # TypeScript interfaces
└── product.ts

hooks/                 # Custom React hooks
└── use-colors.ts
```

## Getting Started

### Prerequisites
- Node.js v18+
- pnpm v9+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd payco-mobile-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **View the app**
   - Web: http://localhost:8081
   - iOS: Press `i`
   - Android: Press `a`
   - Mobile: Scan QR code with Expo Go

### Configuration

Environment variables are pre-configured with your Contentful and Shopify credentials:
- `EXPO_PUBLIC_CONTENTFUL_SPACE_ID`
- `EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
- `EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

To update credentials, visit Manus Management UI → Settings → Secrets

## API Integration

### Contentful
The app fetches product content (titles, descriptions, images) from Contentful CMS:
- **Endpoint**: `https://cdn.contentful.com/spaces/{spaceId}/environments/master/entries`
- **Content Type**: `product`
- **Fields**: title, slug, description, price, image

### Shopify
Real-time inventory data is fetched from Shopify Storefront API:
- **Endpoint**: `https://{storeDomain}/api/2024-01/graphql.json`
- **Query**: Products with `handle`, `availableForSale`, `totalInventory`
- **Authentication**: Storefront Access Token

### Data Flow
1. App loads and fetches products from Contentful
2. Simultaneously fetches inventory from Shopify
3. Combines data: Contentful content + Shopify inventory
4. Caches data locally for 5 minutes
5. Displays to user with real-time stock status

## Development

### Available Scripts

```bash
pnpm dev              # Start dev server with hot reload
pnpm test             # Run test suite
pnpm check            # TypeScript type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm build            # Build for production
pnpm android          # Build for Android
pnpm ios              # Build for iOS
```

### Making Changes

1. Edit files in `app/`, `components/`, or `services/`
2. Save (Ctrl+S / Cmd+S)
3. Hot reload happens automatically
4. Check terminal for errors

### Adding New Screens

1. Create file in `app/(tabs)/` or `app/product/`
2. Use `ScreenContainer` component for proper SafeArea handling
3. Add route to `app/(tabs)/_layout.tsx` if needed
4. Use `router.push()` for navigation

### Styling

- Use Tailwind CSS classes in `className` prop
- Color tokens defined in `theme.config.js`
- Dark mode handled automatically (no `dark:` prefix needed)
- Custom colors: `bg-primary`, `text-foreground`, `border-border`, etc.

## Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
- API credential validation
- Contentful API connectivity
- Shopify API connectivity
- Data transformation and caching

## Deployment

### Web
```bash
pnpm build
# Deploy dist/ folder to hosting platform
```

### Mobile (via Expo EAS)
```bash
eas build --platform ios
eas build --platform android
```

## Performance Optimization

- **Image Caching**: Expo Image handles automatic caching
- **Data Caching**: 5-minute cache with AsyncStorage
- **Lazy Loading**: Product images load on demand
- **Efficient Rendering**: FlatList for product grid
- **Code Splitting**: Expo Router handles automatic code splitting

## Browser Support

- iOS 13+
- Android 8+
- Modern web browsers (Chrome, Safari, Firefox, Edge)

## Accessibility

- WCAG AA compliant
- Proper color contrast ratios
- Semantic HTML structure
- VoiceOver/TalkBack support
- Keyboard navigation

## Security

- API tokens stored in environment variables
- HTTPS for all API calls
- No sensitive data in localStorage
- Content Security Policy headers

## Troubleshooting

### App won't start
```bash
rm -rf node_modules .expo
pnpm install
pnpm dev
```

### Port already in use
```bash
EXPO_PORT=8082 pnpm dev
```

### API not connecting
- Check internet connection
- Verify environment variables
- Run `pnpm test` to validate credentials
- Check Contentful/Shopify dashboards

### Hot reload not working
- Save file again
- Manually refresh browser/device
- Restart dev server

## Documentation

- **[Quick Start](./QUICKSTART.md)** - Get running in 5 minutes
- **[VS Code Setup](./VSCODE_SETUP.md)** - Detailed setup guide
- **[Design Document](./design.md)** - UI/UX design specifications
- **[API Documentation](./server/README.md)** - Backend API reference

## Interview Presentation Tips

1. **Show the app running** on web or device
2. **Demonstrate navigation** between screens
3. **Explain the architecture**: Contentful + Shopify integration
4. **Highlight the code**: Show API services and data flow
5. **Discuss design decisions**: Tech stack, patterns, optimizations
6. **Show testing**: Run credential validation tests

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm test` and `pnpm check`
4. Submit a pull request

## License

Proprietary - PayCo Demo Project

## Support

For issues or questions, refer to:
- Expo Documentation: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Contentful: https://www.contentful.com/developers/
- Shopify: https://shopify.dev/

---

**Built with ❤️ using React Native and Expo**
