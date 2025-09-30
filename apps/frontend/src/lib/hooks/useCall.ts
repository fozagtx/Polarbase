'use client';

import { Interface } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/vechain-kit';

// Define a type to infer method names from the function definition
type MethodName<T> = T extends (nameOrSignature: infer U) => unknown
  ? U
  : never;

/**
 * Parameters for the useCall hook.
 */
export type UseCallParams<T extends Interface> = {
  contractInterface: T;
  contractAddress: string;
  method: MethodName<T['getFunction']>;
  args?: unknown[];
  keyArgs?: unknown[];
  enabled?: boolean;
  mapResponse?: (
    _res: Connex.VM.Output & Connex.Thor.Account.WithDecoded
  ) => unknown;
};

/**
 * Custom hook for making contract calls.
 */
export const useCall = <T extends Interface>({
  contractInterface,
  contractAddress,
  method,
  args = [],
  keyArgs,
  enabled = true,
  mapResponse,
}: UseCallParams<T>) => {
  const { thor } = useConnex();

  const queryFn = useCallback(async () => {
    try {
      const functionFragment = contractInterface
        ?.getFunction(method)
        ?.format('json');
      if (!functionFragment) throw new Error(`Method ${method} not found`);

      const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call(...args);

      if (res.vmError)
        return Promise.reject(
          new Error(`Method ${method} reverted: ${res.vmError}`)
        );

      if (mapResponse) return mapResponse(res);
      return res.decoded[0];
    } catch (error) {
      console.error(
        `Error calling ${method}: ${(error as Error)?.message} with args: ${JSON.stringify(args)}`,
        (error as Error)?.stack
      );
      throw error;
    }
  }, [args, contractAddress, contractInterface, mapResponse, method, thor]);

  const queryKey = useMemo(
    () => getCallKey({ method, keyArgs: keyArgs || args }),
    [method, keyArgs, args]
  );

  const enableQuery = useMemo(() => !!thor && enabled, [enabled, thor]);

  return useQuery({
    queryFn,
    queryKey,
    enabled: enableQuery,
  });
};

export type GetCallKeyParams = {
  method: string;
  keyArgs?: unknown[];
};

export const getCallKey = ({ method, keyArgs = [] }: GetCallKeyParams) => {
  return [method, ...keyArgs];
};
