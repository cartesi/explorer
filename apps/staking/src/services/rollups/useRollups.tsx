// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useEffect, useState } from 'react';

import {
    ERC20PortalFacet,
    ERC20PortalFacet__factory,
    EtherPortalFacet,
    EtherPortalFacet__factory,
    InputFacet,
    InputFacet__factory,
    OutputFacet,
    OutputFacet__factory,
    RollupsFacet,
    RollupsFacet__factory,
} from '@cartesi/rollups';
import { useWallet } from '@explorer/wallet';

export interface RollupsContracts {
    rollupsContract: RollupsFacet;
    inputContract: InputFacet;
    outputContract: OutputFacet;
    erc20PortalContract: ERC20PortalFacet;
    etherPortalContract: EtherPortalFacet;
}

export const useRollups = (address: string): RollupsContracts | undefined => {
    const [contracts, setContracts] = useState<RollupsContracts | undefined>();
    const wallet = useWallet();

    useEffect(() => {
        const connect = async (): Promise<RollupsContracts> => {
            const provider = wallet.library;
            const signer = provider.getSigner();

            const rollupsContract = RollupsFacet__factory.connect(
                address,
                signer
            );
            const inputContract = InputFacet__factory.connect(address, signer);
            const outputContract = OutputFacet__factory.connect(
                address,
                signer
            );
            const erc20PortalContract = ERC20PortalFacet__factory.connect(
                address,
                signer
            );
            const etherPortalContract = EtherPortalFacet__factory.connect(
                address,
                signer
            );

            return {
                rollupsContract,
                inputContract,
                outputContract,
                erc20PortalContract,
                etherPortalContract,
            };
        };
        if (wallet) {
            connect().then((contracts) => {
                setContracts(contracts);
            });
        }
    }, [wallet, address]);
    return contracts;
};
