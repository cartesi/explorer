import { createContext, FC, useEffect, useState } from 'react';
import Onboard from 'bnc-onboard';
import ethers from 'ethers';
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

const rpcs = supportedNetworks.map(chains.getById).reduce((prev, network) => {
    if (network) prev[`'${network.chainId}'`] = getRPC(network.name);
    return prev;
}, {});

const wallets: WalletInitOptions[] = [
    { walletName: 'metamask', preferred: true },
    { walletName: 'coinbase', preferred: true },
    { walletName: 'gnosis' },
    { walletName: 'trust' },
    { walletName: 'ledger', rpcUrl: getRPC('mainnet') },
    {
        walletName: 'walletconnect',
        rpc: {
            ...rpcs,
        },
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
            networkId: supportedNetworks[0],
            subscriptions: {
                wallet: (wallet) => {
                    const { provider, name, type } = wallet;
                    if (provider) {
                        const ethersProvider =
                            new ethers.providers.Web3Provider(provider);

                        setState((state) => ({
                            ...state,
                            library: ethersProvider,
                            isHardwareWallet: type === WalletType.HARDWARE,
                        }));

                        window.localStorage.setItem('selectedWallet', name);
                    } else {
                        setState((state) => ({
                            ...state,
                            library: null,
                            isHardwareWallet: false,
                        }));
                    }
                },
                address: (address: string) => {
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
        const { onboard } = state;
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
        setState((state) => ({ ...state, tried: true }));
    }, [state.onboard]);

    return (
        <WalletConnectionContext.Provider
            value={{ ...state, active, activate, deactivate }}
            {...props}
        />
    );
};
