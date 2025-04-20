// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FaExternalLinkAlt } from 'react-icons/fa';
import {
    Button,
    Link,
    List,
    Stack,
    StackProps,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { BigNumber, BigNumberish } from 'ethers';
import { FC } from 'react';
import { InfoBanner } from '../stake/InfoBanner';
import { WalletBalanceSection } from '../stake/components/WalletBalanceSection';
import { NodeAllowanceSection } from './NodeAllowanceSection';
import { NodeAllowanceModal } from './modals/NodeAllowanceModal';

export interface NodeStakingDashboardProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
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
    const linkColor = useColorModeValue('dark.secondary', 'dark.primary');

    const { open, onToggle } = useDisclosure({
        defaultOpen: showInstructions,
    });

    const {
        open: isOpenAllowanceModal,
        onOpen: onOpenAllowanceModal,
        onClose: onCloseStakingPoolAllowanceModal,
    } = useDisclosure();

    const disclosure = useDisclosure();

    const handleDontShowAgainClick = () => {
        localStorage.setItem(SHOW_STAKING_INSTRUCTIONS, 'false');
        onToggle();
    };

    return (
        <>
            <VStack gap={8}>
                {showInstructions && (
                    <InfoBanner
                        title="Read carefully before staking!"
                        content={
                            <>
                                <List.Root as="ol" fontSize="sm" mt={2}>
                                    <List.Item>
                                        This is a PoS system and thus,
                                        probabilistic. It can take a much longer
                                        time for you to produce blocks than the
                                        estimated average.
                                    </List.Item>
                                    <List.Item>
                                        Estimated rewards can be highly
                                        variable, depending on chance and on the
                                        total amount of CTSI staked by everyone
                                        in the network.
                                    </List.Item>
                                    <List.Item>
                                        Whenever your node is unavailable, you
                                        miss the chance of producing blocks.
                                        Cartesi's node depends on the
                                        availability of the configured Ethereum
                                        node.
                                    </List.Item>
                                    <List.Item>
                                        This is a PoS system and thus,
                                        probabilistic. It can take a much longer
                                        time for you to produce blocks than the
                                        estimated average.
                                    </List.Item>
                                    <List.Item>
                                        Estimated rewards can be highly
                                        variable, depending on chance and on the
                                        total amount of CTSI staked by everyone
                                        in the network.
                                    </List.Item>
                                    <List.Item>
                                        Whenever your node is unavailable, you
                                        miss the chance of producing blocks.
                                        Cartesi's node depends on the
                                        availability of the configured Ethereum
                                        node.
                                    </List.Item>
                                </List.Root>
                                <Stack
                                    gap={4}
                                    direction={{ base: 'column', md: 'row' }}
                                    justifyContent="space-between"
                                    mt={6}
                                    w="full"
                                >
                                    <Link
                                        href="#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fontSize="sm"
                                        color={linkColor}
                                        _hover={{
                                            color: linkColor,
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Learn detailed staking instructions{' '}
                                        <FaExternalLinkAlt />
                                    </Link>
                                    <Button
                                        size="sm"
                                        onClick={handleDontShowAgainClick}
                                        colorScheme="cyan"
                                        variant="link"
                                        fontWeight="600"
                                        textTransform="uppercase"
                                    >
                                        Don't show again
                                    </Button>
                                </Stack>
                            </>
                        }
                        isOpen={open}
                        isClosable
                        status="warning"
                        onToggle={onToggle}
                    />
                )}
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    w="full"
                    justifyContent="space-between"
                    alignItems="flex-start"
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
                onSave={onApprove}
            />
        </>
    );
};
