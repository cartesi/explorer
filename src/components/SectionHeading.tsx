// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Heading } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useColorModeValue } from './ui/color-mode';

interface SectionHeadingProps {
    children: React.ReactNode;
}

const SectionHeading: FC<SectionHeadingProps> = ({
    children,
    ...restProps
}) => {
    const borderLeftColor = useColorModeValue('gray.900', 'gray.200');
    return (
        <Heading
            as="h5"
            borderLeftWidth="1px"
            borderLeftColor={borderLeftColor}
            borderLeftStyle="solid"
            marginTop={10}
            paddingLeft={3}
            size="lg"
            fontWeight="normal"
            {...restProps}
        >
            {children}
        </Heading>
    );
};

export default SectionHeading;
