// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FlexProps, Flex } from '@chakra-ui/react';

export const StepActions = (props: FlexProps) => {
    const { children, ...boxProps } = props;
    return (
        <Flex px={{ base: 3, md: 12 }} py={6} direction="column" {...boxProps}>
            {children}
        </Flex>
    );
};

StepActions.displayName = 'StepActions';
