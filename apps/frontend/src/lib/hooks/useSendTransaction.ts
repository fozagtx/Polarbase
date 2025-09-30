'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, type UseMutateFunction } from '@tanstack/react-query';
import { useConnex } from '@vechain/vechain-kit';
import { useTxReceipt } from './useTxReceipt';

/**
 * ready: the user has not clicked on the button yet
 * pending: the user has clicked on the button and we're waiting for the transaction to be sent
 * waitingConfirmation: the transaction has been sent and we're waiting for the transaction to be confirmed by the chain
 * success: the transaction has been confirmed by the chain
 * error: the transaction has failed
 * unknown: the transaction receipt has failed to load
 */
export type TransactionStatus =
  | 'ready'
  | 'pending'
  | 'waitingConfirmation'
  | 'success'
  | 'error'
  | 'unknown';

export type TransactionStatusErrorType = {
  type: 'SendTransactionError' | 'TxReceiptError' | 'RevertReasonError';
  reason?: string;
};

/**
 * An enhanced clause with a comment and an abi
 * @param comment a comment to add to the clause
 * @param abi the abi of the contract to call
 */
export type EnhancedClause = Connex.VM.Clause & {
  comment?: string;
  abi?: object;
};

/**
 * Props for the {@link useSendTransaction} hook
 * @param signerAccount the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 */
type UseSendTransactionProps = {
  signerAccount?: string | null;
  clauses?:
    | EnhancedClause[]
    | (() => EnhancedClause[])
    | (() => Promise<EnhancedClause[]>);
  onTxConfirmed?: () => void | Promise<void>;
  onTxFailedOrCancelled?: () => void | Promise<void>;
};

/**
 * Return value of the {@link useSendTransaction} hook
 */
export type UseSendTransactionReturnValue = {
  sendTransaction: UseMutateFunction<
    Connex.Vendor.TxResponse,
    Error,
    EnhancedClause[] | undefined,
    unknown
  >;
  sendTransactionPending: boolean;
  sendTransactionError: Error | null;
  sendTransactionTx: Connex.Vendor.TxResponse | null | undefined;
  isTxReceiptLoading: boolean;
  txReceiptError: Error | null;
  txReceipt: Connex.Thor.Transaction.Receipt | null | undefined;
  status: TransactionStatus;
  resetStatus: () => void;
  error?: TransactionStatusErrorType;
};

/**
 * Generic hook to send a transaction and wait for the txReceipt
 */
export const useSendTransaction = ({
  signerAccount,
  clauses,
  onTxConfirmed,
  onTxFailedOrCancelled,
}: UseSendTransactionProps): UseSendTransactionReturnValue => {
  const { vendor, thor } = useConnex();

  async function convertClauses(
    clauses:
      | EnhancedClause[]
      | (() => EnhancedClause[])
      | (() => Promise<EnhancedClause[]>)
  ) {
    if (typeof clauses === 'function') {
      return clauses();
    }
    return clauses;
  }

  const sendTransaction = useCallback(async () => {
    if (!clauses) throw new Error('clauses is required');
    return await convertClauses(clauses).then((clauses) => {
      if (signerAccount)
        return vendor.sign('tx', clauses).signer(signerAccount).request();
      return vendor.sign('tx', clauses).request();
    });
  }, [clauses, vendor, signerAccount]);

  const sendTransactionWithClauses = useCallback(
    async (clauses: EnhancedClause[]) => {
      if (signerAccount)
        return vendor.sign('tx', clauses).signer(signerAccount).request();
      return vendor.sign('tx', clauses).request();
    },
    [vendor, signerAccount]
  );

  const sendTransactionAdapter = useCallback(
    async (_clauses?: EnhancedClause[]) => {
      if (_clauses) {
        return await sendTransactionWithClauses(_clauses);
      }
      return await sendTransaction();
    },
    [sendTransactionWithClauses, sendTransaction]
  );

  const {
    mutate: runSendTransaction,
    data: sendTransactionTx,
    isPending: sendTransactionPending,
    error: sendTransactionError,
    reset: resetSendTransaction,
  } = useMutation({
    mutationFn: sendTransactionAdapter,
    onError: (error) => {
      console.error(error);
      onTxFailedOrCancelled?.();
    },
  });

  const {
    data: txReceipt,
    isFetching: isTxReceiptLoading,
    error: txReceiptError,
  } = useTxReceipt(sendTransactionTx?.txid);

  const explainTxRevertReason = useCallback(
    async (txReceipt: Connex.Thor.Transaction.Receipt) => {
      if (!txReceipt.reverted) return;
      const transactionData = await thor.transaction(txReceipt.meta.txID).get();
      if (!transactionData) return;
      const explained = await thor
        .explain(transactionData.clauses)
        .caller(transactionData.origin)
        .execute();
      console.log('explained', explained);
      return explained;
    },
    [thor]
  );

  const [error, setError] = useState<TransactionStatusErrorType>();

  const status = useMemo(() => {
    if (sendTransactionPending) return 'pending';
    if (sendTransactionError) {
      return 'error';
    }
    if (sendTransactionTx?.txid) {
      if (isTxReceiptLoading) return 'waitingConfirmation';
      if (txReceiptError) {
        return 'error';
      }
      if (txReceipt) {
        if (txReceipt.reverted) {
          return 'error';
        }
        return 'success';
      }
    }
    return 'ready';
  }, [
    isTxReceiptLoading,
    sendTransactionError,
    sendTransactionPending,
    sendTransactionTx?.txid,
    txReceipt,
    txReceiptError,
  ]);

  useEffect(() => {
    if (sendTransactionError) {
      setError({
        type: 'SendTransactionError',
        reason: sendTransactionError.message,
      });
    }
    if (sendTransactionTx?.txid) {
      if (txReceiptError) {
        setError({
          type: 'TxReceiptError',
          reason: txReceiptError.message,
        });
        return;
      }
      if (txReceipt) {
        if (txReceipt.reverted) {
          (async () => {
            const revertReason = await explainTxRevertReason(txReceipt);
            setError({
              type: 'RevertReasonError',
              reason: revertReason?.[0]?.revertReason ?? 'Transaction reverted',
            });
          })();
          return;
        }
        onTxConfirmed?.();
        return;
      }
    }
  }, [
    sendTransactionPending,
    isTxReceiptLoading,
    sendTransactionError,
    txReceiptError,
    txReceipt,
    onTxConfirmed,
    explainTxRevertReason,
    sendTransactionTx?.txid,
  ]);

  const resetStatus = useCallback(() => {
    resetSendTransaction();
    setError(undefined);
  }, [resetSendTransaction]);

  return {
    sendTransaction: runSendTransaction,
    sendTransactionPending,
    sendTransactionError,
    sendTransactionTx,
    isTxReceiptLoading,
    txReceiptError,
    txReceipt,
    status,
    resetStatus,
    error,
  };
};
