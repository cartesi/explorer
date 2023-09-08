// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import NextLink from 'next/link';

export interface IPoolBreadcrumbsProps {
    currentPage: string;
}

export const PoolBreadcrumbs: FC<IPoolBreadcrumbsProps> = ({ currentPage }) => {
    const router = useRouter();
    const address = router.query.pool as string;
    const bg = useColorModeValue('white', 'dark.gray.quaternary');
    const boxShadow = useColorModeValue('md', 'none');

    return (
        <Box
            position="relative"
            display={{
                base: 'none',
                lg: 'block',
            }}
            px={{ base: '6vw', xl: '12vw' }}
            py={3}
            boxShadow={boxShadow}
            fontSize="sm"
            zIndex={10}
            backgroundColor={bg}
        >
            <Breadcrumb>
                <BreadcrumbItem>
                    <NextLink href={`/stake/${address}`}>
                        <BreadcrumbLink>Pool</BreadcrumbLink>
                    </NextLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink
                        cursor="default"
                        _hover={{
                            textDecoration: 'none',
                        }}
                    >
                        {currentPage}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </Box>
    );
};
