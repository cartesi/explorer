// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Heading, Icon, VStack } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { SlideDown } from '../../../components/animation/SlideDown';
import { Card } from '../../../components/Card';
import { AllowanceIcon, WalletIcon } from '../../../components/Icons';
import { OrderedContent } from '../../../components/OrderedContent';
import { hasPoolsAtom, hasPrivateNodeAtom } from '../atoms';
import Block from './Block';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useColorModeValue } from '../../../components/ui/color-mode';

const mainResponsibilities = 'Main responsibilities:';
const privateNodeResponsibilities = [
    'Make sure the Noether node is online and works properly 24x7.',
    'Pay the Ethereum fees that are necessary for block production and also maintenance operations.',
];

const publicPoolResponsibilities = [
    'Make sure the Noether node is online and works properly 24x7.',
    'Have a relatively large amount of CTSI to stake.',
];

interface CreationPathProps {
    router: AppRouterInstance;
}

const CreationPath = ({ router }: CreationPathProps) => {
    const bg = useColorModeValue('light.gray.secondary', 'dark.gray.primary');
    const bgCard = useColorModeValue('white', 'dark.gray.quaternary');
    const iconColor = useColorModeValue('dark.secondary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.secondary');
    const borderColor = useColorModeValue('gray.100', 'dark.border.quaternary');
    const [hasPools] = useAtom(hasPoolsAtom);
    const [hasPrivateNode] = useAtom(hasPrivateNodeAtom);
    const noPoolsOrNodes = !hasPools || !hasPrivateNode;

    return (
        noPoolsOrNodes && (
            <Block bg={bg}>
                <Heading
                    fontSize="2xl"
                    mt={5}
                    mb={{ base: 4, md: 8 }}
                    fontWeight="medium"
                    lineHeight="1.5rem"
                >
                    Create a node or pool in steps
                </Heading>
                <VStack align="stretch" px={{ base: '3vw', md: '9vw' }}>
                    <SlideDown display={!hasPools}>
                        <Card
                            my={2}
                            borderRadius="1rem"
                            borderWidth="1px"
                            borderColor={borderColor}
                            bg={bgCard}
                            id="pool-creation-card"
                            title="Create a public pool"
                            subtitle="Earn commissions out of the blocks rewards."
                            iconBg={iconBg}
                            icon={
                                <Icon
                                    as={AllowanceIcon}
                                    w={6}
                                    h={6}
                                    color={iconColor}
                                />
                            }
                            buttonText="CREATE PUBLIC POOL"
                            onButtonClick={() => router.push('/pools/new')}
                            tooltip={
                                <OrderedContent
                                    title={mainResponsibilities}
                                    orderedItems={publicPoolResponsibilities}
                                />
                            }
                        />
                    </SlideDown>

                    <SlideDown display={!hasPrivateNode}>
                        <Card
                            my={2}
                            borderRadius="1rem"
                            borderWidth="1px"
                            borderColor={borderColor}
                            bg={bgCard}
                            id="private-node-creation-card"
                            title="Run a private node"
                            subtitle="You are able to stake directly by running your own node to represent your stake."
                            iconBg={iconBg}
                            icon={
                                <Icon
                                    as={WalletIcon}
                                    w={6}
                                    h={6}
                                    color={iconColor}
                                />
                            }
                            buttonText={'CREATE MY NODE'}
                            onButtonClick={() => {
                                router.push('/node/new');
                            }}
                            tooltip={
                                <OrderedContent
                                    title={mainResponsibilities}
                                    orderedItems={privateNodeResponsibilities}
                                />
                            }
                        />
                    </SlideDown>
                </VStack>
            </Block>
        )
    );
};

export default CreationPath;
