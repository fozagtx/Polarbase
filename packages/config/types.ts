import { Network } from "@repo/constants";
import { EnvConfig } from "./contracts";

/**
 * Application configuration type
 * Defines the structure for environment-specific configuration
 */
export type AppConfig = {
  /** Environment name: local, e2e, testnet, or mainnet */
  environment: EnvConfig;

  /** Base path for the application URL (optional) */
  basePath?: string;

  /** Smart contract address for the marketplace */
  marketplaceContractAddress: string;

  /** VeChain node URL for blockchain interactions */
  nodeUrl: string;

  /** Network configuration including genesis block and explorer details */
  network: Network;
};
