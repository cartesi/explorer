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
import { FC, useState } from 'react';
import { UseQueryArgs } from 'urql';
import DAppCard from '../../components/DAppCard';
import {
    DApp_OrderBy,
    FactoryDAppsQueryVariables,
    useFactoryDAppsQuery,
} from '../../generated/graphql';

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
            <BigNumberText value={dappCount}></BigNumberText>
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
            <BigNumberText value={inputCount}></BigNumberText>
        </Banner>
    </Stack>
);

type BuildOptionsProps = {
    address: string;
    orderBy: DApp_OrderBy;
    first: number;
    skip?: number;
    search?: string;
};

type Options = Omit<UseQueryArgs<FactoryDAppsQueryVariables>, 'query'>;
/**
 * that is an query option builder mainly to deal with search param being empty. All the other
 * properties are standard setup with no custom logic.
 * @param {BuildOptionsProps}
 * @returns {Options}
 */
const buildOptions = ({
    address,
    orderBy,
    first,
    skip,
    search,
}: BuildOptionsProps): Options => {
    const options: Options = {
        variables: {
            id: address?.toLowerCase(),
            orderBy,
            first,
            skip,
        },
    };

    if (search.length % 2 === 1) {
        options.variables.where_dapp.id = search;
    }

    return options;
};

export const DAppFactory: FC<DAppFactoryProps> = (props) => {
    const { address, chainId } = props;
    // Pagination component is zero-based
    const [pageNumber, setPageNumber] = useState<number>(0);
    const bg = useColorModeValue('white', 'gray.800');
    const dappsBodyBg = useColorModeValue('white', 'gray.700');
    const [search, setSearch] = useState<string>('');
    const [orderBy, setOrderBy] = useState<DApp_OrderBy>(
        DApp_OrderBy.ActivityTimestamp
    );
    const DAPPS_PER_PAGE = 10;
    // query GraphQL
    const [result] = useFactoryDAppsQuery(
        buildOptions({
            address: address?.toLowerCase(),
            orderBy,
            search,
            first: DAPPS_PER_PAGE,
            skip: DAPPS_PER_PAGE * pageNumber,
        })
    );

    const { data, fetching, error } = result;

    const totalPages = Math.ceil(
        (data?.dappFactory?.dappCount ?? DAPPS_PER_PAGE) / DAPPS_PER_PAGE ?? 0
    );

    return (
        <Box bg={bg}>
            <PagePanel>
                {data?.dappFactory && (
                    <DappsSummary
                        dappCount={data.dappFactory.dappCount}
                        inputCount={data.dappFactory.inputCount}
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
                    {error && (
                        <Notification
                            status="error"
                            title="Error fetching DApps!"
                            subtitle={error.message}
                        />
                    )}
                    <HStack justifyContent="flex-end" spacing={2} mb={5}>
                        {fetching && <Spinner size="md" />}
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
                    {data && data.dappFactory && (
                        <>
                            <SimpleGrid
                                columns={{ base: 1, md: 2, xl: 3 }}
                                spacing={4}
                            >
                                {data.dappFactory.dapps.map(
                                    ({
                                        id,
                                        inputCount,
                                        deploymentTimestamp,
                                    }) => (
                                        <DAppCard
                                            key={id}
                                            address={id}
                                            chainId={chainId}
                                            date={
                                                new Date(
                                                    deploymentTimestamp * 1000
                                                )
                                            }
                                            inputCount={inputCount}
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
                                {fetching && <Spinner size="md" me={3} />}
                                <Pagination
                                    currentPage={pageNumber}
                                    showPageNumbers
                                    onPageClick={setPageNumber}
                                    pages={totalPages}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </PageBody>
        </Box>
    );
};
