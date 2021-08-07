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
import { formatCTSI, toCTSI } from '../../utils/token';
import theme from '../../styles/theme';
import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, constants } from 'ethers';
import { useCartesiToken } from '../../services/token';
import { useStaking } from '../../services/staking';
import { useBlockNumber } from '../../services/eth';
import { isInfinite } from '../../utils/token';
import CTSIText from '../CTSIText';
import { Summary } from '../../graphql/models';

interface StakeFormProps extends BoxProps {
    summary: Summary;
    waiting?: boolean;
}

const StakeForm: FC<StakeFormProps> = (props) => {
    const { summary, waiting = false, ...restProps } = props;
    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();
    const { staking, releasingBalance } = useStaking(account);
    const { parseCTSI, allowance, approve, toBigCTSI } = useCartesiToken(
        account,
        staking?.address,
        blockNumber
    );
    const { stake } = useStaking(account);

    const [stakeAmount, setStakeAmount] = useState<number>(0);
    const [infiniteApproval, setInfiniteApproval] = useState<boolean>(false);

    const splitStakeAmount = () => {
        let fromReleasing = BigNumber.from(0),
            fromAllowance = BigNumber.from(0);
        const stakeAmountCTSI = parseCTSI(stakeAmount);

        if (releasingBalance.add(allowance).lt(stakeAmountCTSI)) {
            return null;
        }

        if (releasingBalance.eq(0)) {
            fromAllowance = stakeAmountCTSI;
        } else {
            if (releasingBalance.gt(stakeAmountCTSI)) {
                fromReleasing = stakeAmountCTSI;
            } else {
                fromReleasing = releasingBalance;
                fromAllowance = stakeAmountCTSI.sub(releasingBalance);
            }
        }

        return {
            releasing: fromReleasing,
            wallet: fromAllowance,
        };
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ stake: number }>({
        defaultValues: {
            stake: 0,
        },
    });

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        }
        if (isInfinite(value)) {
            return 'Value must be a finite number';
        }
        return true;
    };

    const doApprove = (stakeAmount: number) => {
        if (stakeAmount > 0) {
            if (infiniteApproval) {
                approve(staking.address, constants.MaxUint256);
            } else if (stakeAmount !== Number(toCTSI(allowance))) {
                approve(staking.address, parseCTSI(stakeAmount));
            }
        }
    };

    const doApproveOrStake = (stakeAmount: number) => {
        if (!stakeSplit) {
            doApprove(stakeAmount);
        } else if (stakeAmount > 0) {
            stake(parseCTSI(stakeAmount));
            reset({ stake: 0 });
        }
    };

    const stakeSplit = splitStakeAmount();
    const totalStaked =
        summary && summary.totalStaked ? toBigCTSI(summary.totalStaked) : 0;

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
                        isDisabled={!account || waiting}
                        {...register('stake', {
                            required: true,
                            valueAsNumber: true,
                            validate,
                        })}
                        onChange={(e) => {
                            setStakeAmount(
                                e.target.value ? parseFloat(e.target.value) : 0
                            );
                        }}
                    />
                    <InputRightAddon children={<span>CTSI</span>} />
                </InputGroup>
                <FormErrorMessage>{errors.stake?.message}</FormErrorMessage>
            </FormControl>

            <Box>
                {stakeSplit ? (
                    <>
                        {stakeSplit.releasing.gt(0) && (
                            <Alert status="info" mt={2}>
                                <AlertIcon />

                                <Flex justify="space-between" width="100%">
                                    <Text>
                                        {formatCTSI(stakeSplit.releasing)}{' '}
                                        <Text display="inline" fontSize="sm">
                                            CTSI
                                        </Text>
                                    </Text>

                                    <Text>From "releasing"</Text>
                                </Flex>
                            </Alert>
                        )}

                        {stakeSplit.wallet.gt(0) && (
                            <Alert status="info" mt={2}>
                                <AlertIcon />

                                <Flex justify="space-between" width="100%">
                                    <Text>
                                        {formatCTSI(stakeSplit.wallet)}{' '}
                                        <Text display="inline" fontSize="sm">
                                            CTSI
                                        </Text>
                                    </Text>

                                    <Text>From "wallet"</Text>
                                </Flex>
                            </Alert>
                        )}
                    </>
                ) : (
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
                bg={
                    !account || waiting
                        ? theme.colors.gray9
                        : theme.colors.secondary
                }
                isFullWidth
                isDisabled={
                    isInfinite(stakeAmount) ||
                    !account ||
                    waiting ||
                    !!stakeSplit
                }
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
                bg={
                    !account || waiting
                        ? theme.colors.gray9
                        : theme.colors.secondary
                }
                isFullWidth
                isDisabled={
                    isInfinite(stakeAmount) ||
                    !account ||
                    waiting ||
                    !stakeSplit
                }
                onClick={handleSubmit((data) => doApproveOrStake(data.stake))}
            >
                Stake
            </Button>

            {stakeSplit ? (
                <>
                    <Text fontSize="12px" color="red.500" align="center" mt={4}>
                        The maturing status will restart counting.
                    </Text>

                    {stakeAmount > 0 && (
                        <Alert status="info" mt={2}>
                            <AlertIcon />

                            <Text>
                                This stake currently corresponds to a{' '}
                                {totalStaked
                                    ? (
                                          (stakeAmount * 100) /
                                          totalStaked.toNumber()
                                      ).toFixed(2)
                                    : 0}{' '}
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
                                : theme.colors.gray2
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
