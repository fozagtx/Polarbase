import { AppConfig } from "./types";

/**
 * VeChain Testnet configuration
 * Used for testing on VeChain's public test network
 */
const config: AppConfig = {
  environment: "testnet",
  basePath: "https://example.org",
  marketplaceContractAddress: "0xaA302b8DDEd08CD0B97e785F0c2de35034de2040",
  nodeUrl: "https://testnet.vechain.org",
  network: {
    id: "testnet",
    name: "testnet",
    type: "test",
    defaultNet: true,
    // Multiple node URLs for redundancy
    urls: [
      "https://testnet.vechain.org",
      "https://vethor-node-test.vechaindev.com",
      "https://sync-testnet.veblocks.net",
      "https://testnet.vecha.in",
    ],
    explorerUrl: "https://insight.vecha.in/#/test",
    blockTime: 10000, // 10 seconds
    genesis: {
      number: 0,
      id: "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127",
      size: 170,
      parentID:
        "0xffffffff00000000000000000000000000000000000000000000000000000000",
      timestamp: 1530014400,
      gasLimit: 10000000,
      beneficiary: "0x0000000000000000000000000000000000000000",
      gasUsed: 0,
      totalScore: 0,
      txsRoot:
        "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
      txsFeatures: 0,
      stateRoot:
        "0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb",
      receiptsRoot:
        "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
      signer: "0x0000000000000000000000000000000000000000",
      isTrunk: true,
      transactions: [],
    },
  },
};

export default config;
