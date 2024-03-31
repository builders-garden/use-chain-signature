import { useMemo, useState } from 'react';
import { Ethereum } from './utils';
import type { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import type { LocalWallet } from './use-wallet';
import type { Bytes } from 'web3';

type UseEthereumSignature = {
  chainRpc: any;
  chainId: number;
};

export const useEthereumSignature = ({
  chainRpc,
  chainId,
}: UseEthereumSignature) => {
  const Eth = useMemo(
    () => new Ethereum(chainRpc, chainId),
    [chainRpc, chainId]
  );
  /** @dev check if basic methods are loading or not */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /** @dev returns true if retrieving the balance, false otherwise */
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  /** @dev return true if creating the payload, false otherwise */
  const [isPayloadLoading, setIsPayloadLoading] = useState<boolean>(false);
  /** @dev returns true if creating the signature, false otherwise */
  const [isSignatureLoading, setIsSignatureLoading] = useState<boolean>(false);
  /** @dev returns true if the relayed transaction is loading, false otherwise */
  const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
  /** @dev contains an error if one has occurred, null otherwise */
  const [error, setError] = useState<any>(null);
  /** @dev returns true if there was an error, false otherwise */
  const [isError, setIsError] = useState<boolean>(false);

  /**
   * @dev internal function for clearing errors.
   */
  const clearError = () => {
    setIsError(false);
    setError(null);
  };

  /**
   * @dev updates the provider with the new chainRpc and chainId.
   * @param {any} chainRpc the new chainRpc to update to.
   * @param {number} chainId the new chainId to update to.
   */
  const updateProvider = async (chainRpc: any, chainId: number) => {
    setIsLoading(true);
    clearError();
    try {
      await Eth.updateProvider(chainRpc, chainId);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @dev queries the gas price from the provider.
   * @returns {Promise<{ maxFeePerGas: bigint, maxPriorityFeePerGas: bigint } | null>} the gas price or null if an error occurred.
   */
  const queryGasPrice = async (): Promise<{
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  } | null> => {
    setIsLoading(true);
    clearError();
    try {
      return await Eth.queryGasPrice();
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
      return null;
    }
  };

  /**
   * @dev gets the balance of the account.
   * @param {string} accountId the account id to get the balance of.
   * @returns {Promise<number | null>} balance of the account.
   */
  const getBalance = async (accountId: string): Promise<number | null> => {
    setIsBalanceLoading(true);
    clearError();
    try {
      return await Eth.getBalance(accountId);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsBalanceLoading(false);
      return null;
    }
  };

  /**
   * @dev creates a payload for the transaction.
   * @param {string} sender address of the sender.
   * @param {string} receiver address of the receiver.
   * @param {number} amount amount to send (in wei).
   * @param {string} data data to send.
   * @returns {Promise<{ transaction: FeeMarketEIP1559Transaction, payload: Uint8Array} | null}
   */
  const createPayload = async (
    sender: string,
    receiver: string,
    amount: number,
    data: string
  ): Promise<{
    transaction: FeeMarketEIP1559Transaction;
    payload: Uint8Array;
  } | null> => {
    setIsPayloadLoading(true);
    clearError();
    try {
      return await Eth.createPayload(sender, receiver, amount, data);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsPayloadLoading(false);
      return null;
    }
  };

  /**
   * @dev requests the signature to the MPC contract.
   * @param {LocalWallet} wallet wallet instance.
   * @param {string} contractId id of the MPC contract.
   * @param {string} path derivation path.
   * @param {Uint8Array} ethPayload payload to sign.
   * @param {FeeMarketEIP1559Transaction} transaction transaction to sign.
   * @param {string} sender sender of the transaction.
   * @returns {Promise<FeeMarketEIP1559Transaction | null>} the signed transaction or null if an error occurred.
   */
  const requestSignatureToMPC = async (
    wallet: LocalWallet,
    contractId: string,
    path: string,
    ethPayload: Uint8Array,
    transaction: FeeMarketEIP1559Transaction,
    sender: string
  ): Promise<FeeMarketEIP1559Transaction | null> => {
    setIsSignatureLoading(true);
    clearError();
    try {
      return await Eth.requestSignatureToMPC(
        wallet,
        contractId,
        path,
        ethPayload,
        transaction,
        sender
      );
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsSignatureLoading(false);
      return null;
    }
  };

  /**
   * @dev relays the transaction to the network.
   * @param {FeeMarketEIP1559Transaction} signedTransaction signed transaction to relay.
   * @returns {Promise<Bytes | null>} the transaction hash or null if an error occurred.
   */
  const relayTransaction = async (
    signedTransaction: FeeMarketEIP1559Transaction
  ): Promise<Bytes | null> => {
    setIsTxLoading(true);
    clearError();
    try {
      return await Eth.relayTransaction(signedTransaction);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error);
    } finally {
      setIsTxLoading(false);
      return null;
    }
  };

  return {
    isLoading,
    isBalanceLoading,
    isPayloadLoading,
    isSignatureLoading,
    isTxLoading,
    updateProvider,
    queryGasPrice,
    getBalance,
    createPayload,
    requestSignatureToMPC,
    relayTransaction,
    error,
    isError,
  };
};
