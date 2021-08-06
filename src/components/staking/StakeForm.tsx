import React, { FC, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
} from '@chakra-ui/react';
import { formatCTSI } from '../../utils/token';
import theme from '../../styles/theme';
import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useCartesiToken } from '../../services/token';
import { useStaking } from '../../services/staking';
import { useBlockNumber } from '../../services/eth';

interface UnstakingFormProps {
    waiting?: boolean;
}

const StakeForm: FC<UnstakingFormProps> = (props) => {
    const { waiting = false } = props;
    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();
    const { staking, stakedBalance, maturingBalance, unstake } =
        useStaking(account);
    const { parseCTSI } = useCartesiToken(
        account,
        staking?.address,
        blockNumber
    );
    const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

    const splitUnstakeAmount = () => {
        let fromMaturing = BigNumber.from(0),
            fromStaked = BigNumber.from(0);
        const unstakeAmountCTSI = parseCTSI(unstakeAmount);

        if (maturingBalance.add(stakedBalance).lt(unstakeAmountCTSI)) {
            return null;
        }

        if (maturingBalance.eq(0)) {
            fromStaked = unstakeAmountCTSI;
        } else {
            if (maturingBalance.gt(unstakeAmountCTSI)) {
                fromMaturing = unstakeAmountCTSI;
            } else {
                fromMaturing = maturingBalance;
                fromStaked = unstakeAmountCTSI.sub(maturingBalance);
            }
        }

        return {
            maturing: fromMaturing,
            staked: fromStaked,
        };
    };

    const unstakeSplit = splitUnstakeAmount();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ unstake: number }>({
        defaultValues: {
            unstake: 0,
        },
    });

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        }
        return true;
    };

    const doUnstake = (unstakeAmount) => {
        unstake(parseCTSI(unstakeAmount));
        reset({ unstake: 0 });
    };

    return (
        <Box>
            <FormControl isInvalid={!!errors.unstake}>
                <FormLabel>Amount to unstake</FormLabel>

                <InputGroup>
                    <Input
                        type="number"
                        min={0}
                        isInvalid={!!errors.unstake}
                        isDisabled={!account || waiting}
                        {...register('unstake', {
                            required: true,
                            valueAsNumber: true,
                            validate,
                        })}
                        onChange={(e) => {
                            setUnstakeAmount(
                                e.target.value ? parseFloat(e.target.value) : 0
                            );
                        }}
                    />
                    <InputRightAddon children={<span>CTSI</span>} />
                </InputGroup>
                <FormErrorMessage>{errors.unstake?.message}</FormErrorMessage>
            </FormControl>

            <Box>
                {unstakeSplit ? (
                    <>
                        {unstakeSplit.maturing.gt(0) && (
                            <Alert status="info">
                                <Text>
                                    {formatCTSI(unstakeSplit.maturing)}{' '}
                                    <Text display="inline" fontSize="sm">
                                        CTSI
                                    </Text>
                                </Text>
                                <Text>From "maturing"</Text>
                            </Alert>
                        )}

                        {unstakeSplit.staked.gt(0) && (
                            <Alert status="info">
                                <Text>
                                    {formatCTSI(unstakeSplit.staked)}{' '}
                                    <Text display="inline" fontSize="sm">
                                        CTSI
                                    </Text>
                                </Text>
                                <Text>From "staked"</Text>
                            </Alert>
                        )}
                    </>
                ) : (
                    <Alert status="warning">
                        <AlertIcon />
                        <Text>Maximum unstaking limit exceeded!</Text>
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
                isDisabled={!account || waiting}
                onClick={handleSubmit((data) => doUnstake(data.unstake))}
            >
                Unstake
            </Button>

            <Text fontSize="12px" color="red.500" align="center" mt={4}>
                The releasing status will restart counting.
            </Text>
        </Box>
    );
};

export default StakeForm;
