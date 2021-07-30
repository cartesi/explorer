// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Stack,
    StackDivider,
    StackProps,
    useColorModeValue,
} from '@chakra-ui/react';

const StatsPanel: FC<StackProps> = (props) => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <Stack
            direction={['column', 'column', 'row', 'row']}
            divider={<StackDivider />}
            p="40px"
            justify="space-evenly"
            boxShadow="md"
            bg={bg}
            {...props}
        >
            {props.children}
        </Stack>
    );
};

export default StatsPanel;
