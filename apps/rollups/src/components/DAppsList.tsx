// Copyright 2023 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { Box, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import { Pagination } from '@explorer/ui';
import { FC } from 'react';
import { Application } from '../generated/graphql/squid';
import DAppCard from './DAppCard';

export interface DApp {
    id: string;
    inputCount: number;
    deploymentTimestamp: any;
}

export interface DAppsListProps {
    dapps: Application[];
    dappsCount: number;
    chainId: number;
    fetching: boolean;
    pageNumber: number;
    perPage?: number;
    onChangePageNumber: (pageNumber: number) => void;
}

export const DAppsList: FC<DAppsListProps> = (props) => {
    const {
        dapps,
        dappsCount,
        chainId,
        fetching,
        pageNumber,
        perPage = 10,
        onChangePageNumber,
    } = props;
    const totalPages = Math.ceil((dappsCount ?? perPage) / perPage ?? 0);

    return (
        <>
            {dapps.length > 0 ? (
                <div data-testid="dapps-list">
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                        {dapps.map(
                            ({ id, inputCount, deploymentTimestamp }) => (
                                <DAppCard
                                    key={id}
                                    address={id}
                                    chainId={chainId}
                                    date={
                                        new Date(parseInt(deploymentTimestamp))
                                    }
                                    inputCount={inputCount}
                                    data-testid="dapps-list-card"
                                />
                            )
                        )}
                    </SimpleGrid>

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        mt={2}
                    >
                        {fetching && (
                            <Spinner
                                size="md"
                                me={3}
                                data-testid="dapps-list-spinner"
                            />
                        )}

                        <Pagination
                            currentPage={pageNumber}
                            pages={totalPages}
                            data-testid="dapps-list-pagination"
                            showPageNumbers
                            onPageClick={onChangePageNumber}
                        />
                    </Box>
                </div>
            ) : (
                <Flex justifyContent="center" alignItems="center">
                    No items
                </Flex>
            )}
        </>
    );
};
