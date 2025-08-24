// src/wagmi.ts

import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; // We will replace this with Monad

// 1. Define the Monad Testnet as a custom chain
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
} as const;

// 2. Configure wagmi
export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
});