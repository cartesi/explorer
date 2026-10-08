// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import type { Chain } from 'viem';
import { hardhat, mainnet, sepolia } from 'viem/chains';

/** Supported chains; free of wagmi/RainbowKit imports so UI components can use it. */
export const local = { ...hardhat, name: 'Local' } as const satisfies Chain; // id 31337

export const chains = [mainnet, sepolia, local] as const;

export const supportedChainIds: readonly number[] = chains.map(
    (chain) => chain.id,
);

export const chainNames: Record<number, string> = Object.fromEntries(
    chains.map((chain) => [chain.id, chain.name]),
);
