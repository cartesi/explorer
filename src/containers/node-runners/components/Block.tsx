// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

const Block: FC<BoxProps> = ({ children, ...boxProps }) => (
    <Box
        px={{ base: '6vw', xl: '12vw' }}
        pt={{ base: 8, sm: '3vw' }}
        pb={{ base: 8, sm: '5vw' }}
        {...boxProps}
    >
        {children}
    </Box>
);

export default Block;
