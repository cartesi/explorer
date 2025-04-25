// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { ChangeEventHandler, FunctionComponent } from 'react';
import { Icon, Input, InputGroup, InputGroupProps } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';
import { FaSearch } from 'react-icons/fa';

export interface SearchInputProps extends Omit<InputGroupProps, 'children'> {
    placeholder?: string;
    onSearchChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

const SearchInput: FunctionComponent<SearchInputProps> = (props) => {
    const { placeholder = 'Search', onSearchChange, ...rest } = props;
    const placeholderColor = useColorModeValue('gray.500', 'white');
    const searchBackgroundColor = useColorModeValue(
        'white',
        'dark.gray.tertiary'
    );
    const textColor = useColorModeValue('gray.900', 'white');

    return (
        <InputGroup
            {...rest}
            startElement={<Icon as={FaSearch} color={textColor} />}
        >
            <Input
                _placeholder={{
                    color: placeholderColor,
                }}
                borderRadius="3px"
                color={textColor}
                placeholder={placeholder}
                backgroundColor={searchBackgroundColor}
                onChange={onSearchChange}
            />
        </InputGroup>
    );
};

export default SearchInput;
