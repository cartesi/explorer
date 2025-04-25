// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { IoMdClose } from 'react-icons/io';

import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    HStack,
    Icon,
    Menu,
    Portal,
    RadioGroup,
    Separator,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FC, Fragment } from 'react';
import { FilterIcon } from '../Icons';
import { useColorModeValue } from '../ui/color-mode';

export interface IPoolFiltersProps {
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
    const checkedBg = useColorModeValue('gray.50', 'dark.gray.secondary');
    const badgeBg = useColorModeValue('dark.secondary', 'white');
    const badgeColor = useColorModeValue('white', 'gray.900');
    const menuBg = useColorModeValue('white', 'dark.gray.secondary');
    const checkboxColorScheme = useColorModeValue('teal', 'gray');
    const radioColorScheme = useColorModeValue('teal', 'cyan');

    return (
        <Stack
            gap={2}
            align="center"
            direction="row"
            zIndex={'lg'}
            position="relative"
        >
            <Box>
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button
                            p={1}
                            variant="unstyled"
                            _focus={{ outline: 'none' }}
                        >
                            <HStack
                                justifyContent="space-between"
                                align="center"
                            >
                                <FilterIcon />
                                {selectedTypes.length === 0 && (
                                    <Text fontSize="md" as="span">
                                        Add Filter
                                    </Text>
                                )}
                            </HStack>
                        </Button>
                    </Menu.Trigger>

                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content p={4} backgroundColor={menuBg}>
                                {filters.map((filter, index) => (
                                    <Fragment key={index}>
                                        <Menu.ItemGroup key={index}>
                                            <Menu.Item value={filter.type}>
                                                <Heading
                                                    as="h5"
                                                    size="sm"
                                                    mb={2}
                                                >
                                                    {filter.title}
                                                </Heading>
                                                {filter.type === 'checkbox' && (
                                                    <VStack
                                                        gap={2}
                                                        align="stretch"
                                                    >
                                                        {filter.options.map(
                                                            (option, index) => (
                                                                <Box
                                                                    key={index}
                                                                    style={{
                                                                        margin: '0 calc(var(--chakra-space-4) * -1)',
                                                                    }}
                                                                    mx={-4}
                                                                >
                                                                    <Checkbox.Root
                                                                        _checked={{
                                                                            bgColor:
                                                                                checkedBg,
                                                                        }}
                                                                        gap={0}
                                                                        colorScheme={
                                                                            checkboxColorScheme
                                                                        }
                                                                        py={2}
                                                                        px={4}
                                                                        w="100%"
                                                                        flexDirection="row-reverse"
                                                                        justifyContent="space-between"
                                                                        value={
                                                                            option.value
                                                                        }
                                                                        checked={selectedTypes.includes(
                                                                            option.value
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            onSelectedTypesChange(
                                                                                option.value
                                                                            )
                                                                        }
                                                                    >
                                                                        <Checkbox.HiddenInput />
                                                                        <Checkbox.Control />
                                                                        <Checkbox.Label>
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </Checkbox.Label>
                                                                    </Checkbox.Root>
                                                                </Box>
                                                            )
                                                        )}
                                                    </VStack>
                                                )}
                                                {filter.type === 'radio' && (
                                                    <RadioGroup.Root
                                                        defaultValue={
                                                            filter.options.find(
                                                                (el) =>
                                                                    el.default ===
                                                                    true
                                                            ).value
                                                        }
                                                        onValueChange={({
                                                            value,
                                                        }) =>
                                                            onSelectedPeriodChange(
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <VStack
                                                            gap={2}
                                                            align="stretch"
                                                        >
                                                            {filter.options.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <Box
                                                                        key={
                                                                            index
                                                                        }
                                                                        style={{
                                                                            margin: '0 calc(var(--chakra-space-4) * -1)',
                                                                        }}
                                                                        mx={-4}
                                                                    >
                                                                        <RadioGroup.Item
                                                                            gap={
                                                                                0
                                                                            }
                                                                            py={
                                                                                2
                                                                            }
                                                                            px={
                                                                                4
                                                                            }
                                                                            w="100%"
                                                                            flexDirection="row-reverse"
                                                                            justifyContent="space-between"
                                                                            colorScheme={
                                                                                radioColorScheme
                                                                            }
                                                                            value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            <RadioGroup.ItemHiddenInput />
                                                                            <RadioGroup.ItemIndicator />
                                                                            <RadioGroup.ItemText>
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </RadioGroup.ItemText>
                                                                        </RadioGroup.Item>
                                                                    </Box>
                                                                )
                                                            )}
                                                        </VStack>
                                                    </RadioGroup.Root>
                                                )}
                                            </Menu.Item>
                                        </Menu.ItemGroup>
                                        {index !== filters.length - 1 && (
                                            <Separator my={4} />
                                        )}
                                    </Fragment>
                                ))}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Box>
            <Flex mb={4} direction="row" wrap="wrap">
                {selectedPeriod && (
                    <Box p={'1px'} mr={1}>
                        <HStack
                            bg={badgeBg}
                            color="header"
                            px={3}
                            py={1.5}
                            borderRadius="full"
                            display="inline-flex"
                            align="center"
                            gap={2}
                        >
                            <Text fontSize="sm" color={badgeColor}>
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
                    <Box p={'1px'} mr={1} key={index}>
                        <HStack
                            bg={badgeBg}
                            color="header"
                            px={3}
                            py={1}
                            borderRadius="full"
                            display="inline-flex"
                            align="center"
                            gap={2}
                        >
                            <Text fontSize="sm" color={badgeColor}>
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
                                <Icon
                                    as={IoMdClose}
                                    color={badgeColor}
                                    w={3}
                                    h={3}
                                />
                            </Button>
                        </HStack>
                    </Box>
                ))}
            </Flex>
        </Stack>
    );
};
