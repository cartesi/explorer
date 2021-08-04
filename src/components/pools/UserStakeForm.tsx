// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
    Button,
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Tooltip,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { BigNumber, BigNumberish } from 'ethers';
import { formatCTSI, toBigNumber } from '../../utils/token';

export interface UserStakeFormProps {
    allowance: BigNumber;
    onApprove: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
    onCancel: () => void;
}

type FormData = {
    amount: number;
};

const UserStakeForm: FC<UserStakeFormProps> = (props) => {
    const { allowance, onApprove, onCancel, onStake } = props;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const { amount } = watch();

    return (
        <HStack>
            <FormControl isInvalid={!!errors.amount}>
                <InputGroup>
                    <Input
                        placeholder={formatCTSI(allowance)}
                        {...register('amount', {
                            required: true,
                            valueAsNumber: true,
                        })}
                    />
                    <InputRightAddon children="CTSI" />
                </InputGroup>
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
            {amount && toBigNumber(amount).gt(allowance) && (
                <Button
                    size="md"
                    px={8}
                    leftIcon={<CheckIcon />}
                    onClick={handleSubmit((data) =>
                        onApprove(toBigNumber(data.amount))
                    )}
                >
                    Approve
                </Button>
            )}
            {amount && toBigNumber(amount).lte(allowance) && (
                <Button
                    size="md"
                    px={8}
                    leftIcon={<CheckIcon />}
                    onClick={handleSubmit((data) =>
                        onStake(toBigNumber(data.amount))
                    )}
                >
                    Stake
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

export default UserStakeForm;
