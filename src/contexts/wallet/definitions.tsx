import { Web3Provider } from '@ethersproject/providers';
import { API } from 'bnc-onboard/dist/src/interfaces';

export enum WalletType {
    HARDWARE = 'hardware',
    SDK = 'sdk',
    INJECTED = 'injected',
}

export interface WalletConnectionContextProps {
    onboard?: API;
    account?: string;
    chainId?: number;
    library?: Web3Provider;
    error?: Error;
    active: boolean;
    activate: (...a: any) => Promise<void>;
    deactivate: () => void;
    tried?: boolean;
    isHardwareWallet?: boolean;
}
