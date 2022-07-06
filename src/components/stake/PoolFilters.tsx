// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CloseIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Checkbox,
    Radio,
    RadioGroup,
    Flex,
    Heading,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { FC, Fragment } from 'react';
import { FilterIcon } from '../Icons';

interface IPoolFiltersProps {
    filters: any;
    selectedPeriod: string;
    onSelectedPeriodChange: (value: string) => void;
    selectedTypes: any;
    onSelectedTypesChange: (value: string) => void;
}

export const PoolFilters: FC<IPoolFiltersProps> = ({
    filters,
    selectedPeriod,
    onSelectedPeriodChange,
    selectedTypes,
    onSelectedTypesChange,
}) => {
    const checkedBg = useColorModeValue('gray.50', 'gray.600');
    const badgeBg = useColorModeValue('blue.500', 'blue.300');

    return (
        <Stack
            spacing={2}
            align="center"
            direction="row"
            zIndex={'lg'}
            position="relative"
        >
            <Box>
                <Menu>
                    <MenuButton
                        p={1}
                        variant="unstyled"
                        _focus={{ outline: 'none' }}
                        as={Button}
                    >
                        <HStack justifyContent="space-between" align="center">
                            <FilterIcon />
                            {selectedTypes.length === 0 && (
                                <Text fontSize="md" as="span">
                                    Add Filter
                                </Text>
                            )}
                        </HStack>
                    </MenuButton>

                    <MenuList p={4}>
                        {filters.map((filter, index) => (
                            <Fragment key={index}>
                                <MenuGroup>
                                    <Heading as="h5" size="sm" mb={2}>
                                        {filter.title}
                                    </Heading>
                                    {filter.type === 'checkbox' && (
                                        <VStack spacing={2} align="stretch">
                                            {filter.options.map(
                                                (option, index) => (
                                                    <Box
                                                        key={index}
                                                        style={{
                                                            margin: '0 calc(var(--chakra-space-4) * -1)',
                                                        }}
                                                        mx={-4}
                                                    >
                                                        <Checkbox
                                                            _checked={{
                                                                bgColor:
                                                                    checkedBg,
                                                            }}
                                                            spacing={0}
                                                            py={2}
                                                            px={4}
                                                            w="100%"
                                                            flexDirection="row-reverse"
                                                            justifyContent="space-between"
                                                            value={option.value}
                                                            onChange={() =>
                                                                onSelectedTypesChange(
                                                                    option.value
                                                                )
                                                            }
                                                            isChecked={selectedTypes.includes(
                                                                option.value
                                                            )}
                                                        >
                                                            {option.label}
                                                        </Checkbox>
                                                    </Box>
                                                )
                                            )}
                                        </VStack>
                                    )}
                                    {filter.type === 'radio' && (
                                        <RadioGroup
                                            onChange={(value) =>
                                                onSelectedPeriodChange(value)
                                            }
                                            defaultValue={
                                                filter.options.find(
                                                    (el) => el.default === true
                                                ).value
                                            }
                                        >
                                            <VStack spacing={2} align="stretch">
                                                {filter.options.map(
                                                    (option, index) => (
                                                        <Box
                                                            key={index}
                                                            style={{
                                                                margin: '0 calc(var(--chakra-space-4) * -1)',
                                                            }}
                                                            mx={-4}
                                                        >
                                                            <Radio
                                                                spacing={0}
                                                                py={2}
                                                                px={4}
                                                                w="100%"
                                                                flexDirection="row-reverse"
                                                                justifyContent="space-between"
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </Radio>
                                                        </Box>
                                                    )
                                                )}
                                            </VStack>
                                        </RadioGroup>
                                    )}
                                </MenuGroup>
                                {index !== filters.length - 1 && (
                                    <MenuDivider my={4} />
                                )}
                            </Fragment>
                        ))}
                    </MenuList>
                </Menu>
            </Box>
            <Flex mb={4} direction="row" wrap="wrap">
                {selectedPeriod && (
                    <Box p={'1px'}>
                        <HStack
                            bg={badgeBg}
                            color="white"
                            px={3}
                            py={1.5}
                            borderRadius="full"
                            display="inline-flex"
                            align="center"
                            spacing={2}
                        >
                            <Text fontSize="sm">
                                {
                                    filters
                                        .find((el) => el.key === 'time')
                                        .options.find(
                                            (el) => el.value === selectedPeriod
                                        ).label
                                }
                            </Text>
                        </HStack>
                    </Box>
                )}
                {selectedTypes.map((type, index) => (
                    <Box p={'1px'} key={index}>
                        <HStack
                            bg={badgeBg}
                            color="white"
                            px={3}
                            py={1}
                            borderRadius="full"
                            display="inline-flex"
                            align="center"
                            spacing={2}
                        >
                            <Text fontSize="sm">
                                {
                                    filters
                                        .find((el) => el.key === 'type')
                                        .options.find((el) => el.value === type)
                                        .label
                                }
                            </Text>
                            <Button
                                variant="unstyled"
                                size="xs"
                                px={2}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelectedTypesChange(type);
                                }}
                            >
                                <CloseIcon w={3} h={3} />
                            </Button>
                        </HStack>
                    </Box>
                ))}
            </Flex>
        </Stack>
    );
};
