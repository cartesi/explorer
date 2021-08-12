// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { HStack, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { FaWallet } from 'react-icons/fa';
import CTSI from './CTSI';
import Title from './Title';

export interface WalletProps {
    balance: BigNumber;
    futureBalance?: BigNumber;
}

const Wallet: FC<WalletProps> = ({ balance, futureBalance }) => {
    const modified = futureBalance && !futureBalance.eq(balance);
    return (
        <HStack justify="space-between">
            <Title
                title="Wallet"
                icon={<FaWallet />}
                help="Amount of tokens in your wallet"
            />
            <HStack align="baseline">
                {modified && <CTSI value={futureBalance} />}
                <CTSI
                    value={balance}
                    color={modified ? 'red' : undefined}
                    textDecoration={modified ? 'line-through' : undefined}
                />
                <Text fontSize="small">CTSI</Text>
                <HStack minW={100}></HStack>
            </HStack>
        </HStack>
    );
};

export default Wallet;
