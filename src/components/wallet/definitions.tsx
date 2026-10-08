// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import type { Web3Provider } from '@ethersproject/providers';
import type {
    Account,
    Chain,
    PublicClient,
    Transport,
    WalletClient,
} from 'viem';

export enum WalletType {
    SDK = 'sdk',
    INJECTED = 'injected',
}
export type { Web3Provider };
export interface WalletConnectionContextProps {
    account?: string;
    chainId?: number;
    /** @deprecated transitional ethers v5 provider; use publicClient/walletClient. */
    library?: Web3Provider;
    publicClient?: PublicClient<Transport, Chain>;
    walletClient?: WalletClient<Transport, Chain, Account>;
    error?: Error;
    active: boolean;
    activate: (...a: any) => Promise<void>;
    deactivate: () => void;
    isGnosisSafe?: boolean;
    walletName?: string;
    walletType?: `${WalletType}`;
}
