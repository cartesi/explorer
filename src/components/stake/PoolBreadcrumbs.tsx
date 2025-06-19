// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Breadcrumb } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import NextLink from 'next/link';
import { TbSlash } from 'react-icons/tb';
import { useColorModeValue } from '../ui/color-mode';

export interface IPoolBreadcrumbsProps {
    currentPage: string;
}

export const PoolBreadcrumbs: FC<IPoolBreadcrumbsProps> = ({ currentPage }) => {
    const params = useParams();
    const address = params.pool as string;
    const color = useColorModeValue('gray.600', 'gray.100');
    const separatorColor = useColorModeValue('gray.900', 'white');
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
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link
                            asChild
                            color={color}
                            _hover={{ textDecoration: 'underline ' }}
                        >
                            <NextLink href={`/stake/${address}`}>Pool</NextLink>
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator color={separatorColor}>
                        <TbSlash />
                    </Breadcrumb.Separator>
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink
                            cursor="default"
                            _hover={{
                                textDecoration: 'none',
                            }}
                        >
                            {currentPage}
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </Box>
    );
};
