// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import {
    Box,
    Stack,
    Heading,
    Text,
    Alert,
    Button,
    VStack,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { SlideDown } from '../../components/animation/SlideDown';
import { Card } from '../../components/Card';
import { OrderedContent } from '../../components/OrderedContent';
import { AllowanceIcon, WalletIcon } from '../../components/Icons';
import { UseWallet } from '../../contexts/wallet';
import { NextRouter } from 'next/router';

export interface NodeRunnersContainerProps {
    wallet: UseWallet;
    router: NextRouter;
}

const Header = () => (
    <Box bg="header" color="white" px={{ base: '6vw', xl: '12vw' }} py={5}>
        <Stack alignItems={'flex-start'} direction={'column'}>
            <Heading as="h1" fontSize={['4xl', '5xl']}>
                Node Runners
            </Heading>
            <Text fontSize="md" fontWeight="400">
                This area is for the node runner users including public pool
                manager or private node runner.{' '}
            </Text>
        </Stack>
    </Box>
);

type AlertAndConnectT = { display: boolean; connect: () => void };
const AlertAndConnect = ({ display, connect }: AlertAndConnectT) => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <SlideDown display={display}>
            <Box
                bg={bg}
                id="alert-and-wallet-connection-box"
                alignItems="center"
                display="flex"
                flexDirection="column"
                pt={12}
                pb={6}
            >
                <Box>
                    <Alert bg="transparent">
                        <Icon
                            as={AiOutlineExclamationCircle}
                            h={5}
                            w={5}
                            mr={2}
                        />
                        Please connect your wallet if you have created your own
                        node and pool already
                    </Alert>
                </Box>
                <Button colorScheme="blue" mt={7} onClick={connect}>
                    CONNECT WALLET
                </Button>
            </Box>
        </SlideDown>
    );
};

const mainResponsability = 'Main responsabilities:';
const privateNodeResponsabilities = [
    'Make sure the Noether node is online and works properly 24x7.',
    'Pay the Ethereum fees that are necessary for block production and also maintenance operations.',
];

const publicPoolResponsabilities = [
    'Make sure the Noether node is online and works properly 24x7.',
    'Have a relatively large amount of CTSI to stake.',
];

type CreationPathT = { router: NextRouter };
const CreationPath = ({ router }: CreationPathT) => {
    const bg = useColorModeValue('gray.80', 'header');
    return (
        <Box
            bg={bg}
            px={{ base: '6vw', xl: '12vw' }}
            pt={{ base: 8, sm: '3vw' }}
            pb={{ base: 8, sm: '5vw' }}
        >
            <Heading
                fontSize="2xl"
                mt={5}
                mb={{ base: 4, md: 8 }}
                fontWeight="medium"
                lineHeight={6}
            >
                Create a node or pool in steps
            </Heading>
            <VStack align="stretch" px={{ base: '3vw', md: '9vw' }}>
                <Card
                    id="pool-creation-card"
                    title="Create a public pool"
                    subtitle="Earn commissions out of the blocks rewards."
                    iconBg="yellow.100"
                    icon={<AllowanceIcon color="yellow.500" w={6} h={6} />}
                    buttonText={'CREATE PUBLIC POOL'}
                    onButtonClick={() => {
                        router.push('/pools/new');
                    }}
                    tooltip={
                        <OrderedContent
                            title={mainResponsability}
                            orderedItems={publicPoolResponsabilities}
                        />
                    }
                />

                <Card
                    id="private-node-creation-card"
                    title="Run a private node"
                    subtitle="You are able to stake directly by running your own node to represent your stake."
                    iconBg="yellow.100"
                    icon={<WalletIcon color="yellow.500" w={6} h={6} />}
                    buttonText={'CREATE MY NODE'}
                    onButtonClick={() => {
                        router.push('/node/new');
                    }}
                    tooltip={
                        <OrderedContent
                            title={mainResponsability}
                            orderedItems={privateNodeResponsabilities}
                        />
                    }
                />
            </VStack>
        </Box>
    );
};

export const NodeRunnersContainer = ({
    wallet,
    router,
}: NodeRunnersContainerProps) => {
    const { activate, active } = wallet;

    return (
        <>
            <Header />
            <AlertAndConnect display={!active} connect={activate} />
            <CreationPath router={router} />
        </>
    );
};
