// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

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
    Link,
    Stack,
    Switch,
    Text,
    Tooltip,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { Notification } from '@explorer/ui';
import { useWallet } from '@explorer/wallet';
import { useFlag } from '@unleash/proxy-client-react';
import { BigNumber } from 'ethers';
import { allPass, equals, pipe, size } from 'lodash/fp';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { FaBalanceScaleLeft } from 'react-icons/fa';
import FlatRateContainer from '../../containers/stake/FlatRateContainer';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import { useStakingPool } from '../../services/pool';
import { useStakingPoolFactory } from '../../services/poolFactory';
import { getMessages } from '../../utils/messages';
import { validateEns } from '../../utils/validation';
import CTSIText from '../CTSIText';
import TransactionBanner from '../TransactionBanner';

const wordingFor = {
    pause: {
        title: 'Pausing new stakes...',
        failTitle: 'Pausing new stakes setup failed!',
        successDescription: 'The pool will no longer accept new stakes.',
    },
    unpause: {
        title: 'Accepting new stakes...',
        failTitle: 'Accepting new stakes setup failed!',
        successDescription: 'The pool is now accepting new stakes.',
    },
    rebalance: {
        title: 'Rebalancing pool...',
        failTitle: 'Rebalancing the pool failed',
        successDescription: 'Pool rebalanced successfully!',
    },
    changeEns: {
        title: 'Changing ENS name...',
        failTitle: 'Changing ENS name failed',
        successDescription: 'ENS name changed successfully!',
    },
    commission: {
        title: 'Updating pool commission...',
        failTitle: 'Updating pool commission failed',
        successDescription: 'Pool commission updated successfully!',
    },
    update: {
        title: getMessages('pool.update.v2.update'),
        failTitle: getMessages('pool.update.v2.fail'),
        successDescription: getMessages('pool.update.v2.success'),
    },
} as const;

type PoolSettingsProps = {
    address: string;
};

const hasTwoValues = pipe([size, equals(2)]);

const isSamePoS = (p1: string, p2: string): boolean => {
    return allPass([
        hasTwoValues,
        ([head, tail]: string[]) => equals(head, tail),
    ])([p1, p2]);
};

