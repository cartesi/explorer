import React, { memo } from 'react';
import { Box, Flex, FlexProps, Heading, Spacer, Text } from '@chakra-ui/react';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { BigNumberish } from 'ethers';
import { isEqual } from 'lodash';
import { Transaction } from '../../services/transaction';
import TransactionFeedback from '../TransactionFeedback';
import CTSIText from '../CTSIText';

interface BalancesProps extends FlexProps {
    balance: BigNumberish;
    stakedBalance: BigNumberish;
    transaction: Transaction<unknown>;
}

const areEqual = (prevProps: BalancesProps, nextProps: BalancesProps) =>
    prevProps.balance === nextProps.balance &&
    prevProps.stakedBalance === nextProps.stakedBalance &&
    isEqual(prevProps.transaction, nextProps.transaction);

export const Balances: React.FunctionComponent<BalancesProps> = memo(
    (props) => {
        const { balance, stakedBalance, transaction, ...restProps } = props;

        return (
            <Flex
                {...restProps}
                direction={['column', 'column', 'column', 'row']}
                bg="black"
                color="white"
                opacity={0.87}
                p="50px 6vw 65px 6vw"
            >
                <Box pb={[4, 4, 4, 0]}>
                    <Heading as="h5" size="lg" fontWeight="normal">
                        Staking
                    </Heading>

                    <TransactionFeedback transaction={transaction} />
                </Box>

                <Spacer />

                <Flex w={['100%', '100%', '100%', '50%']}>
                    <Box w="50%">
                        <CTSIText
                            value={balance}
                            icon={FaWallet}
                            bg="black"
                            color="white"
                        >
                            <Text>Wallet Balance</Text>
                        </CTSIText>
                    </Box>

                    <Box w="50%">
                        <CTSIText
                            value={stakedBalance}
                            icon={FaCoins}
                            bg="black"
                            color="white"
                        >
                            <Text>Staked Balance</Text>
                        </CTSIText>
                    </Box>
                </Flex>
            </Flex>
        );
    },
    areEqual
);

export default Balances;
