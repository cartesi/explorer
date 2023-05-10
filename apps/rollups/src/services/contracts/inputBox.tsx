// Copyright 2023 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { InputBox__factory } from '@cartesi/rollups';
import { InputAddedEvent } from '@cartesi/rollups/dist/src/types/contracts/inputs/InputBox';
import { Web3Provider, useWallet } from '@explorer/wallet';
import { useEffect, useState } from 'react';
import { useNetwork } from '../useNetwork';

export const buildInputBoxMeta = (address: string, provider: Web3Provider) => {
    if (!address || !provider) return;

    const connection = InputBox__factory.connect(address, provider.getSigner());

    return {
        getInputs(dappAddress: string, fromBlockNumber?: number) {
            return connection.queryFilter(
                connection.filters.InputAdded(dappAddress),
                fromBlockNumber
            );
        },
    };
};

interface InputBoxMeta {
    getInputs(
        dappAddress: string,
        fromBlockNumber?: number
    ): Promise<InputAddedEvent[]>;
}
export const useInputBoxMeta = () => {
    const wallet = useWallet();
    const network = useNetwork();
    const [inputBoxMeta, setInputBoxMeta] = useState<
        InputBoxMeta | undefined
    >();

    useEffect(() => {
        if (wallet.library && network) {
            network.deployment('InputBox').then((deployment) => {
                const signer = wallet.library.getSigner();
                const inputBox = deployment
                    ? InputBox__factory.connect(deployment.address, signer)
                    : undefined;

                setInputBoxMeta({
                    getInputs(dappAddress: string, fromBlockNumber?: number) {
                        return inputBox.queryFilter(
                            inputBox.filters.InputAdded(dappAddress),
                            fromBlockNumber
                        );
                    },
                });
            });
        }
    }, [wallet, network]);

    return inputBoxMeta;
};
