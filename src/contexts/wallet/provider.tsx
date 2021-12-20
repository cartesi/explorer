import { createContext, FC, useEffect, useState } from 'react';
import Onboard from 'bnc-onboard';
import { ethers } from 'ethers';
import {
    WalletInitOptions,
    WalletCheckInit,
} from 'bnc-onboard/dist/src/interfaces';
import { networks } from '../../utils/networks';
import { chains } from 'eth-chains';
import { WalletType, WalletConnectionContextProps } from './definitions';
import { UnsupportedNetworkError } from './errors/UnsupportedNetworkError';
import { useColorMode } from '@chakra-ui/react';
import { useFlag } from '@unleash/proxy-client-react';

const supportedNetworks = Object.keys(networks).map((key) => parseInt(key));
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const getRPC = (networkName: string): string =>
    `https://${networkName}.infura.io/v3/${PROJECT_ID}`;

const wallets: WalletInitOptions[] = [
    { walletName: 'metamask' },
    {
        walletName: 'coinbase',
        infuraKey: PROJECT_ID,
    },
    {
        walletName: 'walletLink',
        rpcUrl: getRPC('mainnet'),
        appName: 'Cartesi Explorer',
    },
    { walletName: 'gnosis' },
    { walletName: 'trust' },
    { walletName: 'ledger', rpcUrl: getRPC('mainnet') },
    {
        walletName: 'walletConnect',
        infuraKey: PROJECT_ID,
    },
];

const walletCheck: WalletCheckInit[] = [
    { checkName: 'derivationPath' },
    { checkName: 'accounts' },
    { checkName: 'connect' },
    { checkName: 'network' },
];

const initialContextState = {
    active: false,
    activate: async () => {},
    deactivate: () => {},
};
export const WalletConnectionContext =
    createContext<WalletConnectionContextProps>(initialContextState);

export const WalletConnectionProvider: FC = (props) => {
    const [state, setState] = useState<WalletConnectionContextProps>({
        ...initialContextState,
    });
    const { library, account, chainId, error, onboard } = state;
    const { colorMode } = useColorMode();
    const multiWalletEnabled = useFlag('multiWalletEnabled');
    const active =
        library !== undefined &&
        account !== undefined &&
        chainId !== undefined &&
        !error;

    const activate = async () => {
        const { onboard } = state;
        const walletSelected = await onboard?.walletSelect();
        if (!walletSelected) return;
        await onboard.walletCheck();
    };

    const deactivate = () => {
        const { onboard } = state;
        onboard?.walletReset();
        setState({ ...initialContextState });
    };

    useEffect(() => {
        const onboardInitialized = Onboard({
            hideBranding: true,
            networkId: supportedNetworks[0],
            subscriptions: {
                wallet: (wallet) => {
                    const { provider, name, type } = wallet;
                    if (provider) {
                        const ethersProvider =
                            new ethers.providers.Web3Provider(provider, 'any');

                        console.log(`Wallet selected: ${name}`);
                        window.localStorage.setItem('selectedWallet', name);

                        setState((state) => ({
                            ...state,
                            library: ethersProvider,
                            isHardwareWallet: type === WalletType.HARDWARE,
                        }));
                    } else {
                        setState((state) => ({
                            ...state,
                            library: null,
                            isHardwareWallet: false,
                        }));
                    }
                },
                address: (address: string) => {
                    console.log(`Address changed to: ${address}`);
                    setState((state) => ({ ...state, account: address }));
                },
                network: (networkId: number) => {
                    const isNetworkSupported =
                        supportedNetworks.includes(networkId);
                    const error = !isNetworkSupported
                        ? new UnsupportedNetworkError(
                              networkId,
                              supportedNetworks
                          )
                        : null;

                    const chain = chains.getById(networkId);
                    console.log(
                        `Network changed to: ${chain?.name || networkId}`
                    );
                    setState((state) => ({
                        ...state,
                        chainId: networkId,
                        error,
                    }));
                },
            },
            walletSelect: {
                wallets,
            },
            walletCheck,
        });

        setState((state) => ({ ...state, onboard: onboardInitialized }));
    }, []);

    useEffect(() => {
        const previousWalletSelected =
            window.localStorage.getItem('selectedWallet');

        if (onboard && multiWalletEnabled) {
            if (previousWalletSelected) {
                onboard.walletSelect(previousWalletSelected);
            }
            setState((state) => ({ ...state, tried: true }));
        }
    }, [onboard, multiWalletEnabled]);

    useEffect(() => {
        const { onboard } = state;
        if (onboard) {
            const darkMode = 'dark' === colorMode;
            onboard.config({ darkMode });
        }
    }, [colorMode]);

    const defaults = { activate, active, deactivate, error };
    const value = active ? { ...defaults, ...state } : defaults;

    return <WalletConnectionContext.Provider value={value} {...props} />;
};
