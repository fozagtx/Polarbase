import { DigitalProductStoreContractJson } from "@repo/contracts";
import { Interface } from "ethers";
import { getConfig } from "@repo/config";
import { useCall } from "../utils/hooks/useCall";
import { useSendTransaction } from "../utils/hooks/useSendTransaction";

const config = getConfig();

export const useMarketplace = () => {
  const contractAddress = config.marketplaceContractAddress;
  const contractInterface = new Interface(DigitalProductStoreContractJson.abi);

  return {
    contractAddress,
    contractInterface,
  };
};

export const useGetProductCount = () => {
  const { contractAddress, contractInterface } = useMarketplace();

  return useCall({
    contractAddress,
    contractInterface,
    method: "getProductLength",
    args: [],
  });
};

export const useGetProduct = (productId: number) => {
  const { contractAddress, contractInterface } = useMarketplace();

  return useCall({
    contractAddress,
    contractInterface,
    method: "getProduct",
    args: [productId],
    enabled: productId >= 0,
  });
};

export const usePurchaseProduct = () => {
  return useSendTransaction({});
};

export const useAddProduct = () => {
  return useSendTransaction({});
};

export const useDeactivateProduct = () => {
  return useSendTransaction({});
};
