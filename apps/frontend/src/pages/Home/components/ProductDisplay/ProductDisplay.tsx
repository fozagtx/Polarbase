import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGetProduct } from "../../../../hooks/useMarketplace";
import { buildClause } from "../../../../utils/buildClause";
import { useMarketplace } from "../../../../hooks/useMarketplace";
import type { EnhancedClause } from "../../../../utils/hooks/useSendTransaction";

interface ProductDisplayProps {
  onPurchase: (clauses: EnhancedClause[]) => Promise<void>;
  onDeactivate: (clauses: EnhancedClause[]) => Promise<void>;
  isPurchasing: boolean;
  isDeactivating: boolean;
  isConnected: boolean;
  connectedAccount?: string;
}

export const ProductDisplay = ({
  onPurchase,
  onDeactivate,
  isPurchasing,
  isDeactivating,
  isConnected,
  connectedAccount,
}: ProductDisplayProps) => {
  const [viewProductId, setViewProductId] = useState("");
  const { contractAddress, contractInterface } = useMarketplace();
  const {
    data: productData,
    isLoading: productLoading,
    refetch: refetchProduct,
  } = useGetProduct(viewProductId ? parseInt(viewProductId) : -1);

  const handlePurchase = async () => {
    if (!viewProductId || !productData) return;

    try {
      const clause = buildClause({
        contractInterface,
        contractAddress,
        method: "purchaseProduct",
        args: [parseInt(viewProductId)],
        value: productData[2]?.toString(),
      });

      await onPurchase([clause]);
      alert("Product purchased! Refresh to see download link.");
      refetchProduct();
    } catch (error) {
      console.error(error);
      alert("Failed to purchase product");
    }
  };

  const handleDeactivate = async () => {
    if (!viewProductId) return;

    try {
      const clause = buildClause({
        contractInterface,
        contractAddress,
        method: "deactivateProduct",
        args: [parseInt(viewProductId)],
      });

      await onDeactivate([clause]);
      alert("Product deactivated!");
      refetchProduct();
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate product");
    }
  };

  const isSeller =
    connectedAccount &&
    productData?.[3] &&
    productData[3].toLowerCase() === connectedAccount.toLowerCase();

  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Heading size="sm" mb={3}>
        View & Purchase Product
      </Heading>
      <VStack gap={3}>
        <Input
          placeholder="Enter Product ID (starting from 0)"
          value={viewProductId}
          onChange={(e) => setViewProductId(e.target.value)}
          type="number"
        />

        {productLoading && <Spinner />}

        {productData && (
          <Box
            borderWidth="1px"
            borderRadius="md"
            p={4}
            width="full"
            bg="gray.50"
          >
            <VStack align="start" gap={2}>
              <Text>
                <strong>Name:</strong> {productData[0]}
              </Text>
              <Text>
                <strong>Price:</strong> {productData[2]?.toString()} wei
              </Text>
              <Text>
                <strong>Seller:</strong> {productData[3]}
              </Text>
              <Text>
                <strong>Active:</strong> {productData[4] ? "Yes" : "No"}
              </Text>

              {productData[1] && (
                <Box width="full" p={2} bg="green.100" borderRadius="md">
                  <Text>
                    <strong>Download Link:</strong>
                  </Text>
                  <Text wordBreak="break-all" color="blue.600">
                    {productData[1]}
                  </Text>
                </Box>
              )}

              {productData[4] && !productData[1] && (
                <Button
                  onClick={handlePurchase}
                  disabled={isPurchasing || !isConnected}
                  colorScheme="green"
                  width="full"
                >
                  {isPurchasing ? <Spinner size="sm" /> : "Purchase Product"}
                </Button>
              )}

              {isSeller && (
                <Button
                  onClick={handleDeactivate}
                  disabled={isDeactivating || !productData[4]}
                  colorScheme="red"
                  width="full"
                >
                  {isDeactivating ? (
                    <Spinner size="sm" />
                  ) : (
                    "Deactivate Product"
                  )}
                </Button>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
