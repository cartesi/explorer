import { HStack, Stack, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { Summary } from '../../../graphql/models';
import Banner from '../../Banner';
import CTSIText, { BigNumberText } from '../../CTSIText';
import { MyPoolsIcon, MyStakeIcon, PoolsIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';
import { FaRegQuestionCircle } from 'react-icons/fa';
import theme from '../../../styles/theme';

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
            gap={6}
        >
            <Banner
                Icon={
                    <PoolsIcon
                        color={theme.tokens.getVar(`colors.${iconColor}`)}
                        style={{ width: '2rem', height: '2rem' }}
                    />
                }
                Title={
                    <HStack>
                        <Text mr={1}># Pools</Text>
                        <Tooltip
                            showArrow
                            content="Total number of pools"
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <FaRegQuestionCircle />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={summary?.totalPools} />
            </Banner>

            <Banner
                Icon={
                    <MyPoolsIcon
                        color={theme.tokens.getVar(`colors.${iconColor}`)}
                        style={{ width: '2rem', height: '2rem' }}
                    />
                }
                Title={
                    <HStack>
                        <Text mr={1}>My Pools</Text>
                        <Tooltip
                            showArrow
                            content="Number of pools user staked"
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <FaRegQuestionCircle />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={poolBalancesCount} />
            </Banner>

            <Banner
                Icon={
                    <MyStakeIcon
                        color={theme.tokens.getVar(`colors.${iconColor}`)}
                        style={{ width: '2rem', height: '2rem' }}
                    />
                }
                Title={
                    <HStack>
                        <Text mr={1}>My Stake</Text>
                        <Tooltip
                            showArrow
                            content="Total user stake in pools"
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <FaRegQuestionCircle />
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
