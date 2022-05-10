// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Text,
    Flex,
    HStack,
    Stack,
    useColorModeValue,
    Button,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Link,
    Checkbox,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC, useState } from 'react';
import Address from '../Address';

export interface INodeInfoSection {
    address: string;
    nodeBalance: BigNumber;
    onRetire: () => void;
}

export const NodeInfoSection: FC<INodeInfoSection> = ({
    address,
    nodeBalance,
    onRetire,
}) => {
    // dark mode support
    const bg = useColorModeValue('white', 'gray.800');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [confirmNoehtherVersion, setConfirmNoehtherVersion] = useState(false);

    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
    };

    const numberFormat = new Intl.NumberFormat('en-US', options);
    const nodeBalanceFormatted = numberFormat.format(
        nodeBalance ? parseFloat(formatUnits(nodeBalance, 18)) : 0
    );

    const onConfirmRetire = () => {
        onClose();
        onRetire();
    };

    return (
        <>
            <Box
                bg={bg}
                borderRadius="lg"
                shadow="sm"
                px={{ base: 2, lg: 4, xl: 8 }}
                py={{ base: 2, sm: 4, lg: 8 }}
                mb={6}
            >
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    direction={{ base: 'column', md: 'row' }}
                    p={2}
                >
                    <Text>Address</Text>
                    <Address noActions={true} address={address}></Address>
                </Stack>
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    direction={{ base: 'column', md: 'row' }}
                    p={2}
                >
                    <Text>Deposit Funds</Text>
                    <HStack spacing={4} alignItems="flex-end">
                        <Box>
                            <Flex align="baseline">
                                <Text>{nodeBalanceFormatted}</Text>
                                <Text pl={1}>ETH</Text>
                            </Flex>
                        </Box>
                        <Box alignSelf="flex-end">
                            <IconButton
                                aria-label="Edit"
                                size="sm"
                                icon={<EditIcon />}
                                variant="ghost"
                                // onClick={onAllowanceClick}
                            />
                        </Box>
                    </HStack>
                </Stack>
            </Box>
            <Button
                onClick={onOpen}
                bgColor={bg}
                w={{ base: '100%', md: 'auto' }}
                minW="15rem"
                me={2}
            >
                RETIRE NODE
            </Button>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Warning!</ModalHeader>
                    <ModalBody>
                        <Text mb={16} fontSize="sm">
                            By pressing "I Confirm to Retire Node", you'll
                            initiate node retirement. Before you proceed, make
                            sure you understand{' '}
                            <Link
                                href="https://github.com/cartesi/noether/wiki/FAQ#i-have-retired-my-node-in-the-cartesi-explorer-but-the-node-funds-were-not-returned-what-is-going-on"
                                isExternal
                                textDecoration="underline"
                            >
                                how node retirement works{' '}
                                <ExternalLinkIcon mx="2px" />
                            </Link>
                            .
                        </Text>
                        <Checkbox
                            colorScheme="green"
                            isChecked={confirmNoehtherVersion}
                            onChange={(e) =>
                                setConfirmNoehtherVersion(e.target.checked)
                            }
                        >
                            I confirm I'm running noether &gt;= 2.0.3
                        </Checkbox>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={onConfirmRetire}
                            colorScheme="red"
                            mr={3}
                            disabled={!confirmNoehtherVersion}
                        >
                            I Confirm to Retire Node
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
