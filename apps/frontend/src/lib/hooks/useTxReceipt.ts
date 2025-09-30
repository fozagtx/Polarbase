import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/vechain-kit';

export const txReceiptQueryKey = (txId?: string) => ['TX_RECEIPT', txId];

/**
 * Poll for receipt
 * @param thor Connex Thor instance
 * @param id Transaction id
 * @param blocksTimeout Number of blocks to wait before timeout
 * @returns Transaction receipt
 */
const pollForReceipt = async (
  thor: Connex.Thor,
  id?: string,
  blocksTimeout = 3
): Promise<Connex.Thor.Transaction.Receipt> => {
  if (!id) throw new Error('No transaction id provided');

  const transaction = thor.transaction(id);
  let receipt;

  // Query the transaction until it has a receipt
  // Timeout after specified blocks
  for (let i = 0; i < blocksTimeout; i++) {
    receipt = await transaction.getReceipt();
    if (receipt) {
      break;
    }
    await thor.ticker().next();
  }

  if (!receipt) {
    throw new Error('Transaction receipt not found');
  }

  const transactionData = await transaction.get();
  if (!transactionData) throw Error('Failed to get TX data');

  return receipt;
};

/**
 * Get the tx receipt of a tx id with a block timeout to wait for the receipt
 * @param txId the tx id to get the receipt
 * @param blocksTimeout the blocks to wait for the receipt
 * @returns the tx receipt
 */
export const useTxReceipt = (txId?: string, blocksTimeout?: number) => {
  const { thor } = useConnex();

  return useQuery({
    queryKey: txReceiptQueryKey(txId),
    queryFn: () => pollForReceipt(thor, txId, blocksTimeout),
    enabled: !!txId,
    staleTime: Infinity,
  });
};
