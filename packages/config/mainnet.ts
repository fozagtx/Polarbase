import { AppConfig } from "./types";

/**
 * VeChain Mainnet configuration
 * Used for production deployment on VeChain's main network
 */
const config: AppConfig = {
  environment: "mainnet",
  basePath: "https://governance.vebetterdao.org",
  // Marketplace contract address to be set after mainnet deployment
  marketplaceContractAddress: "",
  nodeUrl: "https://mainnet.vechain.org",
  network: {
    id: "main",
    name: "main",
    type: "main",
    defaultNet: true,
    // Multiple node URLs for redundancy and load balancing
    urls: [
      "https://mainnet.vechain.org",
      "https://vethor-node.vechain.com",
      "https://mainnet.veblocks.net",
      "https://mainnet.vecha.in",
    ],
    explorerUrl: "https://insight.vecha.in/#/main",
    blockTime: 10000, // 10 seconds
    genesis: {
      number: 0,
      id: "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a",
      size: 170,
      parentID:
        "0xffffffff53616c757465202620526573706563742c20457468657265756d2100",
      timestamp: 1530316800,
      gasLimit: 10000000,
      beneficiary: "0x0000000000000000000000000000000000000000",
      gasUsed: 0,
      totalScore: 0,
      txsRoot:
        "0x45b0cfc220ceec5b7c1c62c4d4193d38e4aba48e8815729ce75f9c0ab0e4c1c0",
      txsFeatures: 0,
      stateRoot:
        "0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c",
      receiptsRoot:
        "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
      signer: "0x0000000000000000000000000000000000000000",
      isTrunk: true,
      transactions: [],
    },
  },
};

export default config;
