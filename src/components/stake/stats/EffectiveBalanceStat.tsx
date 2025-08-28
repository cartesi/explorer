// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Button,
    HStack,
    Icon,
    Popover,
    Portal,
    Separator,
    StackProps,
    Text,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { FC } from 'react';
import { useTimeLeft } from '../../../utils/react';
import { formatCTSI } from '../../../utils/token';
import BigNumberTextV2 from '../../BigNumberTextV2';
import { EffectiveBalanceIcon, EyeIcon, RebalanceIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';
import { TbHelp } from 'react-icons/tb';

export interface EffectiveBalanceStatProps extends StackProps {
    stake: BigNumber;
    unstake: BigNumber;
    withdraw: BigNumber;
    stakingMature: BigNumber;
    stakingMaturing: BigNumber;
    stakingReleasing: BigNumber;
    stakingReleased: BigNumber;
    stakingMaturingTimestamp: Date;
    stakingReleasingTimestamp: Date;
    onRebalance?: () => void;
}

const EffectiveBalanceStat: FC<EffectiveBalanceStatProps> = (props) => {
    const {
        stake,
        unstake,
        withdraw,
        stakingMature,
        stakingMaturing,
        stakingReleasing,
        stakingReleased,
        stakingMaturingTimestamp,
        stakingReleasingTimestamp,
        onRebalance,
    } = props;

    // tells if an action needs to be done to move tokens around
    const needRebalance =
        stake?.gt(constants.Zero) ||
        unstake?.gt(constants.Zero) ||
        withdraw?.gt(constants.Zero);

    let rebalanceLabel = 'click to rebalance.';
    if (stake?.gt(constants.Zero)) {
        rebalanceLabel =
            `${formatCTSI(stake)} CTSI to stake, ` + rebalanceLabel;
    } else if (unstake?.gt(constants.Zero)) {
        rebalanceLabel =
            `${formatCTSI(unstake)} CTSI to unstake, ` + rebalanceLabel;
    } else if (withdraw?.gt(constants.Zero)) {
        rebalanceLabel =
            `${formatCTSI(withdraw)} CTSI to withdraw, ` + rebalanceLabel;
    }
    // countdown timers for maturation and release
    const maturingLeft = useTimeLeft(stakingMaturingTimestamp?.getTime());
    const releasingLeft = useTimeLeft(stakingReleasingTimestamp?.getTime());

    const bgDivider = useColorModeValue('gray.100', 'gray.600');
    const popoverBodyColor = useColorModeValue('white', 'dark.gray.primary');
    const iconColor = useColorModeValue('light.primary', 'dark.primary');
    const iconBackgroundColor = useColorModeValue(
        'dark.gray.senary',
        'transparent'
    );

    return (
        <VStack align="flex-start" flexBasis={{ base: '100%', lg: '33.33%' }}>
            <HStack gap={4} align="center" p={4} w="full">
                <Box
                    bg={iconBackgroundColor}
                    w={14}
                    h={14}
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                    flexShrink={0}
                >
                    <Icon
                        as={EffectiveBalanceIcon}
                        color={iconColor}
                        w={7}
                        h={7}
                    />
                </Box>
                <BigNumberTextV2
                    unit="ctsi"
                    value={stakingMature}
                    color={needRebalance ? 'red' : undefined}
                    options={{
                        notation: 'compact',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }}
                >
                    <HStack>
                        <Text color={needRebalance ? 'red' : undefined}>
                            Effective Balance
                        </Text>
                        <Tooltip
                            showArrow
                            content="Amount of mature pool tokens at the Staking contract"
                            positioning={{
                                placement: 'top',
                            }}
                            openDelay={0}
                            contentProps={{
                                fontSize: 'small',
                            }}
                        >
                            <Icon
                                as={TbHelp}
                                data-testid="balance-icon"
                                w={5}
                                h={5}
                            />
                        </Tooltip>

                        {needRebalance && (
                            <Tooltip
                                showArrow
                                content={rebalanceLabel}
                                positioning={{
                                    placement: 'top',
                                }}
                                openDelay={0}
                                contentProps={{
                                    fontSize: 'small',
                                }}
                            >
                                <Box
                                    _hover={{
                                        background: 'transparent',
                                        color: 'blue.400',
                                    }}
                                    onClick={onRebalance}
                                >
                                    <Icon
                                        as={RebalanceIcon}
                                        data-testid="rebalance-icon"
                                        w={6}
                                        h={6}
                                    />
                                </Box>
                            </Tooltip>
                        )}
                    </HStack>
                </BigNumberTextV2>
                <Box>
                    <Popover.Root
                        autoFocus={false}
                        positioning={{ placement: 'bottom' }}
                    >
                        <Popover.Trigger asChild>
                            <Button
                                variant="ghost"
                                bg="rgba(0, 0, 0, 0.1)"
                                rounded="full"
                                p={2}
                                h="auto"
                                w="auto"
                                minW="auto"
                            >
                                <Icon as={EyeIcon} w={4} h={4} />
                            </Button>
                        </Popover.Trigger>
                        <Portal>
                            <Popover.Positioner>
                                <Popover.Content
                                    border="1px solid"
                                    borderColor="inherit"
                                >
                                    <Popover.Body>
                                        <VStack align="stretch">
                                            <BigNumberTextV2
                                                unit="ctsi"
                                                value={stakingMaturing}
                                                componentStyle="popover"
                                                options={{
                                                    notation: 'compact',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2,
                                                }}
                                                countdown={{
                                                    timeLeft: maturingLeft,
                                                    timeLabel: 'Maturing in ',
                                                }}
                                            >
                                                <HStack justify="space-between">
                                                    <Text>
                                                        Maturing Balance
                                                    </Text>
                                                    <Tooltip
                                                        showArrow
                                                        content="Amount of pool tokens maturing at the Staking contract"
                                                        positioning={{
                                                            placement: 'top',
                                                        }}
                                                        openDelay={0}
                                                        contentProps={{
                                                            fontSize: 'small',
                                                        }}
                                                    >
                                                        <Icon
                                                            as={TbHelp}
                                                            w={5}
                                                            h={5}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </BigNumberTextV2>

                                            <Separator
                                                borderColor={bgDivider}
                                            />

                                            <BigNumberTextV2
                                                unit="ctsi"
                                                value={stakingReleasing}
                                                componentStyle="popover"
                                                options={{
                                                    notation: 'compact',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2,
                                                }}
                                                countdown={{
                                                    timeLeft: releasingLeft,
                                                    timeLabel: 'Releasing in ',
                                                }}
                                            >
                                                <HStack justify="space-between">
                                                    <Text>
                                                        Releasing Balance
                                                    </Text>
                                                    <Tooltip
                                                        showArrow
                                                        content="Amount of pool tokens being unstaken at the Staking contract"
                                                        positioning={{
                                                            placement: 'top',
                                                        }}
                                                        openDelay={0}
                                                        contentProps={{
                                                            fontSize: 'small',
                                                        }}
                                                    >
                                                        <Icon
                                                            as={TbHelp}
                                                            w={5}
                                                            h={5}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </BigNumberTextV2>

                                            <Separator
                                                borderColor={bgDivider}
                                            />

                                            <BigNumberTextV2
                                                unit="ctsi"
                                                value={stakingReleased}
                                                componentStyle="popover"
                                                options={{
                                                    notation: 'compact',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2,
                                                }}
                                            >
                                                <HStack justify="space-between">
                                                    <Text>
                                                        Released Balance
                                                    </Text>
                                                    <Tooltip
                                                        showArrow
                                                        content="Amount of pool tokens available for withdraw at the Staking contract"
                                                        positioning={{
                                                            placement: 'top',
                                                        }}
                                                        openDelay={0}
                                                        contentProps={{
                                                            fontSize: 'small',
                                                        }}
                                                    >
                                                        <Icon
                                                            as={TbHelp}
                                                            w={5}
                                                            h={5}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </BigNumberTextV2>
                                        </VStack>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover.Positioner>
                        </Portal>
                    </Popover.Root>
                </Box>
            </HStack>
        </VStack>
    );
};

export default EffectiveBalanceStat;