export const PoolSetting: FC<PoolSettingsProps> = ({ address }) => {
    const { account } = useWallet();
    const pool = useStakingPool(address, account);
    const posV2Enabled = useFlag('posV2Enabled');
    const stakingPool = useStakingPoolQuery(address);
    const poolFactory = useStakingPoolFactory();
    const bg = useColorModeValue('light.gray.secondary', 'dark.gray.primary');
    const rebalanceBg = useColorModeValue(
        'light.support.warning',
        'dark.support.warning'
    );
    const rebalanceColor = useColorModeValue('white', 'dark.gray.primary');
    const rebalanceHoverBg = useColorModeValue(
        'light.orange.primary',
        'dark.orange.primary'
    );
    const rebalanceDisabledBg = useColorModeValue(
        'light.gray.quaternary',
        'dark.gray.quaternary'
    );
    const rebalanceDisabledColor = useColorModeValue(
        'light.support.disabled',
        'dark.support.disabled'
    );
    const borderColor = useColorModeValue(
        'dark.gray.quaternary',
        'dark.border.quaternary'
    );
    const linkColor = useColorModeValue('teal', 'cyan');
    const progress = pool.transaction?.receipt?.confirmations || 0;
    const isRebalanceEnabled =
        pool.amounts?.stake > BigNumber.from(0) ||
        pool.amounts?.unstake > BigNumber.from(0) ||
        pool.amounts?.withdraw > BigNumber.from(0);
    const isRebalancing = pool.rebalanceTransaction?.isOngoing;
    const isRebalanceButtonDisabled = !isRebalanceEnabled || isRebalancing;
    const hasSamePoS = isSamePoS(pool.pos, poolFactory.pos);
    const displayPoSV2Alert = posV2Enabled && poolFactory.ready && !hasSamePoS;

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

        if (!validateEns(value)) {
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

    return (
        <Box
            px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
            pb={{ base: 6, sm: 8, lg: 8 }}
            fontSize="xl"
            pt={16}
            bg={bg}
        >
            <TransactionBanner
                title={wordingFor.rebalance.title}
                failTitle={wordingFor.rebalance.failTitle}
                successDescription={wordingFor.rebalance.successDescription}
                transaction={pool.rebalanceTransaction}
                mb={2}
            />

            <Stack
                spacing={4}
                justifyContent="space-between"
                alignContent="flex-start"
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
                    <VStack alignItems="flex-end">
                        <Button
                            bg={rebalanceBg}
                            color={rebalanceColor}
                            _disabled={{
                                color: rebalanceDisabledColor,
                                bg: rebalanceDisabledBg,
                                cursor: 'not-allowed',
                            }}
                            _hover={{
                                bg: isRebalanceButtonDisabled
                                    ? rebalanceDisabledBg
                                    : rebalanceHoverBg,
                            }}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="full"
                            w={{ base: '100%', md: 'auto' }}
                            minW="10.8125rem"
                            height="2.875rem"
                            textTransform="uppercase"
                            leftIcon={<FaBalanceScaleLeft />}
                            isDisabled={isRebalanceButtonDisabled}
                            isLoading={isRebalancing}
                            onClick={pool.rebalance}
                        >
                            Rebalance
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
                                    value={pool?.amount}
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

            <TransactionBanner
                transaction={pool.updateTransaction}
                title={wordingFor.update.title}
                failTitle={wordingFor.update.failTitle}
                successDescription={wordingFor.update.successDescription}
                mb={2}
            />

            {displayPoSV2Alert && (
                <Notification
                    title="Pool manager action"
                    subtitle="upgrade your staking pool to use the new PoS version 2"
                    status="warning"
                    mb={3}
                    data-testid="posV2Alert"
                >
                    <Button
                        colorScheme="darkGray"
                        variant="ghost"
                        mt="1rem !important"
                        isLoading={pool?.updateTransaction?.isOngoing}
                        onClick={pool?.update}
                    >
                        Update
                    </Button>
                </Notification>
            )}

            <FlatRateContainer
                pool={address}
                alertMessage={wordingFor.commission}
            />

            <Stack
                justifySelf="flex-end"
                justifyContent="flex-end"
                alignItems="flex-end"
                mt={2}
            >
                <TransactionBanner
                    title={wordingFor.changeEns.title}
                    failTitle={wordingFor.changeEns.failTitle}
                    successDescription={wordingFor.changeEns.successDescription}
                    transaction={pool.setNameTransaction}
                    mb={2}
                />

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
                            colorScheme="darkGray"
                            variant="ghost"
                            w={{ base: '100%', md: 'auto' }}
                            minW="10.8125rem"
                            height="2.875rem"
                            textTransform="uppercase"
                            isDisabled={
                                getValues('ensName') === '' ||
                                !!touchedFields.ensName ||
                                !!errors.ensName ||
                                progress >= 1
                            }
                            onClick={() => pool.setName(getValues('ensName'))}
                        >
                            Update
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

                <FormControl pt={4}>
                    <TransactionBanner
                        title={wordingFor.pause.title}
                        failTitle={wordingFor.pause.failTitle}
                        successDescription={wordingFor.pause.successDescription}
                        transaction={pool.pauseTransaction}
                        mb={2}
                    />

                    <TransactionBanner
                        title={wordingFor.unpause.title}
                        failTitle={wordingFor.unpause.failTitle}
                        successDescription={
                            wordingFor.unpause.successDescription
                        }
                        transaction={pool.unpauseTransaction}
                        mb={2}
                    />

                    <HStack justify="space-between">
                        <FormLabel>
                            Staking{' '}
                            <Tooltip
                                placement="bottom"
                                label="Open or close the pool for new stakes"
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
                                colorScheme="teal"
                                size="lg"
                                me={3}
                                defaultChecked
                                isChecked={!pool.paused}
                                onChange={() => {
                                    if (pool.paused) {
                                        pool.unpause();
                                    } else {
                                        pool.pause();
                                    }
                                }}
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
                            label="If you don't want to keep the pool active, it can be disabled with our help"
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
                    If you would like to close the pool, please{' '}
                    <Link href="mailto:hello@cartesi.io" color={linkColor}>
                        contact us
                    </Link>{' '}
                    and we will be glad to help you.
                </FormLabel>
            </Box>
        </Box>
    );
};

export default PoolSetting;
