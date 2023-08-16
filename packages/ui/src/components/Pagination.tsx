// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { HStack, Text, useColorModeValue, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { GhostButton } from './GhostButton';

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
        ...restProps
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
        <HStack maxWidth="100%" {...restProps}>
            {hasMultiplePages && (
                <GhostButton
                    mr={2}
                    title="Previous page"
                    onClick={() => {
                        if (isAfterFirstPage) {
                            onPageClick(currentPage - 1);
                        }
                    }}
                >
                    <ChevronLeftIcon
                        display="flex"
                        width={3}
                        height={3}
                        color={
                            isAfterFirstPage ? activeArrowBg : inactiveArrowBg
                        }
                    />
                </GhostButton>
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
                <GhostButton
                    marginInline={0}
                    ml={2}
                    title="Next page"
                    onClick={() => {
                        if (isBeforeLastPage) {
                            onPageClick(currentPage + 1);
                        }
                    }}
                >
                    <ChevronRightIcon
                        display="flex"
                        width={3}
                        height={3}
                        color={
                            isBeforeLastPage ? activeArrowBg : inactiveArrowBg
                        }
                    />
                </GhostButton>
            )}
        </HStack>
    );
};

export type PageLinkProps = {
    currentPage: number;
    index: number;
    onPageClick: (n: number) => void;
};

export const PageLink = ({
    currentPage,
    index,
    onPageClick,
}: PageLinkProps) => {
    const color = useColorModeValue('gray.900', 'black');
    const bg = useColorModeValue('gray.80', 'dark.gray.senary');
    const isActive = currentPage === index;

    return (
        <Button
            variant="ghost"
            borderRadius="full"
            minW={8}
            h={8}
            p={0}
            alignItems="center"
            justifyContent="center"
            display="flex"
            userSelect="none"
            _hover={{
                textDecoration: 'none',
                cursor: 'pointer',
                color,
                backgroundColor: bg,
            }}
            color={isActive ? color : undefined}
            backgroundColor={isActive ? bg : 'transparent'}
            onClick={() => onPageClick(index)}
        >
            <Text fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>
                {index + 1}
            </Text>
        </Button>
    );
};

export default Pagination;
