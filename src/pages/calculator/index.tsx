// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect } from 'react';
import Head from 'next/head';
import {
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputRightAddon,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
    Tooltip,
    VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { BiCube } from 'react-icons/bi';

import Layout from '../../components/Layout';
import { useMarketInformation } from '../../services/market';
import useBlocks from '../../graphql/hooks/useBlocks';
import useSummary from '../../graphql/hooks/useSummary';
import { getEstimatedRewardRate } from '../../utils/reward';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import PageHeader from '../../components/PageHeader';
import CTSIText from '../../components/CTSIText';
import BigNumberText from '../../components/BigNumberText';
import labels from '../../utils/labels';

interface FormData {
    stake: number; // user statke
    period: number; // investment period
    totalStaked: number; // total staked simulation
}

const Calculator = () => {
    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            stake: 100000,
            period: 365, // one year
            totalStaked: 0,
        },
    });

    // get summary from thegraph (total staked)
    const summary = useSummary();

    // controlled variables
    const stake_ = watch('stake');
    const stake = parseUnits(stake_.toString(), 18);
    const period = watch('period');
    const totalStaked = watch('totalStaked');

    // get market information (we need circulation supply)
    const { marketInformation } = useMarketInformation();

    // get latest block
    const { data } = useBlocks(10);
    const blocks = data?.blocks || [];

    // do all the math
    const { reward, apr, activeStake } = getEstimatedRewardRate(
        blocks,
        stake,
        totalStaked,
        period
    );

    useEffect(() => {
        if (summary?.totalStaked) {
            setValue(
                'totalStaked',
                parseFloat(formatUnits(summary.totalStaked, 18))
            );
        }
    }, [summary]);

    // assumes block reward is constant, and get value from latest block
    const currentReward = blocks[0]?.reward;

    // formatter for big numbers
    const numberFormat = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });

    return (
        <Layout>
            <Head>
                <title>Staking Calculator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader title="Staking Calculator" />

            <VStack p="20px 6vw" align="stretch" spacing={5}>
                <StakingDisclaimer persistanceKey="calculator" />
                <FormControl id="stake">
                    <FormLabel>Amount to stake</FormLabel>
                    <InputGroup size="lg">
                        <Input
                            type="number"
                            maxW={200}
                            min={0}
                            isInvalid={!!errors.stake}
                            {...register('stake', {
                                required: true,
                                valueAsNumber: true,
                            })}
                        />
                        <InputRightAddon children="CTSI" />
                    </InputGroup>
                    <FormHelperText>
                        Amount of CTSI tokens to stake.
                    </FormHelperText>
                </FormControl>

                <FormControl id="period">
                    <FormLabel>Staking period</FormLabel>
                    <InputGroup size="lg">
                        <Input
                            type="number"
                            maxW={200}
                            min={1}
                            isInvalid={!!errors.stake}
                            {...register('period', {
                                required: true,
                                valueAsNumber: true,
                            })}
                        />
                        <InputRightAddon children="days" />
                    </InputGroup>
                    <FormHelperText>
                        Amount of days you will keep your stake.
                    </FormHelperText>
                </FormControl>

                <HStack justify="space-evenly">
                    <CTSIText value={currentReward}>
                        <Text>Current Block Reward</Text>
                    </CTSIText>
                    <CTSIText
                        value={summary?.totalStaked}
                        options={{
                            notation: 'compact',
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        }}
                    >
                        <Text>Total Staked</Text>
                    </CTSIText>
                    <CTSIText
                        value={activeStake}
                        options={{
                            notation: 'compact',
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        }}
                    >
                        <HStack>
                            <Text>Effective Total Stake</Text>
                            <Tooltip label={labels.effectiveTotalStake}>
                                <Icon />
                            </Tooltip>
                        </HStack>
                    </CTSIText>
                </HStack>

                <FormControl id="totalStaked">
                    <FormLabel>Total Staked</FormLabel>
                    <InputGroup size="lg">
                        <Input
                            type="number"
                            maxW={200}
                            min={0}
                            isInvalid={!!errors.stake}
                            {...register('totalStaked', {
                                required: true,
                                valueAsNumber: true,
                            })}
                        />
                        <InputRightAddon children="CTSI" />
                    </InputGroup>
                    <FormHelperText>
                        Total amount of CTSI tokens staked.
                    </FormHelperText>
                </FormControl>
                <VStack w="100%" spacing={0}>
                    <HStack justify="space-between" w="100%">
                        <Text fontSize="sm">{numberFormat.format(0)} CTSI</Text>
                        <Text fontSize="sm">
                            {numberFormat.format(totalStaked)} CTSI
                        </Text>
                        <Text fontSize="sm">
                            {numberFormat.format(
                                marketInformation.circulatingSupply
                            )}{' '}
                            CTSI
                        </Text>
                    </HStack>
                    <Slider
                        aria-label="totalStaked"
                        defaultValue={totalStaked}
                        value={totalStaked}
                        max={marketInformation.circulatingSupply}
                        onChange={(value) => setValue('totalStaked', value)}
                    >
                        <SliderTrack h={4}>
                            <SliderFilledTrack bg="black" />
                        </SliderTrack>
                        <SliderThumb boxSize={8}>
                            <BiCube />
                        </SliderThumb>
                    </Slider>
                </VStack>
                <HStack justify="space-evenly">
                    <CTSIText
                        value={reward}
                        bg="black"
                        color="white"
                        p={50}
                        options={{
                            notation: 'compact',
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        }}
                    >
                        <Text>Projected Period Reward</Text>
                    </CTSIText>
                    <BigNumberText
                        value={apr.toUnsafeFloat()}
                        bg="black"
                        color="white"
                        p={50}
                        unit="percent"
                    >
                        <HStack>
                            <Text>Projected Annual Earnings</Text>
                            <Tooltip label={labels.projectedAnnualEarnings}>
                                <Icon />
                            </Tooltip>
                        </HStack>
                    </BigNumberText>
                </HStack>
            </VStack>
        </Layout>
    );
};

export default Calculator;
