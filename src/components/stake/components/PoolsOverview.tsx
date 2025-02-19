import { Icon } from '@chakra-ui/icons';
import {
    HStack,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { Summary } from '../../../graphql/models';
import Banner from '../../Banner';
import CTSIText, { BigNumberText } from '../../CTSIText';
import { MyPoolsIcon, MyStakeIcon, PoolsIcon } from '../../Icons';
export interface PoolsOverviewProps {
    balance: BigNumber;
    summary: Summary;
    poolBalancesCount: number;
}

const PoolsOverview: FC<PoolsOverviewProps> = ({
    balance,
    summary,
    poolBalancesCount,
}) => {
    const iconColor = useColorModeValue('light.primary', 'dark.primary');

    return (
        <Stack
            direction={['column', 'column', 'row', 'row']}
            justify="space-evenly"
            w="100%"
            p={[5, 5, 10, 10]}
            px={['6vw', '6vw', '12vw', '12vw']}
            spacing={6}
        >
            <Banner
                Icon={<PoolsIcon color={iconColor} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text mr={1}># Pools</Text>
                        <Tooltip label="Total number of pools" placement="top">
                            <Icon
                                data-testid="pools-overview-total-tooltip"
                                w={4}
                                h={4}
                            />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={summary?.totalPools} />
            </Banner>

            <Banner
                Icon={<MyPoolsIcon color={iconColor} w={7} h={7} />}
                Title={
                    <HStack>
                        <Text mr={1}>My Pools</Text>
                        <Tooltip
                            label="Number of pools user staked"
                            placement="top"
                        >
                            <Icon
                                data-testid="pools-overview-balances-tooltip"
                                w={4}
                                h={4}
                            />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={poolBalancesCount} />
            </Banner>

            <Banner
                Icon={<MyStakeIcon color={iconColor} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text mr={1}>My Stake</Text>
                        <Tooltip
                            label="Total user stake in pools"
                            placement="top"
                        >
                            <Icon
                                data-testid="pools-overview-stake-tooltip"
                                w={4}
                                h={4}
                            />
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
            </Banner>
        </Stack>
    );
};

export default PoolsOverview;
