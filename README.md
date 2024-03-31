# 🌳 @buildersgarden/use-chain-signature

React hooks for integrating NEAR Chain Signatures in your NextJS/React app. This code is part of the submission for the ETHSeoul 2024 hackathon.

## 📦 Installation

```bash
npm install @buildersgarden/use-chain-signature # using npm
yarn add @buildersgarden/use-chain-signature # using yarn
bun add @buildersgarden/use-chain-signature # using bun
```

## 🛠️ Usage

This package exports 4 easy-to-use hooks for your NEAR Chain Signatures integration.

### ⚽️ useDebounce

The `useDebounce` hook is a simple hook that debounces a value for a given time.

```tsx
import { useDebounce } from '@buildersgarden/use-chain-signature';

const Component = () => {
  const [derivation, setDerivation] = useState('');
  const debouncedValue = useDebounce(derivation, 500);

  return (
    <input value={derivation} onChange={(e) => setDerivation(e.target.value)} />
  );
};
```

### 🎯 useInitWallet

The `useInitWallet` hook is a simple hook that initializes the NEAR Wallet.

```tsx
import { useInitWallet } from '@buildersgarden/use-chain-signature';

const NetworkId = 'testnet';

// This hook should be used in the root component of your app
const App = () => {
  useInitWallet({
    createAccessKeyFor: '',
    networkId: NetworkId,
    modules: [
      /* your near-wallet-selector modules here! */
    ],
  });

  return (
    <div>
      <h1>My NEAR App</h1>
    </div>
  );
};
```

### 💳 useWallet

The `useWallet` hook is a `zustand` store with some useful methods for interacting with the NEAR Wallet.

```tsx
import { useWallet } from '@buildersgarden/use-chain-signature';

const Component = () => {
  const { signedAccountId, logIn, logOut } = useWallet();

  return (
    <div>
      {signedAccountId ? (
        <button onClick={logOut}>Sign Out</button>
      ) : (
        <button onClick={logIn}>Sign In</button>
      )}
    </div>
  );
};
```

Please take a look at the `src/use-wallet.ts` file to see all the exported methods that you can use.

### 📝 useEthereumSignature

The `useEthereumSignature` hook is the main hook that you will use to sign messages with the NEAR Wallet, leveraging the Chain Signature feature.

```tsx
import { useEthereumSignature } from '@buildersgarden/use-chain-signature';

const Component = () => {
  const { isLoading, createPayload, requestSignatureToMPC, relayTransaction } =
    useEthereumSignature({
      chainId: 11155111,
      rpcUrl: '...',
    });

  /** your code */
};
```

Please take a look at the `src/use-ethereum-signature.ts` file to see all the exported methods that you can use.

## 📋 TODO

- [ ] Add tests
- [ ] Bitcoin Signature integration
- [ ] Expand documentation!

## 👇 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

```

```
