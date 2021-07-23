// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    Button,
    Center,
    Heading,
    HStack,
    Spinner,
    StackProps,
    Tag,
    TagLabel,
    TagCloseButton,
    VStack,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa';

import Layout from '../../components/Layout';
import useBlocks, {
    useNodeBlocks,
    useProducerBlocks,
} from '../../graphql/hooks/useBlocks';
import { BlocksData, BlocksVars } from '../../graphql/models';
import { QueryResult } from '@apollo/client';
import BlocksChart from '../../components/BlocksChart';
import BlockCard from '../../components/block/BlockCard';

interface FilterProps {
    label: string;
    value: string;
    onDelete?: () => void;
}

const Filter: FunctionComponent<FilterProps> = ({ label, value, onDelete }) => (
    <HStack spacing={4}>
        {['sm', 'md', 'lg'].map((size) => (
            <Tag
                size={size}
                key={size}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
            >
                <TagLabel>
                    {label}: {value}
                </TagLabel>
                <TagCloseButton onClick={onDelete} />
            </Tag>
        ))}
    </HStack>
);

interface BlockListProps extends StackProps {
    result: QueryResult<BlocksData, BlocksVars>;
    filterField?: 'node' | 'producer' | 'id';
    filterValue?: string;
}

const BlockList = (props: BlockListProps) => {
    const { result, filterField, filterValue, ...stackProps } = props;
    const { data, loading, fetchMore } = result;
    const blocks = data?.blocks || [];

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
        <VStack spacing={5} {...stackProps}>
            {filterField && <Filter label={filterField} value={filterValue} />}
            {blocks.map((block) => {
                return (
                    <BlockCard
                        key={block.id}
                        block={block}
                        highlight={filterField}
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

const Blocks = () => {
    const router = useRouter();

    let { block: blockId } = router.query;
    // TODO: use blockId
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';

    const [searchKey, setSearchKey] = useState<string>(blockId);

    // list of all blocks, unfiltered
    const all = useBlocks();

    // list of blocks filtered by producer
    const byProducer = useProducerBlocks(searchKey);

    // list of blocks filtered by node
    const byNode = useNodeBlocks(searchKey);

    return (
        <Layout>
            <Head>
                <title>Cartesi - Blocks</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="d-flex flex-row align-items-center justify-content-start">
                    <div className="input-with-icon input-group">
                        <span>
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Heading w="100%" px="6vw" py="5">
                Difficulty per Chain
            </Heading>
            <BlocksChart result={all} />

            <Heading w="100%" px="6vw" py="5">
                Blocks
            </Heading>
            {!searchKey && <BlockList result={all} w="100%" px="6vw" py="5" />}
            <BlockList
                result={byProducer}
                filterField="producer"
                filterValue={searchKey}
                w="100%"
                px="6vw"
                py="5"
            />
            <BlockList
                result={byNode}
                filterField="node"
                filterValue={searchKey}
                w="100%"
                px="6vw"
                py="5"
            />
        </Layout>
    );
};

export default Blocks;
