// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    CloseButton,
    Link,
    ListItem,
    OrderedList,
    Text,
} from '@chakra-ui/react';
import createPersistedState from 'use-persisted-state';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export interface StakingDisclaimerProps {
    persistanceKey: string;
}

const StakingDisclaimer: FC<StakingDisclaimerProps> = ({ persistanceKey }) => {
    // persistent state of user read disclaimer message, stored in browser localStorage
    const useDisclaimerState = createPersistedState(persistanceKey);
    const [acknowledged, setAcknowledged] = useDisclaimerState(false);

    return (
        <Alert status="warning" hidden={acknowledged}>
            <AlertIcon alignSelf="flex-start" />
            <Box flex="1">
                <AlertTitle mb={2}>Read carefully before staking!</AlertTitle>
                <AlertDescription>
                    <OrderedList>
                        <ListItem>
                            This is a PoS system and thus, probabilistic. It can
                            take a much longer time for you to produce blocks
                            than the estimated average
                        </ListItem>
                        <ListItem>
                            Estimated rewards can be highly variable, depending
                            on chance and on the total amount of CTSI staked by
                            everyone in the network
                        </ListItem>
                        <ListItem>
                            Whenever your node is unavailable, you miss the
                            chance of producing blocks. Cartesi's node depends
                            on the availability of the configured Ethereum node,
                            which is also prone to unavailability
                        </ListItem>
                        <ListItem>
                            It is important that you understand how your node
                            will spend ETH gas fees. Fees can be high depending
                            on gas price fluctuations
                        </ListItem>
                        <ListItem>Read the tutorial carefully</ListItem>
                        <ListItem>
                            <Text>
                                By running the above software, you are agreeing
                                to the open-source licenses present on our{' '}
                                <Link
                                    href="https://github.com/cartesi/noether/blob/master/LICENSE"
                                    isExternal
                                >
                                    GitHub
                                </Link>
                                . The software has been tested and audited, but
                                you run it at your own risk
                            </Text>
                        </ListItem>
                    </OrderedList>
                </AlertDescription>
                <Box mt={5}>
                    <Link
                        href="https://medium.com/cartesi/noethers-staking-delegation-mainnet-beta-is-now-live-3e8b4c712876"
                        isExternal
                        mt={5}
                    >
                        Detailed staking instructions
                        <ExternalLinkIcon
                            w={3}
                            h={3}
                            verticalAlign="top"
                            ml={1}
                        />
                    </Link>
                </Box>
            </Box>
            <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setAcknowledged(true)}
            />
        </Alert>
    );
};

export default StakingDisclaimer;
