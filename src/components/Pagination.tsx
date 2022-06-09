// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { HStack, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export interface PaginationProps {
    currentPage: number;
    pages: number;
    showPageNumbers?: boolean;
    maxPageNumbers?: number;
    onPageClick: (page: number) => void;
}

const Pagination: FunctionComponent<PaginationProps> = (props) => {
    const {
        currentPage,
        pages,
        showPageNumbers = false,
        maxPageNumbers = 5,
        onPageClick,
    } = props;

    const pagination = React.useMemo(() => {
        const pageNumbers = Array.from({ length: pages })
            .fill(0)
            .map((_, i) => i);

        const start =
            currentPage < maxPageNumbers
                ? 0
                : currentPage > pages - maxPageNumbers
                ? pages - maxPageNumbers
                : currentPage - maxPageNumbers / 2;

        const end =
            currentPage < maxPageNumbers
                ? maxPageNumbers
                : currentPage > pages - maxPageNumbers
                ? pages
                : currentPage + maxPageNumbers / 2;

        return pageNumbers.slice(start, end);
    }, [currentPage, pages, maxPageNumbers]);

    return (
        <HStack>
            {currentPage > 0 && (
                <Link>
                    <ChevronLeftIcon
                        onClick={() => onPageClick(currentPage - 1)}
                    />
                </Link>
            )}
            {showPageNumbers ? (
                <>
                    {pages > 1 && currentPage > maxPageNumbers - 1 && (
                        <>
                            <PageLink
                                currentPage={currentPage}
                                index={0}
                                onPageClick={onPageClick}
                            />
                            <Text as="span" fontSize="sm">
                                &hellip;
                            </Text>
                        </>
                    )}

                    {pages > 1 &&
                        pagination.map((page) => {
                            {
                                return (
                                    <PageLink
                                        key={page}
                                        currentPage={currentPage}
                                        index={page}
                                        onPageClick={onPageClick}
                                    />
                                );
                            }
                        })}

                    {pages > 1 && currentPage <= pages - maxPageNumbers && (
                        <>
                            <Text as="span" fontSize="sm">
                                &hellip;
                            </Text>
                            <PageLink
                                currentPage={currentPage}
                                index={pages - 1}
                                onPageClick={onPageClick}
                            />
                        </>
                    )}
                </>
            ) : (
                pages > 1 && (
                    <Text>{`Page ${currentPage + 1} of ${pages}`}</Text>
                )
            )}

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

const PageLink = ({ currentPage, index, onPageClick }) => {
    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Link
            onClick={() => onPageClick(index)}
            borderRadius="full"
            minW={10}
            h={10}
            alignItems="center"
            justifyContent="center"
            display="flex"
            userSelect="none"
            _hover={{
                textDecoration: 'none',
                cursor: 'pointer',
                backgroundColor: bg,
            }}
            backgroundColor={currentPage === index ? bg : 'transparent'}
        >
            <Text>{index + 1}</Text>
        </Link>
    );
};

export default Pagination;
