// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Button, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { Address, SimpleChartIcon } from '@explorer/ui';
import { useWallet } from '@explorer/wallet';
import { isObject, isString } from 'lodash';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { AiOutlineLeft } from 'react-icons/ai';
import Layout from '../../../components/Layout';
import PageHead from '../../../components/PageHead';
import { PoolManageContainer } from '../../../containers/pool-manage/PoolManageContainer';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';

const PoolNode: FC = () => {
    const { account, chainId, active } = useWallet();
    const router = useRouter();
    const address = router.query.pool as string;
    const from = router.query.from as string;
    const stakingPool = useStakingPoolQuery(address);
    const isManager = account && account.toLowerCase() === stakingPool?.manager;
    const hasFrom = isString(from);
    const backLink =
        from === 'node-runners'
            ? '/node-runners'
            : `/stake/${address}${hasFrom ? `/${from}` : ''}`;
    const backText = backLink.includes('node-runners')
        ? 'Back to pool management list'
        : `Back to pool ${hasFrom ? from : 'info'}`;

    useEffect(() => {
        if (!active) router.replace('/node-runners');
    }, [active, router]);

    useEffect(() => {
        if (isObject(stakingPool) && !isManager) {
            router.replace(`/stake/${address}`);
        }
    }, [stakingPool, isManager, router, address]);

    return (
        <Layout>
            <PageHead
                title="Manage a Cartesi pool"
                description="Manage a Cartesi pool"
            />

            <HStack
                bg="dark.gray.tertiary"
                color="white"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <NextLink href={backLink} passHref>
                    <Box as="a" display="flex" alignItems="center">
                        <Box as={AiOutlineLeft} mr={1} />
                        <Text>{backText}</Text>
                    </Box>
                </NextLink>
            </HStack>
            <Box
                bg="dark.gray.tertiary"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={0}
                pb={5}
            >
                <Stack alignItems={'flex-start'} direction={'row'}>
                    <Heading as="h1" fontSize={{ base: '4xl', xl: '5xl' }}>
                        {address && (
                            <HStack>
                                <Address
                                    address={address}
                                    chainId={chainId}
                                    ens
                                    truncated
                                    fontSize={'3xl'}
                                />

                                <NextLink href={`/stake/${address}`} passHref>
                                    <Button
                                        as="a"
                                        variant="text"
                                        size="sm"
                                        pl={0}
                                        title="Pool info"
                                    >
                                        <SimpleChartIcon w={6} h={6} />
                                    </Button>
                                </NextLink>
                            </HStack>
                        )}
                    </Heading>
                </Stack>
            </Box>

            <PoolManageContainer address={address} />
        </Layout>
    );
};

export default PoolNode;
