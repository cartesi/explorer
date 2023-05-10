// Copyright 2023 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { InputFacet__factory } from '@cartesi/rollups-0.8';
import { Web3Provider } from '@explorer/wallet';

/**
 * Function that builds a connection to the InputFacet contract of a DApp through a Web3Provider.
 * Therefore giving access to get a list of input-added event type.
 *
 * @param dappAddress
 * @param web3Provider
 * @returns
 */
export const buildInputFacetMeta = (
    dappAddress: string,
    web3Provider: Web3Provider
) => {
    if (!dappAddress || !web3Provider) return;
    const connection = InputFacet__factory.connect(
        dappAddress,
        web3Provider.getSigner()
    );
    return {
        getInputs(fromBlockNumber?: number) {
            return connection.queryFilter(
                connection.filters.InputAdded(),
                fromBlockNumber
            );
        },
    };
};
