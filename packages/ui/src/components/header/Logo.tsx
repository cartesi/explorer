// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, BoxProps, Link, useToken } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC } from 'react';
import { CartesiLogo } from '../Icons';

export const Logo: FC<BoxProps> = (props) => {
    const [width, height] = useToken('space', ['48', '20']);

    return (
        <Box {...props}>
            <NextLink href="/" passHref>
                <Link _focus={{ outline: 'none' }} title="Cartesi logo">
                    <CartesiLogo color="white" width={width} height={height} />
                </Link>
            </NextLink>
        </Box>
    );
};
