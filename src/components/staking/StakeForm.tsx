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
    BoxProps,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
    Flex,
    Checkbox,
} from '@chakra-ui/react';
import { formatCTSI } from '../../utils/token';
import theme from '../../styles/theme';
import { useForm } from 'react-hook-form';
import { BigNumber, BigNumberish, constants } from 'ethers';
import { isInfinite } from '../../utils/token';
import CTSIText from '../CTSIText';
import { parseUnits } from 'ethers/lib/utils';

interface StakeFormProps extends BoxProps {
    allowance: BigNumber;
    releasing: BigNumber;
    totalStaked: BigNumber;
    disabled?: boolean;
    onApprove: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
}

const StakeForm: FC<StakeFormProps> = (props) => {
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

    // amount from releasing used for staking, whole or whatever is there
    const fromReleasing = releasing.gte(amount_) ? amount_ : releasing;

    // part coming from wallet is the original amount minus the amount from releasing
    const fromWallet = amount_.sub(fromReleasing);

    return (
        <Box {...restProps}>
            <CTSIText value={allowance}>
                <Text>Allowance</Text>
            </CTSIText>

            <FormControl isInvalid={!!errors.stake} mt={4}>
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
                    <Alert status="info" mt={2}>
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
                    <Alert status="info" mt={2}>
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
                    <Alert status="warning" mt={2}>
                        <AlertIcon />
                        <Text>
                            Maximum staking limit exceeded! Please approve more
                            allowance to stake.
                        </Text>
                    </Alert>
                )}
            </Box>

            <Button
                size="sm"
                mt={2}
                py={4}
                height="auto"
                borderRadius={2}
                color="white"
                bg={disabled ? theme.colors.gray9 : theme.colors.secondary}
                _hover={{
                    filter: 'opacity(90%)',
                }}
                isFullWidth
                isDisabled={disabled || allowance.gte(fromWallet)}
                onClick={handleSubmit((data) => doApproveOrStake(data.stake))}
            >
                Approve
            </Button>

            <Button
                size="sm"
                mt={2}
                py={4}
                height="auto"
                borderRadius={2}
                color="white"
                bg={disabled ? theme.colors.gray9 : theme.colors.secondary}
                _hover={{
                    filter: 'opacity(90%)',
                }}
                isFullWidth
                isDisabled={
                    disabled || allowance.lt(fromWallet) || amount_.isZero()
                }
                onClick={handleSubmit((data) => doApproveOrStake(data.stake))}
            >
                Stake
            </Button>

            {fromWallet.gt(0) ? (
                <>
                    <Text fontSize="12px" color="red.500" align="center" mt={4}>
                        The maturing status will restart counting.
                    </Text>

                    {amount > 0 && (
                        <Alert status="info" mt={2}>
                            <AlertIcon />

                            <Text>
                                This stake currently corresponds to a{' '}
                                {amount_
                                    .mul(100)
                                    .div(totalStaked)
                                    .toNumber()
                                    .toFixed(2)}{' '}
                                % chance of producing the current block (
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
                <Flex justify="center" mt={3}>
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
        </Box>
    );
};

export default StakeForm;
