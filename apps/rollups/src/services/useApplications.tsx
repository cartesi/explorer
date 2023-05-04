// Copyright 2023 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { CartesiDAppFactory } from '@cartesi/rollups';
import { CartesiDAppFactory as V08Factory } from '@cartesi/rollups-0.8';
import { InputAddedEvent } from '@cartesi/rollups-0.8/dist/src/types/contracts/facets/InputFacet';
import { useWallet, Web3Provider } from '@explorer/wallet';
import { useEffect, useState } from 'react';
import { buildInputFacetMeta } from './inputFacetHelpers';
import { useNetwork } from './useNetwork';
import {
    useRollupLegacyFactories,
    useRollupsFactory,
} from './useRollupsFactory';

interface NetworkError extends Error {
    code: number;
}
export interface Applications {
    loading: boolean;
    applications: Application[];
    error?;
}
interface Application {
    factoryVersion: string;
    address: string;
    inputs: InputAddedEvent[];
    deploymentTimestamp: number;
}

type FactoryType = CartesiDAppFactory | V08Factory;

/**
 * Fetch the DApp information (i.e. Address) from a specific factory version from a block-number
 * @param factory
 * @param factoryVersion
 * @param blockNumber
 * @param inputFetcher
 * @returns
 */
const fetchApplications = (
    factory: FactoryType,
    factoryVersion: string,
    blockNumber: number,
    provider: Web3Provider
): Promise<Application[]> => {
    return factory
        .queryFilter(factory.filters.ApplicationCreated(), blockNumber)
        .then((events) => {
            console.log(
                `Number of application created on rollups v${factoryVersion}: ${
                    events?.length ?? 0
                }`
            );
            return Promise.all(
                events.map(async (e) => {
                    const address = e.args.application;
                    const block = await e.getBlock();
                    const inputFacetMeta = buildInputFacetMeta(
                        address,
                        provider
                    );
                    let inputs: InputAddedEvent[] = [];
                    try {
                        inputs = await inputFacetMeta.getInputs();
                    } catch (e) {
                        console.table(e);
                    }

                    return {
                        address,
                        factoryVersion,
                        inputs,
                        deploymentTimestamp: block.timestamp,
                    } as Application;
                })
            );
        })
        .catch((e: NetworkError) => {
            return Promise.reject(e);
        });
};

export const useApplications = (): Applications => {
    const [applications, setApplications] = useState<Applications>({
        loading: false,
        applications: [],
    });
    const wallet = useWallet();
    const network = useNetwork();
    const factory = useRollupsFactory();
    const legacyFactories = useRollupLegacyFactories();

    useEffect(() => {
        if (factory && network) {
            // query the factory for all applications
            network.deployment('CartesiDAppFactory').then((deployment) => {
                const deployBlock = deployment?.receipt?.blockNumber;

                // set loading
                setApplications({ loading: true, applications: [] });

                // query blockchain for all applications
                // fetching Application information in parallel from current rollups version and previous ones.
                Promise.all([
                    fetchApplications(
                        factory,
                        '0.9',
                        deployBlock,
                        wallet.library
                    ),
                    fetchApplications(
                        legacyFactories.v08Factory,
                        '0.8',
                        deployBlock,
                        wallet.library
                    ),
                ])
                    .then((result) => {
                        setApplications({
                            loading: false,
                            applications: result.flat(),
                        });
                    })
                    .catch((error: NetworkError) => {
                        setApplications({
                            loading: false,
                            applications: [],
                            error,
                        });
                    });
            });
        } else {
            setApplications({ loading: false, applications: [] });
        }
    }, [factory, network, legacyFactories, wallet.library]);

    return applications;
};
