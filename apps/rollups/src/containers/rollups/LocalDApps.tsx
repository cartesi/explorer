// Copyright 2023 Cartesi Pte. Ltd.

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
    Flex,
    HStack,
    Icon,
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
} from '@explorer/ui';
import { FC } from 'react';
import DAppCard from '../../components/DAppCard';
import { useApplications } from '../../services/useApplications';

export interface LocalDAppListProps {
    chainId: number;
}

type SummaryProps = { dappCount: number; inputCount: number };

export const DappsSummary = ({ dappCount, inputCount = 0 }: SummaryProps) => (
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
                        <Icon data-testid="dapps-summary-dapps-count" />
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
                        <Icon data-testid="dapps-summary-input-count" />
                    </Tooltip>
                </HStack>
            }
        >
            <BigNumberText value={inputCount} />
        </Banner>
    </Stack>
);

export const LocalDAppList: FC<LocalDAppListProps> = (props) => {
    const { loading, applications, error } = useApplications();
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box bg={bg}>
            <PagePanel>
                <DappsSummary
                    dappCount={applications?.length ?? 0}
                    inputCount={0}
                />
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
                            status="warning"
                            title="Error trying to fetch data from local blockchain"
                            subtitle={error.message}
                        />
                    )}

                    <HStack justifyContent="flex-end" spacing={2} mb={5}>
                        {loading && (
                            <Spinner
                                size="md"
                                data-testid="local-dapp-list-spinner"
                            />
                        )}
                    </HStack>

                    {applications?.length > 0 ? (
                        <SimpleGrid
                            columns={{ base: 1, md: 2, xl: 3 }}
                            spacing={4}
                        >
                            {applications.map(
                                ({ address, inputs, deploymentTimestamp }) => (
                                    <DAppCard
                                        key={address}
                                        address={address}
                                        chainId={props.chainId}
                                        date={
                                            new Date(deploymentTimestamp * 1000)
                                        }
                                        inputCount={inputs?.length ?? 0}
                                        data-testid="dapps-list-card"
                                    />
                                )
                            )}
                        </SimpleGrid>
                    ) : !error && !loading ? (
                        <Flex justifyContent="center" alignItems="center">
                            No items
                        </Flex>
                    ) : null}
                </Box>
            </PageBody>
        </Box>
    );
};
