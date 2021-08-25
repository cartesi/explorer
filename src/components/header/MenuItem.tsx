// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { Link, Text } from '@chakra-ui/react';

export interface MenuItemProps {
    selected: boolean;
    isLast?: boolean;
    to: string;
}

const MenuItem: FC<MenuItemProps> = ({
    children,
    selected,
    isLast,
    to = '/',
    ...rest
}) => {
    return (
        <Link href={to}>
            <Text
                display="block"
                fontWeight={selected ? 'bold' : 'normal'}
                {...rest}
            >
                {children}
            </Text>
        </Link>
    );
};

export default MenuItem;
