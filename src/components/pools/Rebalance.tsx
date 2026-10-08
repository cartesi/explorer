// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { HStack, IconButton, StackProps, Text } from '@chakra-ui/react';
import { TbScale } from 'react-icons/tb';
import { formatCTSI } from '../../utils/token';

export interface RebalanceProps extends StackProps {
    stake: bigint;
    unstake: bigint;
    withdraw: bigint;
    onRebalance: () => void;
}

const Rebalance: FC<RebalanceProps> = (props) => {
    const { stake, unstake, withdraw, onRebalance, ...stackProps } = props;
    const disabled = stake === 0n && unstake === 0n && withdraw === 0n;
    return (
        <HStack {...stackProps}>
            <IconButton
                aria-label="Rebalance"
                data-testid="rebalance-button"
                h={10}
                w={10}
                disabled={disabled}
                onClick={onRebalance}
            >
                <TbScale />
            </IconButton>

            {stake > 0n && <Text>{formatCTSI(stake)} CTSI to stake</Text>}
            {unstake > 0n && <Text>{formatCTSI(unstake)} CTSI to unstake</Text>}
            {withdraw > 0n && (
                <Text>{formatCTSI(withdraw)} CTSI to withdraw</Text>
            )}
            {disabled && <Text>No need to rebalance</Text>}
        </HStack>
    );
};

export default Rebalance;
