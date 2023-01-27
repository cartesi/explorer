// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Flex, HStack, Icon, TextProps } from '@chakra-ui/react';
import { FC } from 'react';
import { IconType } from 'react-icons';
import Address from './Address';

export interface PoolIdProps extends TextProps {
    address: string;
    chainId: number;
    icon?: IconType;
}

const AddressText: FC<PoolIdProps> = (props) => {
    const { address, chainId, children, icon } = props;

    return (
        <Flex align="baseline" justify="space-between" direction="column">
            <HStack>
                {icon && <Icon as={icon} color={props.color} />}
                {children}
            </HStack>
            <HStack align="baseline">
                {address && (
                    <Address
                        address={address}
                        chainId={chainId}
                        ens
                        truncated
                        fontSize={props.fontSize || '3xl'}
                    />
                )}
            </HStack>
        </Flex>
    );
};

export default AddressText;
