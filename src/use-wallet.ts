import type { WalletSelector } from '@near-wallet-selector/core';
import { create } from 'zustand';

export type SetStoreSelector = (args: {
  selector: Promise<WalletSelector>;
}) => void;

export type ViewMethod = (args: {
  contractId: string;
  method: string;
  args: any;
}) => Promise<any>;

export type CallMethod = (args: {
  accountId: string;
  contractId: string;
  method: string;
  args: string;
  gas: string;
  deposit: string;
}) => Promise<any>;

export type UseWalletStore = {
  signedAccountId: string;
  selector: Promise<WalletSelector> | undefined;
  setStoreSelector: SetStoreSelector;
  logOut: (() => Promise<void>) | undefined;
  logIn: (() => Promise<void>) | undefined;
  viewMethod: ViewMethod | undefined;
  callMethod: CallMethod | undefined;
  getTransactionResult: ((hash: string) => Promise<any>) | undefined;
  setLogActions: (args: {
    logOut: (() => Promise<void>) | undefined;
    logIn: (() => Promise<void>) | undefined;
  }) => void;
  setAuth: (args: { signedAccountId: string }) => void;
  setMethods: (args: {
    viewMethod: ViewMethod | undefined;
    callMethod: CallMethod | undefined;
    getTransactionResult: ((hash: string) => Promise<any>) | undefined;
  }) => void;
};

export type LocalWallet = {
  viewMethod: ViewMethod;
  callMethod: CallMethod;
  getTransactionResult: (hash: string) => Promise<any>;
};

export const useWallet = create<UseWalletStore>((set) => ({
  signedAccountId: '',
  logOut: undefined,
  logIn: undefined,
  selector: undefined,
  viewMethod: undefined,
  callMethod: undefined,
  getTransactionResult: undefined,
  setLogActions: ({ logOut, logIn }) => set({ logOut, logIn }),
  setAuth: ({ signedAccountId }) => set({ signedAccountId }),
  setStoreSelector: ({ selector }) => set({ selector }),
  setMethods: ({ viewMethod, callMethod, getTransactionResult }) =>
    set({ viewMethod, callMethod, getTransactionResult }),
}));
