// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { HStack, Icon, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import labels from '../../utils/labels';
import CTSIText from '../CTSIText';

interface TotalBalancesProps extends StackProps {
    totalReward: BigNumber;
    totalBalance: BigNumber;
}

export const TotalBalances: FC<TotalBalancesProps> = (props) => {
    const { totalReward, totalBalance, ...flexProps } = props;

    return (
        <HStack {...flexProps}>
            <CTSIText value={totalReward}>
                <HStack>
                    <Text>Total Rewards</Text>
                    <Tooltip label={labels.totalRewards} placement="top">
                        <Icon />
                    </Tooltip>
                </HStack>
            </CTSIText>
            <CTSIText value={totalBalance}>
                <HStack>
                    <Text>In-contract Balance</Text>
                    <Tooltip label={labels.inContractBalance} placement="top">
                        <Icon />
                    </Tooltip>
                </HStack>
            </CTSIText>
        </HStack>
    );
};

export default TotalBalances;
