'use client';

import { useCallback } from 'react';
import { useWallet } from '@vechain/vechain-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useSendTransaction, type EnhancedClause } from './useSendTransaction';

export type BuildTransactionProps<ClausesParams> = {
  clauses: (props: ClausesParams) => EnhancedClause[];
  refetchQueryKeys?: string[][];
  onSuccess?: () => void;
  invalidateCache?: boolean;
};

/**
 * Custom hook for building and sending transactions.
 */
export const useBuildTransaction = <ClausesParams>({
  clauses,
  refetchQueryKeys,
  invalidateCache = true,
  onSuccess,
}: BuildTransactionProps<ClausesParams>) => {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  /**
   * Callback function to be called when the transaction is successfully confirmed.
   */
  const handleOnSuccess = useCallback(async () => {
    if (invalidateCache) {
      refetchQueryKeys?.forEach(async (queryKey) => {
        await queryClient.cancelQueries({
          queryKey,
        });
        await queryClient.refetchQueries({
          queryKey,
        });
      });
    }
    onSuccess?.();
  }, [invalidateCache, onSuccess, queryClient, refetchQueryKeys]);

  const result = useSendTransaction({
    signerAccount: account?.address,
    onTxConfirmed: handleOnSuccess,
  });

  /**
   * Function to send a transaction based on the provided parameters.
   */
  const sendTransaction = useCallback(
    (props: ClausesParams) => {
      result.sendTransaction(clauses(props));
    },
    [clauses, result]
  );

  return { ...result, sendTransaction };
};
