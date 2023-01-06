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
    CartesiDAppFactory,
    CartesiDAppFactory__factory,
} from '@cartesi/rollups';
import { useNetwork } from './useNetwork';
import { useWallet } from '@explorer/wallet';

export const useRollupsFactory = (): CartesiDAppFactory | undefined => {
    const [factory, setFactory] = useState<CartesiDAppFactory | undefined>();
    const wallet = useWallet();
    const network = useNetwork();

    useEffect(() => {
        if (network && wallet?.library) {
            const provider = wallet.library;
            const signer = provider.getSigner();
            const deployment = network.deployment('CartesiDAppFactory');
            if (deployment) {
                setFactory(
                    CartesiDAppFactory__factory.connect(
                        deployment.address,
                        signer
                    )
                );
            } else {
                setFactory(undefined);
            }
        } else {
            setFactory(undefined);
        }
    }, [network, wallet]);
    return factory;
};
