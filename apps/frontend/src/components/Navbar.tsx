'use client';

import { HStack, Heading, useBreakpointValue } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';

export const Navbar = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <HStack justify={'space-between'} p={2} borderBottom={'1px solid #EEEEEE'}>
      <Heading size={isMobile ? 'sm' : 'md'}>Digital Marketplace</Heading>
      <WalletButton />
    </HStack>
  );
};
