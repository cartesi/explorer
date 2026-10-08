// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

/**
 * `pnpm gen:abi` (part of `pnpm codegen`) writes src/services/contracts/generated.ts
 * (gitignored) from the @cartesi packages: `as const` ABIs plus per-chain addresses.
 * Those packages and ethers are devDependencies used only here; the per-pool
 * contracts (Fee, FlatRateCommission) ship their ABI only in the typechain factories.
 */
import type { Config, ContractConfig } from '@wagmi/cli';
import type { Abi, Address } from 'viem';

import {
    PoS__factory,
    PoSV2FactoryImpl__factory,
    StakingImpl__factory,
} from '@cartesi/pos';
import {
    Fee__factory,
    FlatRateCommission__factory,
    StakingPoolFactoryImpl__factory,
    StakingPoolImpl__factory,
} from '@cartesi/staking-pool';
import { CartesiToken__factory, SimpleFaucet__factory } from '@cartesi/token';
import { WorkerManagerAuthManagerImpl__factory } from '@cartesi/util';

import posMainnet from '@cartesi/pos/export/abi/mainnet.json' with { type: 'json' };
import posSepolia from '@cartesi/pos/export/abi/sepolia.json' with { type: 'json' };
import posV1Mainnet from '@cartesi/pos-1.0/export/abi/mainnet.json' with { type: 'json' };
import poolMainnet from '@cartesi/staking-pool/export/abi/mainnet.json' with { type: 'json' };
import poolSepolia from '@cartesi/staking-pool/export/abi/sepolia.json' with { type: 'json' };
import tokenMainnet from '@cartesi/token/export/abi/mainnet.json' with { type: 'json' };
import tokenSepolia from '@cartesi/token/export/abi/sepolia.json' with { type: 'json' };
import utilMainnet from '@cartesi/util/export/abi/mainnet.json' with { type: 'json' };
import utilSepolia from '@cartesi/util/export/abi/sepolia.json' with { type: 'json' };
import localhost from './src/services/contracts/localhost.json' with { type: 'json' };

type Deployment = { contracts: Record<string, { address: string }> };
type Deployments = Partial<Record<number, Deployment>>;

const addresses = (deploymentName: string, deployments: Deployments) =>
    Object.fromEntries(
        Object.entries(deployments).flatMap(([chainId, deployment]) => {
            const contract = deployment?.contracts[deploymentName];
            return contract ? [[Number(chainId), contract.address]] : [];
        }),
    ) as Record<number, Address>;

const contract = (
    name: string,
    abi: unknown,
    deployed?: { as: string; on: Deployments },
): ContractConfig => ({
    name,
    abi: abi as Abi,
    ...(deployed ? { address: addresses(deployed.as, deployed.on) } : {}),
});

const tokenDeployments: Deployments = {
    1: tokenMainnet,
    11155111: tokenSepolia,
    31337: localhost,
};
const utilDeployments: Deployments = {
    1: utilMainnet,
    11155111: utilSepolia,
    31337: localhost,
};
const posDeployments: Deployments = {
    1: posMainnet,
    11155111: posSepolia,
    31337: localhost,
};
const posV1Deployments: Deployments = { 1: posV1Mainnet, 31337: localhost };
const poolDeployments: Deployments = {
    1: poolMainnet,
    11155111: poolSepolia,
    31337: localhost,
};

// Explicitly typed: next build's type check (declaration: true) rejects the
// inferred type of defineConfig's return value as non-portable.
const config: Config = {
    out: 'src/services/contracts/generated.ts',
    plugins: [],
    contracts: [
        // @cartesi/token
        contract('CartesiToken', CartesiToken__factory.abi, {
            as: 'CartesiToken',
            on: tokenDeployments,
        }),
        contract('SimpleFaucet', SimpleFaucet__factory.abi, {
            as: 'SimpleFaucet',
            on: tokenDeployments,
        }),
        // @cartesi/util
        contract(
            'WorkerManagerAuthManager',
            WorkerManagerAuthManagerImpl__factory.abi,
            { as: 'WorkerManagerAuthManagerImpl', on: utilDeployments },
        ),
        // @cartesi/pos (protocol v2; PosV2Factory is behind the posV2Enabled flag)
        contract('Staking', StakingImpl__factory.abi, {
            as: 'StakingImpl',
            on: posDeployments,
        }),
        contract('Pos', PoS__factory.abi, { as: 'PoS', on: posDeployments }),
        contract('PosV2Factory', PoSV2FactoryImpl__factory.abi, {
            as: 'PoSV2FactoryImpl',
            on: posDeployments,
        }),
        // @cartesi/pos-1.0 (protocol v1; its typechain output predates static ABIs)
        contract('PosV1', posV1Mainnet.contracts.PoS.abi, {
            as: 'PoS',
            on: posV1Deployments,
        }),
        // @cartesi/staking-pool
        contract('StakingPoolFactory', StakingPoolFactoryImpl__factory.abi, {
            as: 'StakingPoolFactoryImpl',
            on: poolDeployments,
        }),
        // deployed per pool, addresses resolved at runtime
        contract('StakingPool', StakingPoolImpl__factory.abi),
        contract('Fee', Fee__factory.abi),
        contract('FlatRateCommission', FlatRateCommission__factory.abi),
    ],
};

export default config;
