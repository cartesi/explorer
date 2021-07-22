// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { HStack, Link, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export interface PaginationProps {
    currentPage: number;
    pages: number;
    onPageClick: (page: number) => void;
}

const Pagination: FunctionComponent<PaginationProps> = (props) => {
    const { currentPage, pages, onPageClick } = props;

    return (
        <HStack>
            {currentPage > 0 && (
                <Link>
                    <ChevronLeftIcon
                        onClick={() => onPageClick(currentPage - 1)}
                    />
                </Link>
            )}
            {pages > 1 && <Text>{`Page ${currentPage + 1} of ${pages}`}</Text>}
            {currentPage < pages - 1 && (
                <Link>
                    <ChevronRightIcon
                        onClick={() => onPageClick(currentPage + 1)}
                    />
                </Link>
            )}
        </HStack>
    );
};

export default Pagination;
