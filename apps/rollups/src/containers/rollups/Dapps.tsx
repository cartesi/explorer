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
    ApplicationOrderByInput,
    useApplicationsQuery,
    useRollupsSummaryQuery,
} from '../../generated/graphql/squid';

export interface DappsProps {
    chainId: number;
}

export interface SummaryProps {
    dappCount: number;
    inputCount: number;
}

export const DappsSummary: FC<SummaryProps> = ({ dappCount, inputCount }) => {
    const iconColor = useColorModeValue('light.primary', 'dark.primary');
    return (
        <Stack
            direction={['column', 'column', 'row', 'row']}
            justify="space-evenly"
            w="100%"
            p={[5, 5, 10, 10]}
            px={['6vw', '6vw', '12vw', '12vw']}
            spacing={6}
        >
            <Banner
                Icon={<DappIcon color={iconColor} w={8} h={8} />}
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
                Icon={<InputIcon color={iconColor} w={8} h={8} />}
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
};

export interface DappsFiltersProps {
    orderBy: ApplicationOrderByInput;
    fetching: boolean;
    onChangeSearch: (search: string) => void;
    onChangeOrderBy: (orderBy: ApplicationOrderByInput) => void;
}

export const dappsFilterOptions = [
    {
        label: 'Recent Activity',
        value: ApplicationOrderByInput.ActivityTimestampDesc,
    },
    {
        label: 'Number of Activity',
        value: ApplicationOrderByInput.InputCountDesc,
    },
    {
        label: 'Newest',
        value: ApplicationOrderByInput.DeploymentTimestampDesc,
    },
];

export const DappsFilters: FC<DappsFiltersProps> = (props) => {
    const { orderBy, fetching, onChangeSearch, onChangeOrderBy } = props;
    const dappsBodyBg = useColorModeValue('white', 'dark.gray.quaternary');

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
                    onChangeOrderBy(
                        event.target.value as ApplicationOrderByInput
                    )
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
    const bg = useColorModeValue('white', 'dark.gray.primary');
    const [search, setSearch] = useState<string>('');
    const [orderBy, setOrderBy] = useState<ApplicationOrderByInput>(
        ApplicationOrderByInput.ActivityTimestampDesc
    );
    const perPage = 10;

    const [{ data }] = useRollupsSummaryQuery();
    const [{ data: result, fetching, error }] = useApplicationsQuery({
        variables: {
            orderBy,
            limit: perPage,
            offset: perPage * pageNumber,
            where:
                search && search.length > 0
                    ? {
                          id_eq: search,
                          factory_isNull: false,
                      }
                    : {
                          factory_isNull: false,
                      },
        },
    });

    const dappsCount = data?.rollupsSummary.totalApplications ?? 0;
    const dappsInputs = data?.rollupsSummary.totalInputs ?? 0;

    return (
        <Box bg={bg}>
            {hasFactories && (
                <PagePanel
                    data-testid="dapps-summary"
                    darkModeColor="dark.gray.primary"
                >
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
                    {error && (
                        <Notification
                            status="error"
                            title="Error fetching DApps!"
                            subtitle={error?.message}
                        />
                    )}

                    {!error && result?.applications ? (
                        <>
                            <DappsFilters
                                orderBy={orderBy}
                                fetching={fetching}
                                onChangeSearch={setSearch}
                                onChangeOrderBy={setOrderBy}
                            />

                            <DAppsList
                                dapps={result.applications}
                                dappsCount={dappsCount}
                                chainId={chainId}
                                pageNumber={pageNumber}
                                fetching={fetching}
                                onChangePageNumber={setPageNumber}
                            />
                        </>
                    ) : null}
                </Box>
            </PageBody>
        </Box>
    );
};
