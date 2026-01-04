# PayCo Mobile App - Quick Start

Get the PayCo mobile app running in 5 minutes!

## 1. Install Dependencies
```bash
cd payco-mobile-app
pnpm install
```

## 2. Start Development Server
```bash
pnpm dev
```

## 3. View the App

Choose one:

- **Web Browser**: Open http://localhost:8081
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal
- **Physical Device**: Scan QR code with Expo Go app

## 4. Test the Features

1. **Home Screen**: See the PayCo welcome with features
2. **Products Tab**: Browse 2-column product grid
3. **Product Detail**: Tap a product to see full details
4. **Pull to Refresh**: Swipe down to refresh products

## What's Included

✅ Home screen with hero banner and features  
✅ Product listing with images and prices  
✅ Product detail pages with stock status  
✅ Contentful CMS integration  
✅ Shopify inventory integration  
✅ Dark mode support  
✅ Responsive mobile design  

## Environment Variables

Already configured with your credentials:
- `EXPO_PUBLIC_CONTENTFUL_SPACE_ID`
- `EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN`
- `EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

To update: Go to Manus Management UI → Settings → Secrets

## Useful Commands

```bash
pnpm dev              # Start development server
pnpm test             # Run tests
pnpm check            # Check TypeScript
pnpm lint             # Run linter
pnpm build            # Build for production
```

## Troubleshooting

**Port 8081 in use?**
```bash
EXPO_PORT=8082 pnpm dev
```

**Dependencies issue?**
```bash
rm -rf node_modules .expo
pnpm install
```

**API not connecting?**
- Check internet connection
- Verify environment variables in Manus UI
- Run `pnpm test` to validate credentials

## For Interview Presentation

1. Run `pnpm dev`
2. Open http://localhost:8081 in browser
3. Show Home screen → Products → Product detail
4. Explain Contentful + Shopify integration
5. Show code in VS Code

---

**Need more help?** See `VSCODE_SETUP.md` for detailed instructions.
