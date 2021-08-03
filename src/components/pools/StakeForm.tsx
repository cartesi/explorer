// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
    VStack,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { BigNumberInput } from 'big-number-input';
import CTSIText from '../CTSIText';

export interface StakeFormProps {
    allowance: BigNumber;
    paused: boolean;
    onApprove: (amount: BigNumber) => void;
    onStake: (amount: BigNumber) => void;
}

const StakeForm: FC<StakeFormProps> = (props) => {
    const { allowance, paused, onApprove, onStake } = props;
    const [amount, setAmount] = useState<string>();
    return (
        <VStack align="stretch" spacing={5}>
            <CTSIText value={allowance}>
                <Text>Allowance</Text>
            </CTSIText>
            <FormControl id="stake">
                <FormLabel>Amount to stake</FormLabel>
                <InputGroup>
                    <BigNumberInput
                        decimals={18}
                        onChange={setAmount}
                        value={amount}
                        renderInput={(props) => (
                            <Input onChange={props.onChange} />
                        )}
                    />
                    <InputRightAddon children="CTSI" />
                </InputGroup>
                <FormHelperText>Amount of CTSI tokens to stake</FormHelperText>
            </FormControl>
            <VStack align="stretch">
                <Button
                    disabled={!amount || BigNumber.from(amount).lte(allowance)}
                    onClick={() => onApprove(BigNumber.from(amount))}
                >
                    Approve
                </Button>
                <Button
                    disabled={
                        paused ||
                        !amount ||
                        BigNumber.from(amount).gt(allowance)
                    }
                    onClick={() => onStake(BigNumber.from(amount))}
                >
                    Stake
                </Button>
            </VStack>
        </VStack>
    );
};

export default StakeForm;
