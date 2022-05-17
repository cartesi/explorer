// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Text,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Stack,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';

export const NodeHireNodeSection = () => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            borderRadius="lg"
            shadow="sm"
            px={{ base: 2, lg: 4, xl: 8 }}
            py={{ base: 2, sm: 4, lg: 8 }}
            mb={6}
        >
            <VStack py={6} px={60} spacing={5}>
                <FormControl>
                    <HStack justify="space-between">
                        <FormLabel fontWeight="bold">Node address</FormLabel>
                    </HStack>
                    <InputGroup>
                        <Input placeholder="Please, enter new node address" />
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <HStack justify="space-between">
                        <FormLabel fontWeight="bold">Initial funds</FormLabel>
                    </HStack>
                    <InputGroup>
                        <Input />
                        <InputRightElement
                            color="gray.300"
                            size="lg"
                            pointerEvents="none"
                            w={14}
                            h="100%"
                            children={<Box>ETH</Box>}
                        />
                    </InputGroup>
                    <FormHelperText>Your balance: 123123 ETH</FormHelperText>
                </FormControl>
            </VStack>
            <Stack
                spacing={4}
                mb={8}
                pe={60}
                justifySelf="flex-end"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Button
                    colorScheme="blue"
                    w={{ base: '100%', md: 'auto' }}
                    minW="15rem"
                >
                    HIRE NODE
                </Button>
                <Text fontSize="sm">Approve by wallet transaction</Text>
            </Stack>
        </Box>
    );
};
