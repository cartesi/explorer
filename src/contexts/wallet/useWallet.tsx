import { useContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionContext } from './provider';
import { useWeb3React } from '@web3-react/core';
import { useFlag } from '@unleash/proxy-client-react';
import { WalletConnectionContextProps } from './definitions';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

export type UseWallet = WalletConnectionContextProps &
    Partial<Web3ReactContextInterface<Web3Provider>>;

export const useWallet = (): UseWallet => {
    const multiWalletEnabled = useFlag('multiWalletEnabled');
    return multiWalletEnabled
        ? useContext(WalletConnectionContext)
        : useWeb3React<Web3Provider>();
};
