// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { ChangeEventHandler, FunctionComponent } from 'react';
import {
    InputGroupProps,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export interface SearchInputProps extends InputGroupProps {
    placeholder?: string;
    onSearchChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

const SearchInput: FunctionComponent<SearchInputProps> = (props) => {
    const { placeholder = 'Search', onSearchChange, ...rest } = props;
    return (
        <InputGroup {...rest}>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input placeholder={placeholder} onChange={onSearchChange} />
        </InputGroup>
    );
};

export default SearchInput;
