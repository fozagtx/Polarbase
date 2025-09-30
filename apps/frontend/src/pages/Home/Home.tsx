import { VStack } from "@chakra-ui/react";
import { MarketplaceCard } from "./components/MarketplaceCard";

export const Home = () => {
  return (
    <VStack align="stretch" gap={4}>
      <MarketplaceCard />
    </VStack>
  );
};
