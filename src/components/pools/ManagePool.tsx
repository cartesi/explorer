// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    Stack,
    Text,
} from '@chakra-ui/react';
import { isObject, isString } from 'lodash';
import NextLink from 'next/link';
import { FC, useEffect } from 'react';
import { AiOutlineLeft } from 'react-icons/ai';
import Address from '../Address';
import { SimpleChartIcon } from '../Icons';
import Layout from '../Layout';
import { useWallet } from '../wallet';
import { PoolManageContainer } from '../../containers/pool-manage/PoolManageContainer';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const PoolNode: FC = () => {
    const { account, chainId, active } = useWallet();
    const router = useRouter();
    const params = useParams();
    const address = params.pool as string;
    const searchParams = useSearchParams();
    const from = searchParams.get('from') as string;
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
            <HStack
                bg="dark.gray.tertiary"
                color="white"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <Box asChild display="flex" alignItems="center">
                    <NextLink href={backLink}>
                        <Box as={AiOutlineLeft} mr={1} />
                        <Text>{backText}</Text>
                    </NextLink>
                </Box>
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

                                <Button
                                    asChild
                                    variant="text"
                                    size="sm"
                                    pl={0}
                                    title="Pool info"
                                >
                                    <NextLink href={`/stake/${address}`}>
                                        <Icon
                                            as={SimpleChartIcon}
                                            w={6}
                                            h={6}
                                        />
                                    </NextLink>
                                </Button>
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
