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
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Switch,
    Text,
    Tooltip,
    VStack,
} from '@chakra-ui/react';
import { FaBalanceScaleLeft } from 'react-icons/fa';
import { useWallet } from '../../contexts/wallet';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';
import CTSIText from '../CTSIText';
import { useRouter } from 'next/router';
import { useStakingPool } from '../../services/pool';
import { useForm } from 'react-hook-form';

export const PoolSetting: FC = () => {
    const { account } = useWallet();
    const poolBalance = useTotalPoolBalance(account);
    const router = useRouter();
    const poolAddress = router.query.node as string;
    const pool = useStakingPool(poolAddress, account);
    const {
        register,
        trigger,
        getValues,
        formState: { errors, touchedFields },
    } = useForm<{ ensName: string }>({
        defaultValues: {
            ensName: '',
        },
    });

    const validate = (value: string) => {
        if (value === '') {
            return true;
        }

        if (
            !/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?/.test(
                value
            )
        ) {
            return 'Enter a valid ENS name';
        }

        return true;
    };

    const {
        ref,
        name,
        onChange: onChangeValidate,
    } = register('ensName', {
        shouldUnregister: true,
        validate,
    });

    const onTogglePool = () => {
        const tType = pool.paused ? 'unpause' : 'pause';

        pool[tType]();
    };

    return (
        <Box
            px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
            pb={{ base: 6, sm: 8, lg: 8 }}
            fontSize={'xl'}
        >
            <Stack
                spacing={4}
                justifyContent="space-between"
                alignContent="flex-start"
                mt={16}
                mb={10}
                direction={{ base: 'column', md: 'row' }}
            >
                <Box>
                    <Heading as="h2" mb={0}>
                        Pool Setting
                    </Heading>
                    <Text fontSize="sm">
                        All actions approved by wallet transaction.
                    </Text>
                </Box>

                <Box>
                    <VStack>
                        <Button
                            bgColor={'orange.100'}
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                            leftIcon={<FaBalanceScaleLeft />}
                        >
                            REBALANCE
                        </Button>

                        <Flex
                            fontSize={'sm'}
                            alignSelf="flex-end"
                            align="center"
                        >
                            <Flex align="end" mr={2}>
                                <Text mr={1} lineHeight={1}>
                                    Pool balance:
                                </Text>
                                <CTSIText
                                    value={poolBalance}
                                    fontSize="1x1"
                                    lineHeight={1}
                                />
                            </Flex>

                            <Tooltip
                                placement="bottom"
                                label="Total amount of tokens staked in this pool"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    width={3}
                                    height={3}
                                    color="gray.600"
                                    role="balance-icon"
                                />
                            </Tooltip>
                        </Flex>
                    </VStack>
                </Box>
            </Stack>

            <Stack
                justifySelf="flex-end"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <FormControl>
                    <HStack justify="space-between">
                        <FormLabel>
                            Pool commission{' '}
                            <Tooltip
                                placement="bottom"
                                label="Choose the commission fee for your pool"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                    role="commission-icon"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <Stack direction={['column', 'row']}>
                        <InputGroup me={6}>
                            <Input size="lg" />
                            <InputRightElement
                                color="gray.300"
                                size="lg"
                                pointerEvents="none"
                                w={14}
                                h="100%"
                                children={<Box>%</Box>}
                            />
                        </InputGroup>
                        <Button
                            colorScheme="blue"
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                        >
                            UPDATE
                        </Button>
                    </Stack>
                </FormControl>

                <FormControl isInvalid={!!errors.ensName}>
                    <HStack justify="space-between">
                        <FormLabel>
                            Pool ENS name{' '}
                            <Tooltip
                                placement="bottom"
                                label="Enter a registered ENS domain name"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                    role="pool-icon"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <Stack direction={['column', 'row']}>
                        <InputGroup me={6}>
                            <Input
                                size="lg"
                                ref={ref}
                                name={name}
                                isInvalid={!!errors.ensName}
                                onBlur={() => trigger('ensName')}
                                onChange={(event) => {
                                    onChangeValidate(event);
                                    trigger('ensName');
                                }}
                            />
                        </InputGroup>
                        <Button
                            colorScheme="blue"
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                            isDisabled={
                                getValues('ensName') === '' ||
                                !!touchedFields.ensName ||
                                !!errors.ensName
                            }
                        >
                            UPDATE
                        </Button>
                    </Stack>

                    {!errors.ensName ? (
                        <FormHelperText>
                            After registering an ENS domain and setting it up,
                            set the name here.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>
                            {errors.ensName?.message}
                        </FormErrorMessage>
                    )}
                </FormControl>

                <FormControl>
                    <HStack mt={4} justify="space-between">
                        <FormLabel>
                            Staking{' '}
                            <Tooltip
                                placement="bottom"
                                label="SAMPLE TEXT"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                    role="staking-icon"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <HStack>
                        <InputGroup me={6}>
                            <Switch
                                size="lg"
                                me={3}
                                defaultChecked
                                isChecked={!pool.paused}
                                onChange={onTogglePool}
                            />

                            <FormLabel htmlFor="isChecked">
                                Open your pool to accept new stakes
                            </FormLabel>
                        </InputGroup>
                    </HStack>
                </FormControl>
            </Stack>

            <Box mt={10}>
                <Divider />
                <HStack mt={4} justify="space-between">
                    <FormLabel>
                        Decide to quit{' '}
                        <Tooltip
                            placement="bottom"
                            label="SAMPLE TEXT"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon
                                pb={1}
                                width={4}
                                height={4}
                                color="gray.600"
                                role="quit-icon"
                            />
                        </Tooltip>
                    </FormLabel>
                </HStack>
                <FormLabel>
                    If you would like to close the pool. Please,{' '}
                    <Link href="mailto:hello@cartesi.io" color="blue.400">
                        contact us
                    </Link>{' '}
                    and we will be glad to help you.
                </FormLabel>
            </Box>
        </Box>
    );
};

export default PoolSetting;
