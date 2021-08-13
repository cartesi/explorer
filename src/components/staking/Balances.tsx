import React from 'react';
import { Box, Flex, FlexProps, Heading, Spacer, Text } from '@chakra-ui/react';
import { FaCoins, FaWallet } from 'react-icons/fa';
import CTSIText from '../CTSIText';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import TransactionFeedback from '../TransactionFeedback';

export const Balances: React.FunctionComponent<FlexProps> = (props) => {
    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();
    const { staking, stakedBalance, transaction } = useStaking(account);
    const { balance } = useCartesiToken(account, staking?.address, blockNumber);

    return (
        <Flex
            {...props}
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
};

export default Balances;
