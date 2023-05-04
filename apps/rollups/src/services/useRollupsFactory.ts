// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import {
    CartesiDAppFactory,
    CartesiDAppFactory__factory,
} from '@cartesi/rollups';

import {
    CartesiDAppFactory as V08Factory,
    CartesiDAppFactory__factory as v08_factory,
} from '@cartesi/rollups-0.8';
import { useWallet } from '@explorer/wallet';
import { useEffect, useState } from 'react';
import { useNetwork } from './useNetwork';

export const useRollupsFactory = (): CartesiDAppFactory | undefined => {
    const [factory, setFactory] = useState<CartesiDAppFactory | undefined>();
    const wallet = useWallet();
    const network = useNetwork();

    useEffect(() => {
        if (network && wallet?.library) {
            const provider = wallet.library;
            const signer = provider.getSigner();
            network.deployment('CartesiDAppFactory').then((deployment) => {
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
            });
        } else {
            setFactory(undefined);
        }
    }, [network, wallet]);
    return factory;
};

interface LegacyFactory {
    v08Factory: V08Factory;
}

/**
 * A hook to be used when dealing with old CartesiDAppFactory.
 * That provides the local development with support to get information about created DApps.
 * @returns old version factories
 */
export const useRollupLegacyFactories = () => {
    const [legacyFactories, setLegacyFactories] = useState<
        LegacyFactory | undefined
    >();
    const wallet = useWallet();
    const network = useNetwork();
    useEffect(() => {
        if (network && wallet?.library) {
            const provider = wallet.library;
            const signer = provider.getSigner();
            network.deployment('CartesiDAppFactory').then((deployment) => {
                if (deployment) {
                    const v08Factory = v08_factory.connect(
                        deployment.address,
                        signer
                    );

                    setLegacyFactories({
                        v08Factory,
                    });
                } else {
                    setLegacyFactories(undefined);
                }
            });
        } else {
            setLegacyFactories(undefined);
        }
    }, [network, wallet]);

    return legacyFactories;
};
