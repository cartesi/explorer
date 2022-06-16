// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Switch,
    Tooltip,
    VStack,
} from '@chakra-ui/react';
import { FaBalanceScaleLeft } from 'react-icons/fa';

export const PoolSetting: React.FC = () => {
    return (
        <Box
            px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
            pb={{ base: 6, sm: 8, lg: 8 }}
            fontSize={'xl'}
        >
            <Stack
                spacing={4}
                justifyContent="space-between"
                alignContent="flex-start"
                mt={16}
                mb={10}
                direction={{ base: 'column', md: 'row' }}
            >
                <Box>
                    <Heading as="h2" mb={0}>
                        Pool Setting
                    </Heading>
                    <Link href="#" isExternal fontSize="xs">
                        Learn with this tutorial <ExternalLinkIcon />
                    </Link>
                </Box>

                <Box>
                    <VStack>
                        <Button
                            bgColor={'orange.100'}
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                            leftIcon={<FaBalanceScaleLeft />}
                        >
                            REBALANCE
                        </Button>
                        <Box fontSize={'sm'} alignSelf="flex-end">
                            Pool balance 0 CTSI{' '}
                            <Tooltip
                                placement="bottom"
                                label="SAMPLE TEXT"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                />
                            </Tooltip>
                        </Box>
                    </VStack>
                </Box>
            </Stack>

            <Stack
                justifySelf="flex-end"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <FormControl>
                    <HStack justify="space-between">
                        <FormLabel>
                            Pool comission{' '}
                            <Tooltip
                                placement="bottom"
                                label="SAMPLE TEXT"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <Stack direction={['column', 'row']}>
                        <InputGroup me={6}>
                            <Input size="lg" />
                            <InputRightElement
                                color="gray.300"
                                size="lg"
                                pointerEvents="none"
                                w={14}
                                h="100%"
                                children={<Box>%</Box>}
                            />
                        </InputGroup>
                        <Button
                            colorScheme="blue"
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                        >
                            UPDATE
                        </Button>
                    </Stack>
                </FormControl>
                <FormControl>
                    <HStack justify="space-between">
                        <FormLabel>
                            Pool ENS name{' '}
                            <Tooltip
                                placement="bottom"
                                label="SAMPLE TEXT"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <Stack direction={['column', 'row']}>
                        <InputGroup me={6}>
                            <Input size="lg" />
                        </InputGroup>
                        <Button
                            colorScheme="blue"
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                        >
                            UPDATE
                        </Button>
                    </Stack>
                    <FormHelperText>
                        After registering an ENS domain and setting it up, set
                        the name here.
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <HStack mt={4} justify="space-between">
                        <FormLabel>
                            Staking{' '}
                            <Tooltip
                                placement="bottom"
                                label="SAMPLE TEXT"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <HStack>
                        <InputGroup me={6}>
                            <Switch
                                id="isChecked"
                                size="lg"
                                defaultChecked={true}
                                me={3}
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
                            label="SAMPLE TEXT"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon
                                pb={1}
                                width={4}
                                height={4}
                                color="gray.600"
                            />
                        </Tooltip>
                    </FormLabel>
                </HStack>
                <FormLabel>
                    If you would like to close the pool. Please,{' '}
                    <Link href="#" color="blue.400">
                        contact us
                    </Link>{' '}
                    and we will be glad to help you.
                </FormLabel>
            </Box>
        </Box>
    );
};

export default PoolSetting;
