"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { VeChainKitProvider } from "@vechain/vechain-kit";
import { persister, queryClient } from "../lib/queryClient";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ChakraProvider value={defaultSystem}>
        <VeChainKitProvider
          feeDelegation={{
            delegatorUrl: "https://sponsor-testnet.vechain.energy/by/441",
            delegateAllTransactions: false,
          }}
          loginMethods={[
            { method: "vechain", gridColumn: 4 },
            { method: "dappkit", gridColumn: 4 },
          ]}
          dappKit={{
            allowedWallets: ["veworld", "wallet-connect", "sync2"],
            walletConnectOptions: {
              projectId:
                process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
                "default_project_id",
              metadata: {
                name: "Digital Marketplace",
                description: "VeChain Digital Product Marketplace",
                url:
                  typeof window !== "undefined" ? window.location.origin : "",
                icons: ["https://path-to-logo.png"],
              },
            },
          }}
          darkMode={false}
          language="en"
          network={{
            type: "test",
          }}
        >
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </VeChainKitProvider>
      </ChakraProvider>
    </PersistQueryClientProvider>
  );
}
