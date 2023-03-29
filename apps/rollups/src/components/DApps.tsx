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
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    SimpleGrid,
} from '@chakra-ui/react';
import { FC } from 'react';
import { DApp } from '../generated/graphql';
import DAppCard from './DAppCard';

export interface DAppsProps {
    chainId: number;
    dapps: DApp[];
}

export const DApps: FC<DAppsProps> = (props) => {
    const { chainId, dapps } = props;
    return (
        <>
            {dapps && (
                <SimpleGrid columns={[2, null, 3]} spacing={4}>
                    {dapps.map((dapp) => (
                        <DAppCard
                            key={dapp.id}
                            address={dapp.id}
                            inputCount={dapp.inputCount}
                            date={new Date(dapp.activityTimestamp)}
                            chainId={chainId}
                            data-testid="dapps-card"
                        />
                    ))}
                </SimpleGrid>
            )}
            {dapps.length === 0 && (
                <Alert status="info">
                    <AlertIcon />
                    <AlertTitle>No DApps instantiated</AlertTitle>
                    <AlertDescription>
                        No DApps have been instantiated by the DApp Factory
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
};
