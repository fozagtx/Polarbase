'use client';

import { Box, Text, Spinner } from '@chakra-ui/react';
import { useGetProductCount } from '@/hooks/useMarketplace';

export const ProductStats = () => {
  const { data: productCount, isLoading: countLoading } = useGetProductCount();

  return (
    <Box>
      <Text fontWeight="bold">
        Total Products:{' '}
        {countLoading ? <Spinner size="sm" /> : productCount?.toString() || '0'}
      </Text>
    </Box>
  );
};
