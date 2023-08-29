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
import { InputAddedEvent } from '@cartesi/rollups/dist/src/types/contracts/inputs/InputBox';
import { useWallet } from '@explorer/wallet';
import { useEffect, useState } from 'react';
import { useInputBoxMeta } from './contracts/inputBox';
import { useNetwork } from './useNetwork';
import { useRollupsFactory } from './useRollupsFactory';

interface NetworkError extends Error {
    code: number;
}
export interface Applications {
    loading: boolean;
    applications: Application[];
    error?: NetworkError;
}
interface Application {
    factoryVersion: string;
    address: string;
    inputs: InputAddedEvent[];
    deploymentTimestamp: number;
}

type FactoryType = CartesiDAppFactory;
type FactoryVersion = '1.0';

/**
 * Fetch the DApp information (i.e. Address) from a specific factory version from a block-number
 * @param factory
 * @param factoryVersion
 * @param blockNumber
 * @param inputFetcher
 * @returns
 */
const fetchApplications = <F,>(
    factory: FactoryType,
    factoryVersion: FactoryVersion,
    blockNumber: number,
    inputFetcher: InputFetcher<Array<F>>
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
                    let inputs: Array<F> = [];
                    try {
                        inputs = await inputFetcher(address, blockNumber);
                    } catch (e) {
                        console.error(e);
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

type InputFetcher<T> = (
    dappAddress: string,
    blockNumber?: number
) => Promise<T>;

export const useApplications = (): Applications => {
    const [applications, setApplications] = useState<Applications>({
        loading: false,
        applications: [],
    });
    const wallet = useWallet();
    const network = useNetwork();
    const factory = useRollupsFactory();
    const inputBoxMeta = useInputBoxMeta();

    useEffect(() => {
        if (factory && network && inputBoxMeta) {
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
                        '1.0',
                        deployBlock,
                        (dapp: string, blockNumber?: number) =>
                            inputBoxMeta.getInputs(dapp, blockNumber)
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
    }, [factory, network, wallet.library, inputBoxMeta]);

    return applications;
};
