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
import React, { FC, useState } from 'react';
import { DApp_OrderBy, useFactoryDAppsQuery } from '../../generated/graphql';
import DAppCard from '../../components/rollups/DAppCard';
import { PageBody, PagePanel } from '../../components/Layout';
import BigNumberText from '../../components/BigNumberText';
import { SearchIcon } from '@chakra-ui/icons';
import { Notification } from '../../components/Notification';
import StakeCard from '../../components/stake/StakeCard';
import { DappIcon, InputIcon } from '../../components/Icons';

export interface DAppFactoryProps {
    address: string;
    chainId: number;
}

export const DAppFactory: FC<DAppFactoryProps> = (props) => {
    const { address, chainId } = props;
    const bg = useColorModeValue('gray.80', 'header');
    const dappsBodyBg = useColorModeValue('white', 'gray.700');
    const [search, setSearch] = useState<string>('');
    const [orderBy, setOrderBy] = useState<DApp_OrderBy>(
        DApp_OrderBy.ActivityTimestamp
    );

    // query GraphQL
    const [result] = useFactoryDAppsQuery({
        variables: {
            id: address,
            orderBy,
            search: search.length % 2 == 1 ? `0${search}` : search,
        },
    });
    const { data, fetching, error } = result;
    return (
        <Box bg={bg}>
            <PagePanel>
                {data?.dappFactory && (
                    <Stack
                        direction={['column', 'column', 'row', 'row']}
                        justify="space-evenly"
                        w="100%"
                        p={[5, 5, 10, 10]}
                        px={['6vw', '6vw', '12vw', '12vw']}
                        spacing={6}
                    >
                        <StakeCard
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
                            <BigNumberText
                                value={data.dappFactory?.dappCount}
                            ></BigNumberText>
                        </StakeCard>
                        <StakeCard
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
                            <BigNumberText
                                value={data.dappFactory?.inputCount}
                            ></BigNumberText>
                        </StakeCard>
                    </Stack>
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
                        <SimpleGrid
                            columns={{ base: 1, md: 2, xl: 3 }}
                            spacing={4}
                        >
                            {data.dappFactory.dapps.map(
                                ({ id, inputCount, deploymentTimestamp }) => (
                                    <DAppCard
                                        key={id}
                                        address={id}
                                        chainId={chainId}
                                        date={
                                            new Date(deploymentTimestamp * 1000)
                                        }
                                        inputCount={inputCount}
                                    />
                                )
                            )}
                        </SimpleGrid>
                    )}
                </Box>
            </PageBody>
        </Box>
    );
};
