// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';

const NavBarContainer: FunctionComponent<FlexProps> = ({
    children,
    ...props
}) => {
    return (
        <Flex
            as="nav"
            align="center"
            position="fixed"
            justify="space-between"
            wrap="wrap"
            w="100%"
            mb={8}
            p={8}
            bg={['primary.500', 'primary.500', 'transparent', 'transparent']}
            color={['white', 'white', 'primary.700', 'primary.700']}
            {...props}
        >
            {children}
        </Flex>
    );
};

export default NavBarContainer;
