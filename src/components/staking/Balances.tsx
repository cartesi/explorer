import React, { memo } from 'react';
import { Box, Flex, FlexProps, Heading, Spacer } from '@chakra-ui/react';
import { FaCoins, FaWallet } from 'react-icons/fa';
import ConfirmationIndicator from '../ConfirmationIndicator';
import CTSIText from '../CTSIText';

interface BalancesProps extends FlexProps {
    waiting: boolean;
    balance: string;
    stakedBalance: string;
    error?: string;
}

const areEqual = (prevProps: BalancesProps, nextProps: BalancesProps) =>
    prevProps.waiting === nextProps.waiting &&
    prevProps.error === nextProps.error &&
    prevProps.balance === nextProps.balance &&
    prevProps.stakedBalance === nextProps.stakedBalance;

export const Balances: React.FunctionComponent<BalancesProps> = memo(
    (props) => {
        const { waiting, error, balance, stakedBalance } = props;

        return (
            <Flex
                direction={['column', 'column', 'column', 'row']}
                bg="black"
                color="white"
                opacity={0.87}
                p="50px 6vw 50px 6vw"
            >
                <Box pb={[4, 4, 4, 0]}>
                    <Heading as="h5" size="lg" fontWeight="normal">
                        Staking
                    </Heading>

                    <ConfirmationIndicator loading={waiting} error={error} />
                </Box>

                <Spacer />

                <Flex w={['100%', '100%', '100%', '50%']}>
                    <Box w="50%">
                        <CTSIText
                            label="Wallet Balance"
                            value={balance}
                            icon={FaWallet}
                            bg="black"
                            color="white"
                        />
                    </Box>

                    <Box w="50%">
                        <CTSIText
                            label="Staked Balance"
                            value={stakedBalance}
                            icon={FaCoins}
                            bg="black"
                            color="white"
                        />
                    </Box>
                </Flex>
            </Flex>
        );
    },
    areEqual
);

export default Balances;
