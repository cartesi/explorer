// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Spinner,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    Banner,
    BigNumberText,
    DappIcon,
    InputIcon,
    Notification,
    PageBody,
    PagePanel,
} from '@explorer/ui';
import { FC, useState } from 'react';
import { DAppsList } from '../../components/DAppsList';
import {
    DAppStatus,
    DApp_OrderBy,
    useDappsQuery,
    useDashboardQuery,
} from '../../generated//graphql/subgraph';

export interface DappsProps {
    chainId: number;
}

export interface SummaryProps {
    dappCount: number;
    inputCount: number;
}

export const DappsSummary: FC<SummaryProps> = ({ dappCount, inputCount }) => (
    <Stack
        direction={['column', 'column', 'row', 'row']}
        justify="space-evenly"
        w="100%"
        p={[5, 5, 10, 10]}
        px={['6vw', '6vw', '12vw', '12vw']}
        spacing={6}
    >
        <Banner
            Icon={<Box as={DappIcon} w={8} h={8} />}
            Title={
                <HStack>
                    <Text># DApps</Text>
                    <Tooltip
                        label="Total number of DApps instantiated"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            }
            data-testid="dapps-summary-dapps-count"
        >
            <BigNumberText value={dappCount} />
        </Banner>

        <Banner
            Icon={<Box as={InputIcon} w={8} h={8} />}
            Title={
                <HStack>
                    <Text># Inputs</Text>
                    <Tooltip
                        label="Total number of inputs processed"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            }
            data-testid="dapps-summary-input-count"
        >
            <BigNumberText value={inputCount} />
        </Banner>
    </Stack>
);

export interface DappsFiltersProps {
    orderBy: DApp_OrderBy;
    fetching: boolean;
    onChangeSearch: (search: string) => void;
    onChangeOrderBy: (orderBy: DApp_OrderBy) => void;
}

export const dappsFilterOptions = [
    {
        label: 'Recent Activity',
        value: DApp_OrderBy.ActivityTimestamp,
    },
    {
        label: 'Number of Activity',
        value: DApp_OrderBy.InputCount,
    },
    {
        label: 'Newest',
        value: DApp_OrderBy.DeploymentTimestamp,
    },
];

export const DappsFilters: FC<DappsFiltersProps> = (props) => {
    const { orderBy, fetching, onChangeSearch, onChangeOrderBy } = props;
    const dappsBodyBg = useColorModeValue('white', 'gray.700');

    return (
        <HStack
            justifyContent="flex-end"
            spacing={2}
            mb={5}
            data-testid="dapps-filters"
        >
            {fetching && (
                <Spinner size="md" data-testid="dapps-filters-spinner" />
            )}

            <InputGroup width={300} bg={dappsBodyBg}>
                <InputLeftElement>
                    <SearchIcon />
                </InputLeftElement>

                <Input
                    placeholder="Search"
                    onChange={(event) => onChangeSearch(event.target.value)}
                />
            </InputGroup>

            <Select
                value={orderBy}
                bg={dappsBodyBg}
                width={250}
                data-testid="dapps-filters-order-by"
                onChange={(event) =>
                    onChangeOrderBy(event.target.value as DApp_OrderBy)
                }
            >
                {dappsFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </HStack>
    );
};

export const Dapps: FC<DappsProps> = (props) => {
    const { chainId } = props;
    const [pageNumber, setPageNumber] = useState<number>(0);
    const bg = useColorModeValue('white', 'gray.800');
    const [search, setSearch] = useState<string>('');
    const [orderBy, setOrderBy] = useState<DApp_OrderBy>(
        DApp_OrderBy.ActivityTimestamp
    );
    const perPage = 10;

    const status = DAppStatus.CreatedByFactory;
    const [dAppsResult] = useDappsQuery({
        variables: {
            orderBy,
            first: perPage,
            skip: perPage * pageNumber,
            where_dapp:
                search && search.length > 0
                    ? {
                          id: search,
                          status,
                      }
                    : { status },
        },
    });
    const [dashboardResult] = useDashboardQuery({
        variables: {
            id: String(1),
        },
    });

    const dappsCount = dashboardResult.data?.dashboard?.dappCount ?? 0;
    const dappsInputs = dashboardResult.data?.dashboard?.inputCount ?? 0;
    const hasFactories = dashboardResult.data?.dashboard?.factoryCount ?? false;

    return (
        <Box bg={bg}>
            {hasFactories && (
                <PagePanel data-testid="dapps-summary">
                    <DappsSummary
                        dappCount={dappsCount}
                        inputCount={dappsInputs}
                    />
                </PagePanel>
            )}

            <PageBody p={0}>
                <Box
                    shadow="md"
                    mt={[4, 4, 8]}
                    px={{ md: '12vw', xl: '12vw' }}
                    py={{ base: 10 }}
                >
                    {dAppsResult.error && (
                        <Notification
                            status="error"
                            title="Error fetching DApps!"
                            subtitle={dAppsResult.error?.message}
                        />
                    )}

                    {!dAppsResult.error && dAppsResult.data?.dapps ? (
                        <>
                            <DappsFilters
                                orderBy={orderBy}
                                fetching={dAppsResult.fetching}
                                onChangeSearch={setSearch}
                                onChangeOrderBy={setOrderBy}
                            />

                            <DAppsList
                                dapps={dAppsResult.data.dapps}
                                dappsCount={dappsCount}
                                chainId={chainId}
                                pageNumber={pageNumber}
                                fetching={dAppsResult.fetching}
                                onChangePageNumber={setPageNumber}
                            />
                        </>
                    ) : null}
                </Box>
            </PageBody>
        </Box>
    );
};
