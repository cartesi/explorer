// Copyright (C) 2021 Cartesi Pte. Ltd.

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
    Box,
    Link,
    Button,
    useDisclosure,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { InfoBanner } from '../InfoBanner';

const SHOW_STAKING_INSTRUCTIONS = 'showStakingInstructions';

export const StakingInstructions: FC = ({}) => {
    const localFlagItem = localStorage.getItem(SHOW_STAKING_INSTRUCTIONS);
    const showInstructions = localFlagItem ? JSON.parse(localFlagItem) : true;

    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: showInstructions,
    });

    const borderColor = useColorModeValue('gray.100', 'transparent');

    const handleDontShowAgainClick = () => {
        localStorage.setItem(SHOW_STAKING_INSTRUCTIONS, 'false');
        onToggle();
    };

    return (
        <>
            {showInstructions && (
                <Box pb={{ base: 6, sm: 10, lg: 10 }}>
                    <InfoBanner
                        title="Earn rewards by staking CTSI"
                        content={
                            <>
                                <OrderedList fontSize="sm" mt={2}>
                                    <ListItem>
                                        Staking is a great way to maximize your
                                        holdings that would otherwise be sitting
                                        in your e-wallet.
                                    </ListItem>
                                    <ListItem>
                                        Rewards are a form of incentive that you
                                        can earn when you stake your CTSI coins
                                        for a period of your liking.
                                    </ListItem>
                                    <ListItem>
                                        You will receive rewards from your
                                        staked holdings, which will
                                        automatically be staked as well,
                                        allowing you to further increase your
                                        holdings through the compound interest
                                        effect.
                                    </ListItem>
                                    <ListItem>
                                        The frequency of the rewards payment
                                        depends on the size of the pool. It can
                                        range from several per day to just one
                                        in months.
                                    </ListItem>
                                    <ListItem>
                                        To get started, simply choose the amount
                                        you wish to stake. Once Cartesi has
                                        verified your deposit amount, it is
                                        ready to be staked and earn rewards
                                        through the Proof of Stake process.
                                    </ListItem>
                                    <ListItem>
                                        The verification time may take longer
                                        than expected if there is a high volume
                                        of requests.
                                    </ListItem>
                                    <ListItem>
                                        Estimated rewards may vary greatly
                                        depending on chance and the total amount
                                        of CTSI staked by all members of the
                                        network.
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
                                        variant="link"
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
                </Box>
            )}
        </>
    );
};
