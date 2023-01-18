// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    HStack,
    Text,
    useColorModeValue,
    Button,
    ButtonProps,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

export interface PaginationProps {
    currentPage: number;
    pages: number;
    showPageNumbers?: boolean;
    maxPageNumbers?: number;
    onPageClick: (page: number) => void;
}

const Pagination: FC<PaginationProps> = (props) => {
    const {
        currentPage,
        pages,
        showPageNumbers = false,
        maxPageNumbers = 5,
        onPageClick,
    } = props;
    const isAfterFirstPage = currentPage > 0;
    const isBeforeLastPage = currentPage < pages - 1;
    const activeArrowBg = useColorModeValue('gray.900', 'white');
    const inactiveArrowBg = 'gray.300';
    const pageNumbers = Array.from({ length: pages }).map((_, i) => i);
    const hasMultiplePages = pages > 1;

    const pagination = React.useMemo(() => {
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
    }, [pageNumbers, currentPage, pages, maxPageNumbers]);

    return (
        <HStack maxWidth="100%">
            {hasMultiplePages && (
                <ArrowButton
                    mr={2}
                    onClick={() => {
                        if (isAfterFirstPage) {
                            onPageClick(currentPage - 1);
                        }
                    }}
                >
                    <ChevronLeftIcon
                        display="flex"
                        color={
                            isAfterFirstPage ? activeArrowBg : inactiveArrowBg
                        }
                    />
                </ArrowButton>
            )}

            {showPageNumbers ? (
                <>
                    {hasMultiplePages && currentPage > maxPageNumbers - 1 && (
                        <>
                            <PageLink
                                currentPage={currentPage}
                                index={0}
                                onPageClick={onPageClick}
                            />
                            <Text as="span">&hellip;</Text>
                        </>
                    )}

                    {hasMultiplePages &&
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

                    {hasMultiplePages &&
                        currentPage <= pages - maxPageNumbers &&
                        !pagination.includes(pageNumbers.length - 1) && (
                            <>
                                <Text as="span">&hellip;</Text>
                                <PageLink
                                    currentPage={currentPage}
                                    index={pages - 1}
                                    onPageClick={onPageClick}
                                />
                            </>
                        )}
                </>
            ) : (
                hasMultiplePages && (
                    <Text>{`Page ${currentPage + 1} of ${pages}`}</Text>
                )
            )}

            {hasMultiplePages && (
                <ArrowButton
                    marginInline={0}
                    ml={2}
                    onClick={() => {
                        if (isBeforeLastPage) {
                            onPageClick(currentPage + 1);
                        }
                    }}
                >
                    <ChevronRightIcon
                        display="flex"
                        color={
                            isBeforeLastPage ? activeArrowBg : inactiveArrowBg
                        }
                    />
                </ArrowButton>
            )}
        </HStack>
    );
};

const PageLink = ({ currentPage, index, onPageClick }) => {
    const bg = useColorModeValue('gray.80', 'header');

    return (
        <Button
            variant="ghost"
            borderRadius="full"
            minW={10}
            h={10}
            p={0}
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
            onClick={() => onPageClick(index)}
        >
            <Text fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>
                {index + 1}
            </Text>
        </Button>
    );
};

const ArrowButton: FC<ButtonProps> = ({ children, ...restProps }) => (
    <Button
        variant="ghost"
        p={0}
        minW="auto"
        minH="auto"
        userSelect="none"
        _hover={{
            background: 'transparent',
        }}
        _focus={{
            background: 'transparent',
        }}
        _active={{
            background: 'transparent',
        }}
        {...restProps}
    >
        {children}
    </Button>
);

export default Pagination;
