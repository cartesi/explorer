// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    HStack,
    Tag,
    TagLabel,
    Box,
    useDisclosure,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '../../services/ens';
import { truncateStringMobile } from '../../utils/stringUtilsMobile';
import { useWallet } from '../../contexts/wallet';
import { ArrowsUpDownIcon } from '../Icons';
import { WalletMobileModal } from './modals/WalletMobileModal';

const AccountMobile: FC = () => {
    const { account } = useWallet();
    const ens = useENS(account);
    const {
        isOpen: isOpenWalletMobileModal,
        onOpen: onOpenWalletMobileModal,
        onClose: onCloseWalletMobileModal,
    } = useDisclosure();
    const disclosure = useDisclosure();
    const bgColor = useColorModeValue('white', 'gray.700');
    const color = useColorModeValue('black', 'white');

    if (!account) {
        return null;
    }

    return (
        <Tag
            size="md"
            borderRadius="0"
            colorScheme="gray"
            h={10}
            onClick={() => onOpenWalletMobileModal()}
            key={'xs'}
            bg={bgColor}
        >
            <HStack w="full" spacing={4}>
                <Box flexGrow="1">
                    <Jazzicon
                        diameter={15}
                        seed={jsNumberForAddress(account)}
                    />
                    <TagLabel
                        px={2}
                        style={{
                            fontSize: 14,
                            fontWeight: 400,
                        }}
                        color={color}
                    >
                        {ens.name ||
                            truncateStringMobile(ens.address || account)}
                    </TagLabel>
                </Box>
                <Box alignSelf="flex-end">
                    <ArrowsUpDownIcon
                        style={{
                            height: 23,
                            width: 24,
                        }}
                        color={color}
                    />
                </Box>
            </HStack>

            <WalletMobileModal
                isOpen={isOpenWalletMobileModal}
                disclosure={disclosure}
                onClose={onCloseWalletMobileModal}
            />
        </Tag>
    );
};

export default AccountMobile;
