// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, ReactNode } from 'react';
import { Link, Tooltip } from '@chakra-ui/react';
import NextLink from 'next/link';

export interface IconLinkProps {
    href: string;
    tooltip: string;
    icon: ReactNode;
}

const IconLink: FC<IconLinkProps> = (props) => {
    const { href, icon, tooltip } = props;
    return (
        <NextLink href={href} passHref>
            <Link>
                <Tooltip placement="top" label={tooltip}>
                    <span>{icon}</span>
                </Tooltip>
            </Link>
        </NextLink>
    );
};

export default IconLink;
