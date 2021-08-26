// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Heading, HStack, StackProps } from '@chakra-ui/react';

export interface PageHeaderProps extends StackProps {
    title: string;
}

const PageHeader: FunctionComponent<PageHeaderProps> = (props) => {
    const { title, children, ...rest } = props;
    return (
        <HStack
            w="100%"
            px="6vw"
            py="5"
            bg="black"
            opacity={0.9}
            color="white"
            justify="space-between"
            {...rest}
        >
            <Heading fontWeight="normal">{title}</Heading>
            <HStack>{children}</HStack>
        </HStack>
    );
};

export default PageHeader;
