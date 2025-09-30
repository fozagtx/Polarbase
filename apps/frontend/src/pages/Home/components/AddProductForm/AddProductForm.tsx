import { useState } from "react";
import { Box, Button, Heading, Input, Spinner, VStack } from "@chakra-ui/react";
import { buildClause } from "../../../../utils/buildClause";
import { useMarketplace } from "../../../../hooks/useMarketplace";
import type { EnhancedClause } from "../../../../utils/hooks/useSendTransaction";

interface AddProductFormProps {
  onAddProduct: (clauses: EnhancedClause[]) => Promise<void>;
  isLoading: boolean;
  isConnected: boolean;
}

export const AddProductForm = ({
  onAddProduct,
  isLoading,
  isConnected,
}: AddProductFormProps) => {
  const [productName, setProductName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [sellerWallet, setSellerWallet] = useState("");
  const { contractAddress, contractInterface } = useMarketplace();

  const handleSubmit = async () => {
    if (!productName || !productLink || !productPrice || !sellerWallet) {
      alert("Please fill all fields");
      return;
    }

    try {
      const clause = buildClause({
        contractInterface,
        contractAddress,
        method: "addProduct",
        args: [productName, productLink, productPrice, sellerWallet],
      });

      await onAddProduct([clause]);

      // Clear form
      setProductName("");
      setProductLink("");
      setProductPrice("");
      setSellerWallet("");
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Heading size="sm" mb={3}>
        Add New Product
      </Heading>
      <VStack gap={3}>
        <Input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <Input
          placeholder="Download Link (e.g., IPFS or Google Drive link)"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
        />
        <Input
          placeholder="Price (in wei, e.g., 1000000000000000000 = 1 VET)"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          type="number"
        />
        <Input
          placeholder="Seller Wallet Address (0x...)"
          value={sellerWallet}
          onChange={(e) => setSellerWallet(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isConnected}
          colorScheme="blue"
          width="full"
        >
          {isLoading ? <Spinner size="sm" /> : "Add Product"}
        </Button>
      </VStack>
    </Box>
  );
};
