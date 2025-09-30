# Digital Product Marketplace - Architecture

## Contract Architecture (`packages/contracts/contracts/DigitalProductStore.sol`)

### Core Features
- **Decentralized marketplace** for digital products
- **Direct payments** to sellers (no middleman)
- **Access control** for download links

### Key Functions
- `addProduct(name, link, price, seller)` - List a new product
- `purchaseProduct(productId)` - Buy a product (payment goes directly to seller)
- `getProduct(productId)` - View product (buyers see download link)
- `deactivateProduct(productId)` - Seller can disable their product
- `hasUserPurchased(user, productId)` - Check purchase status

## Frontend Architecture (`apps/frontend/src`)

### Component Structure (Modular)

```
pages/Home/
├── Home.tsx (Main page)
└── components/
    ├── MarketplaceCard/ (Container)
    │   └── MarketplaceCard.tsx
    ├── ProductStats/ (Display total products)
    │   └── ProductStats.tsx
    ├── AddProductForm/ (Form to add products)
    │   └── AddProductForm.tsx
    └── ProductDisplay/ (View & purchase products)
        └── ProductDisplay.tsx
```

### Custom Hooks (`hooks/useMarketplace.ts`)
- `useMarketplace()` - Get contract address and interface
- `useGetProductCount()` - Fetch total products
- `useGetProduct(id)` - Fetch product details
- `usePurchaseProduct()` - Send purchase transaction
- `useAddProduct()` - Send add product transaction
- `useDeactivateProduct()` - Send deactivate transaction

### Utilities
- `buildClause.ts` - Helper to build transaction clauses
- `useCall.ts` - Hook for read-only contract calls
- `useSendTransaction.ts` - Hook for transactions

### Types (`types/marketplace.ts`)
```typescript
interface Product {
  name: string;
  link: string;
  price: string;
  seller: string;
  isActive: boolean;
}
```

## Flow

### Adding a Product
1. User fills form (name, link, price, seller wallet)
2. `AddProductForm` builds clause with `buildClause()`
3. Transaction sent to contract
4. Product stored on-chain

### Purchasing a Product
1. User enters product ID
2. `ProductDisplay` fetches product data
3. User clicks "Purchase"
4. Payment sent directly to seller wallet
5. Buyer gains access to download link

### Access Control
- Only buyers can see download links
- Sellers can deactivate their products
- No centralized control

## Deployment

**Testnet Contract:** `0xaA302b8DDEd08CD0B97e785F0c2de35034de2040`

**Explorer:** https://explore-testnet.vechain.org/accounts/0xaA302b8DDEd08CD0B97e785F0c2de35034de2040

## Tech Stack
- **Blockchain:** VeChain Thor
- **Smart Contracts:** Solidity 0.8.20
- **Frontend:** React + Vite + TypeScript
- **Web3:** VeChain DApp Kit
- **UI:** Chakra UI