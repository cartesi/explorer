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
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    Tooltip,
    Flex,
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
    Pagination,
} from '@explorer/ui';
import { FC, useEffect, useMemo, useState } from 'react';
import { UseQueryArgs } from 'urql';
import DAppCard from '../../components/DAppCard';
import {
    DApp_OrderBy,
    FactoryDAppsQueryVariables,
    useDappFactoriesQuery,
    useDappsQuery,
    useFactoryDAppsQuery,
} from '../../generated/graphql';
import { DAppsList } from '../../components/DAppsList';

export interface DAppFactoryProps {
    address: string;
    chainId: number;
}

type SummaryProps = { dappCount: number; inputCount: number };

const DappsSummary = ({ dappCount, inputCount }: SummaryProps) => (
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
        >
            <BigNumberText value={inputCount} />
        </Banner>
    </Stack>
);

export const DAppFactory: FC<DAppFactoryProps> = (props) => {
    const { chainId } = props;
    const [pageNumber, setPageNumber] = useState<number>(0);
    const bg = useColorModeValue('white', 'gray.800');
    const dappsBodyBg = useColorModeValue('white', 'gray.700');
    const [search, setSearch] = useState<string>('');
    const [orderBy, setOrderBy] = useState<DApp_OrderBy>(
        DApp_OrderBy.ActivityTimestamp
    );
    const DAPPS_PER_PAGE = 10;
    const [dAppsResult] = useDappsQuery({
        variables: {
            orderBy,
            first: DAPPS_PER_PAGE,
            skip: DAPPS_PER_PAGE * pageNumber,
            where_dapp:
                search && search.length > 0 ? { id: search } : undefined,
        },
    });

    const [dAppsFactoriesResult] = useDappFactoriesQuery();
    const dAppsFactories = useMemo(
        () => dAppsFactoriesResult?.data?.dappFactories ?? [],
        [dAppsFactoriesResult?.data?.dappFactories]
    );
    const dappsCount = dAppsFactories.reduce(
        (accumulator, factory) => accumulator + factory.dappCount,
        0
    );
    const dappsInputs = dAppsFactories.reduce(
        (accumulator, factory) => accumulator + factory.inputCount,
        0
    );
    const hasFactories = dAppsFactories.length > 0;

    return (
        <Box bg={bg}>
            <PagePanel>
                {hasFactories && (
                    <DappsSummary
                        dappCount={dappsCount}
                        inputCount={dappsInputs}
                    />
                )}
            </PagePanel>
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
                    <HStack justifyContent="flex-end" spacing={2} mb={5}>
                        {dAppsResult.fetching && <Spinner size="md" />}
                        <InputGroup width={300} bg={dappsBodyBg}>
                            <InputLeftElement>
                                <SearchIcon />
                            </InputLeftElement>
                            <Input
                                placeholder="Search"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                        <Select
                            width={250}
                            value={orderBy}
                            onChange={(event) =>
                                setOrderBy(event.target.value as DApp_OrderBy)
                            }
                            bg={dappsBodyBg}
                        >
                            <option value={DApp_OrderBy.ActivityTimestamp}>
                                Recent Activity
                            </option>
                            <option value={DApp_OrderBy.InputCount}>
                                Number of Activity
                            </option>
                            <option value={DApp_OrderBy.DeploymentTimestamp}>
                                Newest
                            </option>
                        </Select>
                    </HStack>

                    {dAppsResult && dAppsResult.data?.dapps && (
                        <DAppsList
                            dapps={dAppsResult.data.dapps}
                            dappsCount={dappsCount}
                            chainId={chainId}
                            pageNumber={pageNumber}
                            fetching={dAppsResult.fetching}
                            onChangePageNumber={setPageNumber}
                        />
                    )}
                </Box>
            </PageBody>
        </Box>
    );
};
