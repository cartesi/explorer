// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    createListCollection,
    HStack,
    Portal,
    Select,
    Text,
} from '@chakra-ui/react';

export interface PerPageSelectProps {
    value: number;
    options: number[];
    onChange: (value: string) => void;
}

const PerPageSelect: FC<PerPageSelectProps> = (props) => {
    const { value, options, onChange } = props;
    const selectOptions = createListCollection({
        items: options.map((option) => ({
            label: option.toString(),
            value: option.toString(),
        })),
    });

    return (
        <HStack
            alignItems="center"
            mr={{ base: 0, md: 10 }}
            mb={{ base: 4, md: 0 }}
        >
            <Text fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>
                Rows per page
            </Text>

            <Select.Root
                value={[value.toString()]}
                width="4.625rem"
                borderRadius={0}
                fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                onValueChange={({ value }) => {
                    onChange(value[0]);
                }}
                collection={selectOptions}
                size="sm"
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {selectOptions.items.map((option) => (
                                <Select.Item key={option.value} item={option}>
                                    {option.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </HStack>
    );
};

export default PerPageSelect;
