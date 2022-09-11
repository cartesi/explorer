import React, { FC } from 'react';
import { Icon } from '@chakra-ui/icons';
import { HStack, Text, Tooltip, Stack } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { Summary } from '../../../graphql/models';
import { StakedBalanceIcon, PoolsTimer, StakePlus } from '../../Icons';
import BigNumberText from '../../BigNumberText';
import CTSIText from '../../CTSIText';
import StakeCard from '../StakeCard';

interface PoolsOverviewProps {
    balance: BigNumber;
    summary: Summary;
    poolBalancesCount: number;
}

const PoolsOverview: FC<PoolsOverviewProps> = ({
    balance,
    summary,
    poolBalancesCount,
}) => (
    <Stack
        direction={['column', 'column', 'row', 'row']}
        justify="space-evenly"
        w="100%"
        p={[5, 5, 10, 10]}
        px={['6vw', '6vw', '12vw', '12vw']}
        spacing={6}
    >
        <StakeCard
            Icon={<StakedBalanceIcon w={8} h={8} />}
            Title={
                <HStack>
                    <Text mr={2}># Pools</Text>
                    <Tooltip label="Total number of pools" placement="top">
                        <Icon w={2.5} h={2.5} />
                    </Tooltip>
                </HStack>
            }
        >
            <BigNumberText value={summary?.totalPools} />
        </StakeCard>

        <StakeCard
            Icon={<PoolsTimer w={7} h={7} />}
            Title={
                <HStack>
                    <Text mr={2}>My Pools</Text>
                    <Tooltip
                        label="Number of pools user staked"
                        placement="top"
                    >
                        <Icon w={2.5} h={2.5} />
                    </Tooltip>
                </HStack>
            }
        >
            <BigNumberText value={poolBalancesCount} />
        </StakeCard>

        <StakeCard
            Icon={<StakePlus w={8} h={8} />}
            Title={
                <HStack>
                    <Text mr={2}>My Stake</Text>
                    <Tooltip label="Total user stake in pools" placement="top">
                        <Icon w={2.5} h={2.5} />
                    </Tooltip>
                </HStack>
            }
        >
            <CTSIText
                value={balance}
                options={{
                    notation: 'compact',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }}
            />
        </StakeCard>
    </Stack>
);

export default PoolsOverview;
