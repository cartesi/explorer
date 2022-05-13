// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    OrderedList,
    ListItem,
    Stack,
    Link,
    Button,
    useDisclosure,
    VStack,
    useColorModeValue,
    StackProps,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { InfoBanner } from '../poolRedesign/InfoBanner';
import { WalletBalanceSection } from '../poolRedesign/components/WalletBalanceSection';
import { NodeAllowanceSection } from './NodeAllowanceSection';
import { NodeAllowanceModal } from './NodeAllowanceModal';

export interface NodeStakingDashboardProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userBalance: BigNumber; // user pool balance
    userETHBalance: BigNumber; // user ETH balance
    onApprove: (amount: BigNumberish) => void;
}

const SHOW_STAKING_INSTRUCTIONS = 'showStakingInstructions';

export const NodeStakingDashboard: FC<NodeStakingDashboardProps> = ({
    userETHBalance,
    allowance,
    balance,
    onApprove,
}) => {
    const localFlagItem = localStorage.getItem(SHOW_STAKING_INSTRUCTIONS);
    const showInstructions = localFlagItem ? JSON.parse(localFlagItem) : true;

    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: showInstructions,
    });

    const {
        isOpen: isOpenAllowanceModal,
        onOpen: onOpenAllowanceModal,
        onClose: onCloseStakingPoolAllowanceModal,
    } = useDisclosure();

    const disclosure = useDisclosure();

    const borderColor = useColorModeValue('gray.100', 'transparent');
    const [allowanceTransaction, setAllowanceTransaction] = useState(false);

    const handleDontShowAgainClick = () => {
        localStorage.setItem(SHOW_STAKING_INSTRUCTIONS, 'false');
        onToggle();
    };

    return (
        <>
            <VStack spacing={8}>
                {showInstructions && (
                    <InfoBanner
                        title="Read carefully before staking!"
                        content={
                            <>
                                <OrderedList fontSize="sm" mt={2}>
                                    <ListItem>
                                        This is a PoS system and thus,
                                        probabilistic. It can take a much longer
                                        time for you to produce blocks than the
                                        estimated average.
                                    </ListItem>
                                    <ListItem>
                                        Estimated rewards can be highly
                                        variable, depending on chance and on the
                                        total amount of CTSI staked by everyone
                                        in the network.
                                    </ListItem>
                                    <ListItem>
                                        Whenever your node is unavailable, you
                                        miss the chance of producing blocks.
                                        Cartesi's node depends on the
                                        availability of the configured Ethereum
                                        node.
                                    </ListItem>
                                    <ListItem>
                                        This is a PoS system and thus,
                                        probabilistic. It can take a much longer
                                        time for you to produce blocks than the
                                        estimated average.
                                    </ListItem>
                                    <ListItem>
                                        Estimated rewards can be highly
                                        variable, depending on chance and on the
                                        total amount of CTSI staked by everyone
                                        in the network.
                                    </ListItem>
                                    <ListItem>
                                        Whenever your node is unavailable, you
                                        miss the chance of producing blocks.
                                        Cartesi's node depends on the
                                        availability of the configured Ethereum
                                        node.
                                    </ListItem>
                                </OrderedList>
                                <Stack
                                    spacing={4}
                                    direction={{ base: 'column', md: 'row' }}
                                    justifyContent="space-between"
                                    mt={6}
                                    w="full"
                                >
                                    <Link
                                        href="#"
                                        isExternal
                                        fontSize="sm"
                                        color="orange.500"
                                        _hover={{
                                            color: 'orange.600',
                                        }}
                                    >
                                        Learn detailed staking instructions{' '}
                                        <ExternalLinkIcon />
                                    </Link>
                                    <Button
                                        size="sm"
                                        onClick={handleDontShowAgainClick}
                                        colorScheme="darkGray"
                                    >
                                        Don't show again
                                    </Button>
                                </Stack>
                            </>
                        }
                        isOpen={isOpen}
                        isClosable
                        borderTop="1px solid"
                        borderRight="1px solid"
                        borderBottom="1px solid"
                        borderTopColor={borderColor}
                        borderRightColor={borderColor}
                        borderBottomColor={borderColor}
                        status="warning"
                        onToggle={onToggle}
                    />
                )}
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    // spacing={8}
                    w="full"
                    justifyContent="space-between"
                >
                    <WalletBalanceSection
                        userCTSIBalance={balance}
                        userETHBalance={userETHBalance}
                    />
                    <NodeAllowanceSection
                        allowance={allowance}
                        onAllowanceClick={onOpenAllowanceModal}
                    />
                </Stack>
            </VStack>

            <NodeAllowanceModal
                isOpen={isOpenAllowanceModal}
                disclosure={disclosure}
                allowance={allowance}
                balance={balance}
                onClose={onCloseStakingPoolAllowanceModal}
                onSave={(amount) => {
                    setAllowanceTransaction(true);
                    onApprove(amount);
                }}
            />
        </>
    );
};
