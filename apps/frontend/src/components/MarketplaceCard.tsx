"use client";

import { Box, Heading, VStack } from "@chakra-ui/react";
import { useWallet } from "@vechain/vechain-kit";
import {
  usePurchaseProduct,
  useAddProduct,
  useDeactivateProduct,
} from "../hooks/useMarketplace";
import { AddProductForm } from "./AddProductForm";
import { ProductDisplay } from "./ProductDisplay";
import type { EnhancedClause } from "../lib/hooks/useSendTransaction";

export const MarketplaceCard = () => {
  const { account } = useWallet();
  const {
    sendTransaction: purchaseProduct,
    sendTransactionPending: isPurchasing,
  } = usePurchaseProduct();
  const { sendTransaction: addProduct, sendTransactionPending: isAdding } =
    useAddProduct();
  const {
    sendTransaction: deactivateProduct,
    sendTransactionPending: isDeactivating,
  } = useDeactivateProduct();

  const handleAddProduct = async (clauses: EnhancedClause[]) => {
    return new Promise<void>((resolve, reject) => {
      addProduct(clauses, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  const handlePurchaseProduct = async (clauses: EnhancedClause[]) => {
    return new Promise<void>((resolve, reject) => {
      purchaseProduct(clauses, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  const handleDeactivateProduct = async (clauses: EnhancedClause[]) => {
    return new Promise<void>((resolve, reject) => {
      deactivateProduct(clauses, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="md">
      <Heading size="md" mb={4}>
        Digital Product Marketplace
      </Heading>
      <VStack align="stretch" gap={6}>
        <AddProductForm
          onAddProduct={handleAddProduct}
          isLoading={isAdding}
          isConnected={!!account}
        />
        <ProductDisplay
          onPurchase={handlePurchaseProduct}
          onDeactivate={handleDeactivateProduct}
          isPurchasing={isPurchasing}
          isDeactivating={isDeactivating}
          isConnected={!!account}
          connectedAccount={account?.address}
        />
      </VStack>
    </Box>
  );
};
