// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

export interface TitleProps {
    title: string;
    icon: ReactNode;
    help: string;
}

const Title: FC<TitleProps> = ({ title, icon, help }) => (
    <HStack>
        {icon}
        <Text>{title}</Text>
        <Tooltip placement="top" label={help}>
            <Icon />
        </Tooltip>
    </HStack>
);

export default Title;
