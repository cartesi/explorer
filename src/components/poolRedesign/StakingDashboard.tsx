// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { EditIcon, ExternalLinkIcon, WarningIcon } from '@chakra-ui/icons';
import {
    OrderedList,
    ListItem,
    Stack,
    Link,
    Button,
    Text,
    useDisclosure,
    Box,
    Heading,
    HStack,
    Icon,
    Tooltip,
    VStack,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { AllowenceIcon, WalletIcon } from '../../components/Icons';
import { InfoBanner } from './InfoBanner';
import { StakingPoolAllowence } from './StakingPoolAllowence';

export const StakingDashboard: FC = () => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    const onSave = (amount: string) => {
        console.log('onSave', amount);
    };

    const {
        isOpen: isOpenStakingPoolAllowenceModal,
        onOpen: onOpenStakingPoolAllowenceModal,
        onClose: onCloseStakingPoolAllowenceModal,
    } = useDisclosure();

    const borderColor = useColorModeValue('gray.100', 'transparent');

    return (
        <>
            <VStack spacing={8}>
                <InfoBanner
                    title="Read carefully before staking!"
                    content={
                        <>
                            <OrderedList fontSize="sm" mt={2}>
                                <ListItem>
                                    This is a PoS system and thus,
                                    probabilistic. It can take a much longer
                                    time for you to produce blocks than the
                                    estimated average.
                                </ListItem>
                                <ListItem>
                                    Estimated rewards can be highly variable,
                                    depending on chance and on the total amount
                                    of CTSI staked by everyone in the network.
                                </ListItem>
                                <ListItem>
                                    Whenever your node is unavailable, you miss
                                    the chance of producing blocks. Cartesi's
                                    node depends on the availability of the
                                    configured Ethereum node.
                                </ListItem>
                                <ListItem>
                                    This is a PoS system and thus,
                                    probabilistic. It can take a much longer
                                    time for you to produce blocks than the
                                    estimated average.
                                </ListItem>
                                <ListItem>
                                    Estimated rewards can be highly variable,
                                    depending on chance and on the total amount
                                    of CTSI staked by everyone in the network.
                                </ListItem>
                                <ListItem>
                                    Whenever your node is unavailable, you miss
                                    the chance of producing blocks. Cartesi's
                                    node depends on the availability of the
                                    configured Ethereum node.
                                </ListItem>
                            </OrderedList>
                            <Stack
                                spacing={4}
                                direction={{ base: 'column', md: 'row' }}
                                justifyContent="space-between"
                                mt={6}
                                w="full"
                            >
                                <Link
                                    href="#"
                                    isExternal
                                    fontSize="sm"
                                    color="orange.500"
                                    _hover={{
                                        color: 'orange.600',
                                    }}
                                >
                                    Learn detailed staking instructions{' '}
                                    <ExternalLinkIcon />
                                </Link>
                                <Button
                                    size="sm"
                                    onClick={onToggle}
                                    colorScheme="darkGray"
                                >
                                    Don't show again
                                </Button>
                            </Stack>
                        </>
                    }
                    isOpen={isOpen}
                    isClosable
                    borderTop="1px solid"
                    borderRight="1px solid"
                    borderBottom="1px solid"
                    borderTopColor={borderColor}
                    borderRightColor={borderColor}
                    borderBottomColor={borderColor}
                    status="warning"
                    onToggle={onToggle}
                />
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    spacing={8}
                    w="full"
                    justifyContent="space-between"
                >
                    <VStack
                        alignItems="flex-start"
                        flexBasis={{ base: '100%', lg: '50%' }}
                    >
                        <HStack spacing={4} alignItems="center" py={4} mb="2px">
                            <Box
                                bg="blue.100"
                                w={14}
                                h={14}
                                borderRadius="full"
                                display="grid"
                                placeContent="center"
                            >
                                <WalletIcon color="blue.500" w={6} h={6} />
                            </Box>
                            <Box>
                                <HStack>
                                    <Text color="gray.400">Wallet balance</Text>
                                    <Tooltip
                                        placement="top"
                                        label="Here you can see your current wallet balance."
                                        fontSize="small"
                                        bg="black"
                                        color="white"
                                    >
                                        <Icon color="gray.400" />
                                    </Tooltip>
                                </HStack>
                                <Heading m={0} size="lg">
                                    1,800,000 CTSI
                                </Heading>
                            </Box>
                        </HStack>
                        <HStack spacing={2} alignItems="flex-start">
                            <WarningIcon color="orange.500" />
                            <Text fontSize="sm">
                                You don’t have enough ETH in your wallet for the
                                transaction fee, please deposit first.
                            </Text>
                        </HStack>
                    </VStack>
                    <VStack
                        alignItems="flex-start"
                        flexBasis={{ base: '100%', lg: '50%' }}
                    >
                        <HStack
                            w="full"
                            spacing={4}
                            alignItems="center"
                            p={4}
                            border="1px dotted"
                            borderRadius={6}
                            borderColor="yellow.300"
                        >
                            <Box
                                bg="yellow.100"
                                w={14}
                                h={14}
                                borderRadius="full"
                                display="grid"
                                placeContent="center"
                            >
                                <AllowenceIcon color="yellow.500" w={6} h={6} />
                            </Box>
                            <Box flexGrow="1">
                                <HStack>
                                    <Text color="gray.400">Pool allowance</Text>
                                    <Tooltip
                                        placement="top"
                                        label="Here you can see your current pool allowance."
                                        fontSize="small"
                                        bg="black"
                                        color="white"
                                    >
                                        <Icon color="gray.400" />
                                    </Tooltip>
                                </HStack>
                                <Heading m={0} size="lg">
                                    0 CTSI
                                </Heading>
                            </Box>
                            <Box alignSelf="flex-end">
                                <IconButton
                                    aria-label="Edit"
                                    size="sm"
                                    icon={<EditIcon />}
                                    variant="ghost"
                                    onClick={onOpenStakingPoolAllowenceModal}
                                />
                            </Box>
                        </HStack>
                        <Text fontSize="sm">
                            Please set allowance before staking.
                        </Text>
                    </VStack>
                </Stack>
            </VStack>

            <StakingPoolAllowence
                isOpen={isOpenStakingPoolAllowenceModal}
                onClose={onCloseStakingPoolAllowenceModal}
                onSave={onSave}
            />
        </>
    );
};
