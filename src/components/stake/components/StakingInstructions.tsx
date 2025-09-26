// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Button, List, Stack, useDisclosure } from '@chakra-ui/react';
import React, { FC } from 'react';
import { InfoBanner } from '../InfoBanner';

const SHOW_STAKING_INSTRUCTIONS = 'showStakingInstructions';

const instructions = [
    'Staking is a great way to maximize your holdings that would otherwise be sitting in your e-wallet.',
    'Rewards are a form of incentive that you can earn when you stake your CTSI coins for a period of your liking.',
    'You will receive rewards from your staked holdings, which will automatically be staked as well, allowing you to further increase your holdings through the compound interest effect.',
    'The frequency of the rewards payment depends on the size of the pool. It can range from several per day to just one in months.',
    'To get started, simply choose the amount you wish to stake. Once Cartesi has verified your deposit amount, it is ready to be staked and earn rewards through the Proof of Stake process.',
    'The verification time may take longer than expected if there is a high volume of requests.',
    'Estimated rewards may vary greatly depending on chance and the total amount of CTSI staked by all members of the network.',
];

export const StakingInstructions: FC = () => {
    const localFlagItem = localStorage.getItem(SHOW_STAKING_INSTRUCTIONS);
    const showInstructions = localFlagItem ? JSON.parse(localFlagItem) : true;

    const { open, onToggle } = useDisclosure({
        defaultOpen: showInstructions,
    });

    const handleDontShowAgainClick = () => {
        localStorage.setItem(SHOW_STAKING_INSTRUCTIONS, 'false');
        onToggle();
    };

    return (
        <>
            {showInstructions && (
                <Box pb={open ? { base: 6, sm: 10, lg: 10 } : '0'}>
                    <InfoBanner
                        title="Earn rewards by staking CTSI"
                        content={
                            <>
                                <List.Root as="ol" fontSize="sm" mt={2}>
                                    {instructions.map((instruction, index) => (
                                        <List.Item
                                            key={index}
                                            _marker={{ color: 'inherit' }}
                                            ml={4}
                                            mb={
                                                index < instruction.length - 1
                                                    ? 1
                                                    : 0
                                            }
                                        >
                                            {instruction}
                                        </List.Item>
                                    ))}
                                </List.Root>
                                <Stack
                                    gap={4}
                                    direction={{ base: 'column', md: 'row' }}
                                    justifyContent="flex-end"
                                    mt={6}
                                    w="full"
                                >
                                    <Button
                                        size="sm"
                                        onClick={handleDontShowAgainClick}
                                        variant="link"
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
                </Box>
            )}
        </>
    );
};
