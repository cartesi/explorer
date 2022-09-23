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
    Alert,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Text,
    Flex,
    Checkbox,
    VStack,
    Input,
    InputGroup,
    InputRightAddon,
    StackProps,
} from '@chakra-ui/react';
import { formatCTSI } from '../../utils/token';
import theme from '../../styles/theme';
import { useForm } from 'react-hook-form';
import { BigNumber, BigNumberish, constants, FixedNumber } from 'ethers';
import { isInfinite } from '../../utils/token';
import CTSIText from '../CTSIText';
import { parseUnits } from 'ethers/lib/utils';
import { useWallet } from '../../contexts/wallet';

interface StakeFormProps extends StackProps {
    allowance: BigNumber;
    releasing: BigNumber;
    totalStaked: BigNumber;
    disabled?: boolean;
    onApprove: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
}

const StakeForm: FC<StakeFormProps> = (props) => {
    const { account, chainId } = useWallet();

    const {
        allowance,
        releasing,
        totalStaked,
        disabled = false,
        onApprove,
        onStake,
        ...restProps
    } = props;
    const [infiniteApproval, setInfiniteApproval] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<{ stake: number }>({
        defaultValues: {
            stake: 0,
        },
    });

    const amount = watch('stake') || 0;

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        }
        if (isInfinite(value)) {
            return 'Value must be a finite number';
        }
        return true;
    };

    const doApproveOrStake = (amount: number) => {
        const bn = parseUnits(amount.toString(), 18);
        if (allowance.lt(fromWallet)) {
            if (infiniteApproval) {
                onApprove(constants.MaxUint256);
            } else {
                onApprove(fromWallet);
            }
        } else if (bn.gt(0)) {
            onStake(bn);
            reset({ stake: 0 });
        }
    };

    // convert to CTSI
    const amount_ = parseUnits(amount.toString(), 18);

    const percent = totalStaked.isZero()
        ? 0
        : FixedNumber.from(amount_)
              .divUnsafe(FixedNumber.from(totalStaked))
              .toUnsafeFloat();

    // amount from releasing used for staking, whole or whatever is there
    const fromReleasing = releasing.gte(amount_) ? amount_ : releasing;

    // part coming from wallet is the original amount minus the amount from releasing
    const fromWallet = amount_.sub(fromReleasing);

    return (
        <VStack align="flex-start" {...restProps}>
            <CTSIText value={allowance}>
                <Text>Allowance</Text>
            </CTSIText>

            <FormControl isInvalid={!!errors.stake}>
                <FormLabel>Amount to stake</FormLabel>

                <InputGroup>
                    <Input
                        type="number"
                        min={0}
                        isInvalid={!!errors.stake}
                        isDisabled={disabled}
                        {...register('stake', {
                            required: true,
                            valueAsNumber: true,
                            validate,
                        })}
                    />
                    <InputRightAddon children="CTSI" />
                </InputGroup>
                <FormErrorMessage>{errors.stake?.message}</FormErrorMessage>
            </FormControl>

            <Box>
                {fromReleasing.gt(0) && (
                    <Alert status="info">
                        <AlertIcon />
                        <Flex justify="space-between" width="100%">
                            <Text>
                                {formatCTSI(fromReleasing)}{' '}
                                <Text display="inline" fontSize="sm">
                                    CTSI
                                </Text>
                            </Text>

                            <Text>From "releasing"</Text>
                        </Flex>
                    </Alert>
                )}

                {fromWallet.gt(0) && (
                    <Alert status="info">
                        <AlertIcon />

                        <Flex justify="space-between" width="100%">
                            <Text>
                                {formatCTSI(fromWallet)}{' '}
                                <Text display="inline" fontSize="sm">
                                    CTSI
                                </Text>
                            </Text>

                            <Text>From "wallet"</Text>
                        </Flex>
                    </Alert>
                )}
                {allowance.lt(fromWallet) && (
                    <Alert status="warning">
                        <AlertIcon />
                        <Text>
                            Maximum staking limit exceeded! Please approve more
                            allowance to stake.
                        </Text>
                    </Alert>
                )}
            </Box>

            <Button
                width="full"
                isDisabled={disabled || allowance.gte(fromWallet)}
                onClick={handleSubmit((data) => doApproveOrStake(data.stake))}
            >
                Approve
            </Button>

            <Button
                width="full"
                isDisabled={
                    disabled || allowance.lt(fromWallet) || amount_.isZero()
                }
                onClick={handleSubmit((data) => doApproveOrStake(data.stake))}
            >
                Stake
            </Button>

            {fromWallet.gt(0) ? (
                <>
                    <Text fontSize="sm" color="red.500" align="center">
                        The maturing status will restart counting.
                    </Text>

                    {amount > 0 && (
                        <Alert status="info">
                            <AlertIcon />

                            <Text>
                                This stake currently corresponds to a{' '}
                                {(percent * 100).toFixed(4)} % chance of
                                producing the current block (
                                <a
                                    href="https://github.com/cartesi/noether/wiki/FAQ#whats-the-minimum-amount-of-ctsi-to-stake"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Learn more
                                </a>
                                )
                            </Text>
                        </Alert>
                    )}
                </>
            ) : (
                <Flex justify="center">
                    <Checkbox
                        colorScheme="green"
                        borderColor={
                            infiniteApproval
                                ? theme.colors.primary
                                : theme.colors.gray3
                        }
                        isDisabled={!infiniteApproval}
                        onChange={(e) => setInfiniteApproval(e.target.checked)}
                    >
                        Infinite Approval
                    </Checkbox>
                </Flex>
            )}
        </VStack>
    );
};

export default StakeForm;
