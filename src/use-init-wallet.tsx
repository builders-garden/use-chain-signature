import { distinctUntilChanged, map } from 'rxjs';
import {
  type Network,
  type NetworkId,
  type WalletSelector,
  setupWalletSelector,
  type WalletModuleFactory,
} from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';

import { useEffect, useState } from 'react';
import { providers } from 'near-api-js';
import { useWallet } from './use-wallet';

type UseInitWalletProps = {
  createAccessKeyFor: string;
  networkId: NetworkId | Network;
  modules: WalletModuleFactory[];
};

export const useInitWalle = ({
  createAccessKeyFor,
  networkId,
  modules,
}: UseInitWalletProps) => {
  const setAuth = useWallet((store) => store.setAuth);
  const setLogActions = useWallet((store) => store.setLogActions);
  const setStoreSelector = useWallet((store) => store.setStoreSelector);
  const setMethods = useWallet((store) => store.setMethods);
  const [selector, setSelector] = useState<Promise<WalletSelector> | undefined>(
    undefined
  );

  useEffect(() => {
    const selector = setupWalletSelector({
      network: networkId,
      modules,
    });

    setSelector(selector);
    setStoreSelector({ selector });
  }, [networkId, setStoreSelector]);

  useEffect(() => {
    if (!selector) return;
    selector.then((walletSelector) => {
      console.log(walletSelector);
      const accounts = walletSelector.store.getState().accounts;
      const signedAccountId =
        accounts.find((account) => account.active)?.accountId || '';
      setAuth({ signedAccountId });

      walletSelector.store.observable
        .pipe(
          map((state) => state.accounts),
          distinctUntilChanged()
        )
        .subscribe((accounts) => {
          const signedAccountId =
            accounts.find((account) => account.active)?.accountId || '';
          setAuth({ signedAccountId });
        });
    });
  }, [selector, setAuth]);

  useEffect(() => {
    if (!selector) return;

    // defined logOut and logIn actions
    const logOut = async () => {
      const wallet = await (await selector).wallet();
      await wallet.signOut();
      setAuth({ signedAccountId: '' });
    };

    const logIn = async () => {
      const modal = setupModal(await selector, {
        contractId: createAccessKeyFor,
      });
      modal.show();
    };

    setLogActions({ logOut, logIn });

    const viewMethod = async ({
      contractId,
      method,
      args = {},
    }: {
      contractId: string;
      method: string;
      args: any;
    }) => {
      const { network } = (await selector).options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      let res = (await provider.query({
        request_type: 'call_function',
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic',
      })) as any;
      return JSON.parse(Buffer.from(res.result).toString());
    };

    const callMethod = async ({
      accountId,
      contractId,
      method,
      args = {},
      gas = '30000000000000',
      deposit = '0',
    }: {
      accountId: string;
      contractId: string;
      method: string;
      args: any;
      gas: string;
      deposit: string;
    }) => {
      const walletSelector = await selector;
      const wallet = await walletSelector.wallet();
      console.log(contractId, method, args, gas, deposit);
      const outcome = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: method,
              args,
              gas,
              deposit,
            },
          },
        ],
      });
      console.log(outcome);
      return outcome;
    };

    const getTransactionResult = async (txHash: string) => {
      const walletSelector = await selector;
      const { network } = walletSelector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

      // Retrieve transaction result from the network
      const transaction = await provider.txStatus(txHash, 'unnused');
      return providers.getTransactionLastResult(transaction);
    };

    setMethods({ viewMethod, callMethod, getTransactionResult });
  }, [createAccessKeyFor, selector, setAuth, setLogActions, setMethods]);
};
