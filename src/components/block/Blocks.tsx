// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import React, { FC, FunctionComponent, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    Button,
    Center,
    HStack,
    Spinner,
    StackProps,
    Tag,
    VStack,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa';
import { useColorModeValue } from '../ui/color-mode';

import Layout from '../../components/Layout';
import useBlocks from '../../graphql/hooks/useBlocks';
import { BlocksData, BlocksVars } from '../../graphql/models';
import { QueryResult } from '@apollo/client';
import BlocksChart from '../../components/BlocksChart';
import BlockCard from '../../components/block/BlockCard';
import SearchInput from '../../components/SearchInput';
import PageHeader from '../../components/PageHeader';
import { useDebounce } from '../../hooks/useDebounce';
import { useWallet } from '../wallet';

interface FilterProps {
    label: string;
    value: string;
    onDelete?: () => void;
}

const Filter: FunctionComponent<FilterProps> = ({ label, value, onDelete }) => (
    <HStack gap={4} justify="flex-start">
        <Tag.Root borderRadius="full" variant="solid">
            <Tag.Label>
                {label}: {value}
            </Tag.Label>
            <Tag.EndElement>
                <Tag.CloseTrigger onClick={onDelete} />
            </Tag.EndElement>
        </Tag.Root>
    </HStack>
);

interface BlockListProps extends StackProps {
    chainId: number;
    result: QueryResult<BlocksData, BlocksVars>;
    filterField?: 'node' | 'producer' | 'id';
    filterValue?: string;
}

const BlockList = (props: BlockListProps) => {
    const { chainId, result, filterField, filterValue, ...stackProps } = props;
    const { data, loading, fetchMore } = result;
    const blocks = data?.blocks || [];
    const highlightColor = useColorModeValue(
        'dark.gray.senary',
        'dark.gray.quaternary'
    );

    // handler for the "load more" button
    const loadMore = () => {
        if (blocks.length > 0 && fetchMore) {
            const variables = { ...result.variables };

            fetchMore({
                variables: {
                    ...variables,
                    skip: blocks.length,
                },
            });
        }
    };

    // if this is a filtered list and there are no blocks, just don't render anything
    if (filterField && blocks.length == 0) {
        return <div />;
    }

    return (
        <VStack gap={5} {...stackProps}>
            {filterField && <Filter label={filterField} value={filterValue} />}
            {blocks.map((block) => {
                return (
                    <BlockCard
                        chainId={chainId}
                        key={block.id}
                        block={block}
                        highlight={filterField}
                        highlightColor={highlightColor}
                        width="100%"
                    />
                );
            })}
            <Center>
                <Button onClick={loadMore} disabled={loading}>
                    {loading ? <Spinner /> : <FaEllipsisH />}
                </Button>
            </Center>
        </VStack>
    );
};

const Blocks: FC = () => {
    const { chainId } = useWallet();
    const params = useParams();

    let { block: blockId } = params;
    // TODO: use blockId
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';

    const [debouncedSearchKey, setDebouncedSearchKey] = useState(blockId);
    const handleDebouncedSearch = useDebounce(setDebouncedSearchKey);

    // list of all blocks, unfiltered
    const all = useBlocks(undefined, 20);

    // list of blocks filtered by producer
    const byProducer = useBlocks({ producer: debouncedSearchKey }, 20);

    // list of blocks filtered by node
    const byNode = useBlocks({ node: debouncedSearchKey }, 20);
    const pageBg = useColorModeValue('white', 'dark.gray.primary');

    return (
        <Layout>
            <PageHeader title="Blocks">
                <SearchInput
                    w={[100, 200, 400, 400]}
                    placeholder="Search by producer"
                    onSearchChange={(e) =>
                        handleDebouncedSearch(e.target.value)
                    }
                />
            </PageHeader>

            <HStack w="100%" px="6vw" py="5" bg={pageBg}>
                <BlocksChart result={all} />
            </HStack>

            {!debouncedSearchKey && (
                <BlockList
                    chainId={chainId}
                    result={all}
                    w="100%"
                    px="6vw"
                    py="5"
                    bg={pageBg}
                />
            )}
            <BlockList
                chainId={chainId}
                result={byProducer}
                filterField="producer"
                filterValue={debouncedSearchKey}
                w="100%"
                px="6vw"
                py="5"
                bg={pageBg}
            />
            <BlockList
                chainId={chainId}
                result={byNode}
                filterField="node"
                filterValue={debouncedSearchKey}
                w="100%"
                px="6vw"
                py="5"
                bg={pageBg}
            />
        </Layout>
    );
};

export default Blocks;
