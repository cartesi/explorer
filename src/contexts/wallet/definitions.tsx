// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

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
