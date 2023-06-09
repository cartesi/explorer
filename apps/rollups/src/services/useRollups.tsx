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
    ERC20Portal,
    ERC20Portal__factory,
    EtherPortal,
    EtherPortal__factory,
    InputBox,
    InputBox__factory,
} from '@cartesi/rollups';
import { useWallet } from '@explorer/wallet';

export interface RollupsContracts {
    inputContract: InputBox;
    erc20PortalContract: ERC20Portal;
    etherPortalContract: EtherPortal;
}

export const useRollups = (address: string): RollupsContracts | undefined => {
    const [contracts, setContracts] = useState<RollupsContracts | undefined>();
    const { library } = useWallet();

    useEffect(() => {
        const connect = async (): Promise<RollupsContracts> => {
            const signer = library.getSigner();

            const inputContract = InputBox__factory.connect(address, signer);
            const erc20PortalContract = ERC20Portal__factory.connect(
                address,
                signer
            );
            const etherPortalContract = EtherPortal__factory.connect(
                address,
                signer
            );

            return {
                inputContract,
                erc20PortalContract,
                etherPortalContract,
            };
        };
        if (library) {
            connect().then((contracts) => {
                setContracts(contracts);
            });
        }
    }, [library, address]);
    return contracts;
};
