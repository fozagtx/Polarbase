import { Interface } from 'ethers';
import type { EnhancedClause } from './hooks/useSendTransaction';

// Define a type to infer method names from the function definition
type MethodName<T> = T extends (nameOrSignature: infer U) => unknown
  ? U
  : never;

/**
 * Parameters for building a clause.
 */
export type BuildClauseParams<T extends Interface> = {
  contractInterface: T; // The contract interface
  contractAddress: string; // The contract address
  method: MethodName<T['getFunction']>; // The method name
  args?: unknown[]; // Optional arguments for the method
  value?: string | number; // The value to be sent with the transaction
} & Omit<EnhancedClause, 'data' | 'abi' | 'value' | 'to'>;

/**
 * Builds a clause for sending a transaction.
 * @param contractInterface The contract interface.
 * @param contractAddress The contract address.
 * @param method The method name.
 * @param args Optional arguments for the method.
 * @param value The value to be sent with the transaction.
 * @returns The built clause.
 */
export const buildClause = <T extends Interface>({
  value = 0,
  contractInterface,
  contractAddress,
  args = [],
  method,
  ...others
}: BuildClauseParams<T>): EnhancedClause => {
  return {
    to: contractAddress,
    value: value.toString(),
    data: contractInterface.encodeFunctionData(method, args),
    abi: JSON.parse(JSON.stringify(contractInterface.getFunction(method))),
    ...others,
  };
};
