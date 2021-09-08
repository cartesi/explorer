// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import BigNumberText from '../BigNumberText';
import AddressText from '../AddressText';
import { FaCoins, FaNetworkWired } from 'react-icons/fa';

type OwnedNodeProps = {
    account: string; // metamask account (or pool address)
    chainId: number;
    user: string; // node user
    nodeBalance: BigNumber; // node balance
    userBalance: BigNumber; // user balance
    authorized: boolean;
    onTransfer: (amount: BigNumberish) => void;
    onAuthorize?: () => void;
    onRetire: () => void;
};

const OwnedNode: FC<OwnedNodeProps> = ({
    account,
    chainId,
    user,
    nodeBalance,
    userBalance,
    authorized,
    onTransfer,
    onAuthorize,
    onRetire,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ deposit: number }>();

    const toBigNumber = (value: number, decimals = 18) =>
        ethers.utils.parseUnits(value.toString(), decimals);

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        } else if (toBigNumber(value).gt(userBalance)) {
            return 'Insufficient ETH balance';
        }
        return true;
    };

    const mine = account.toLowerCase() === user.toLowerCase();

    return (
        <VStack align="stretch">
            <Stack
                spacing={[4, 4, 4, 8]}
                direction={['column', 'column', 'column', 'row']}
                align={[undefined, undefined, undefined, 'center']}
            >
                <AddressText
                    address={user}
                    chainId={chainId}
                    icon={FaNetworkWired}
                >
                    <Text>Node Owner</Text>
                </AddressText>
                {mine && (
                    <BigNumberText
                        value={userBalance}
                        unit="eth"
                        icon={FaCoins}
                        color={errors.deposit ? 'red' : undefined}
                    >
                        <Text>Your Balance</Text>
                    </BigNumberText>
                )}
                <BigNumberText value={nodeBalance} unit="eth" icon={FaCoins}>
                    <Text>Node Balance</Text>
                </BigNumberText>
                {mine && (
                    <>
                        <FormControl isInvalid={!!errors.deposit} w={200}>
                            <FormLabel>Deposit</FormLabel>
                            <InputGroup>
                                <Input
                                    {...register('deposit', {
                                        required: true,
                                        valueAsNumber: true,
                                        validate: validate,
                                    })}
                                />
                                <InputRightAddon children="ETH" />
                            </InputGroup>
                            <FormHelperText>
                                Amount of ETH to transfer to node
                            </FormHelperText>
                            <FormErrorMessage>
                                {errors.deposit?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </>
                )}
            </Stack>
            <HStack>
                {mine && (
                    <>
                        <Button
                            colorScheme="blue"
                            isFullWidth
                            onClick={handleSubmit((data) =>
                                onTransfer(toBigNumber(data.deposit))
                            )}
                        >
                            Deposit
                        </Button>
                        {!authorized && (
                            <Button
                                colorScheme="blue"
                                onClick={onAuthorize}
                                isFullWidth
                            >
                                Authorize
                            </Button>
                        )}
                        <Button
                            onClick={onRetire}
                            colorScheme="red"
                            isFullWidth
                        >
                            Retire
                        </Button>
                    </>
                )}
            </HStack>
        </VStack>
    );
};

export default OwnedNode;
