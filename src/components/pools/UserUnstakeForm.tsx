// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Radio,
    RadioGroup,
    Tooltip,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { BigNumberish } from 'ethers';
import { toBigNumber } from '../../utils/token';

export interface UserUnstakeFormProps {
    onUnstake: (amount?: BigNumberish) => void;
    onCancel: () => void;
}

type FormData = {
    amount: number;
};

const UserUnstakeForm: FC<UserUnstakeFormProps> = (props) => {
    const { onUnstake, onCancel } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    // two modes of unstake, full or partial
    // full is all shares, partial is tokens, converted to shares before calling the contract
    const [mode, setMode] = useState<'full' | 'partial'>();

    return (
        <HStack>
            <RadioGroup
                onChange={(value) => setMode(value as 'full' | 'partial')}
                value={mode}
            >
                <HStack>
                    <Radio value="full">Full</Radio>
                    <Radio value="partial">Partial</Radio>
                </HStack>
            </RadioGroup>
            {mode == 'partial' && (
                <FormControl isInvalid={!!errors.amount}>
                    <InputGroup>
                        <Input
                            placeholder="Tokens to unstake"
                            {...register('amount', {
                                required: true,
                                valueAsNumber: true,
                            })}
                        />
                        <InputRightAddon children="CTSI" />
                    </InputGroup>
                    <FormErrorMessage>
                        {errors.amount?.message}
                    </FormErrorMessage>
                </FormControl>
            )}
            {!!mode && (
                <Button
                    size="md"
                    px={8}
                    leftIcon={<CheckIcon />}
                    onClick={handleSubmit((data) =>
                        onUnstake(
                            mode == 'partial'
                                ? toBigNumber(data.amount)
                                : undefined
                        )
                    )}
                >
                    Unstake
                </Button>
            )}
            <Tooltip label="Cancel" placement="top">
                <IconButton
                    icon={<CloseIcon />}
                    aria-label="Cancel"
                    size="md"
                    onClick={onCancel}
                />
            </Tooltip>
        </HStack>
    );
};

export default UserUnstakeForm;
