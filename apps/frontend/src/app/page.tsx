'use client';

import { Box, Container, VStack } from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/components/Home';
import { NotConnected } from '@/components/NotConnected';

export default function Page() {
  const { account } = useWallet();

  return (
    <Box h="full" bgColor="#f7f7f7">
      <VStack h="100vh" align="stretch" gap="0">
        <Navbar />
        <VStack align="stretch" flex="1" overflowY={'auto'} py={4}>
          <Container maxW="container.lg" h="full">
            <VStack align="stretch">
              {account ? <Home /> : <NotConnected />}
            </VStack>
          </Container>
        </VStack>
      </VStack>
    </Box>
  );
}
