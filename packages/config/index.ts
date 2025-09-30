import mainnetConfig from "./mainnet";
import localConfig from "./local";
import testnetConfig from "./testnet";
import { EnvConfig, getContractsConfig } from "./contracts";
import { AppConfigAppConfig } from "../typestypes";

// Re-export the AppConfig type for consumers
export type { AppConfig };

/**
 * Get application configuration based on environment
 * @param env - Optional environment override. If not provided, uses VITE_APP_ENV
 * @returns AppConfig for the specified environment
 * @throws Error if VITE_APP_ENV is not set or unsupported
 */
export const getConfig = (env?: EnvConfig): AppConfig => {
  const appEnv = env || process.env.VITE_APP_ENV;

  if (!appEnv)
    throw new Error(
      "VITE_APP_ENV env variable must be set or a type must be passed to getConfig()",
    );

  // Return configuration based on environment
  if (appEnv === "local") return localConfig;
  if (appEnv === "e2e") return localConfig; // e2e uses local config
  if (appEnv === "testnet") return testnetConfig;
  if (appEnv === "mainnet") return mainnetConfig;

  throw new Error(`Unsupported VITE_APP_ENV ${appEnv}`);
};

// Export contract configuration helper
export { getContractsConfig };
