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
    Radio,
    RadioGroup,
    VStack,
} from '@chakra-ui/react';
import { BigNumberInput } from 'big-number-input';
import { BigNumber } from 'ethers';

export interface UnstakeFormProps {
    shares: BigNumber; // user total shares
    amount: BigNumber; // user total shares converted to tokens
    onUnstake: (amount?: BigNumber) => void; // callback to unstake, pass tokens, not shares
}

const UnstakeForm: FC<UnstakeFormProps> = ({ shares, amount, onUnstake }) => {
    // two modes of unstake, full or partial
    // full is all shares, partial is tokens, converted to shares before calling the contract
    const [mode, setMode] = useState<'full' | 'partial'>();

    // amount in case of partial
    const [unstake, setUnstake] = useState<string>('0');

    // unstake button is disabled if user has no shares or if input amount is more than what he has
    const canUnstake =
        mode == 'full'
            ? shares.gt(0)
            : mode == 'partial'
            ? BigNumber.from(unstake).gt(0) &&
              BigNumber.from(unstake).lte(amount)
            : false;

    return (
        <VStack align="stretch" spacing={5}>
            <RadioGroup
                w="100%"
                onChange={(value) => setMode(value as 'full' | 'partial')}
                value={mode}
            >
                <VStack align="stretch">
                    <Radio value="full">Full amount</Radio>
                    <Radio value="partial">Partial amount</Radio>
                </VStack>
            </RadioGroup>
            {mode == 'partial' && (
                <FormControl id="stake">
                    <FormLabel>Amount to unstake</FormLabel>
                    <InputGroup>
                        <BigNumberInput
                            decimals={18}
                            onChange={setUnstake}
                            value={unstake}
                            renderInput={(props) => (
                                <Input onChange={props.onChange} />
                            )}
                        />
                        <InputRightAddon children="CTSI" />
                    </InputGroup>
                    <FormHelperText>
                        Amount of CTSI tokens to unstake
                    </FormHelperText>
                </FormControl>
            )}
            <Button
                disabled={!canUnstake}
                onClick={() =>
                    onUnstake(
                        mode == 'partial' ? BigNumber.from(unstake) : undefined
                    )
                }
            >
                Unstake
            </Button>
        </VStack>
    );
};

export default UnstakeForm;
