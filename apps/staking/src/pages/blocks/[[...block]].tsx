// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, FunctionComponent, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    Center,
    HStack,
    Spinner,
    StackProps,
    Tag,
    TagLabel,
    TagCloseButton,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa';

import Layout from '../../components/Layout';
import useBlocks from '../../graphql/hooks/useBlocks';
import { BlocksData, BlocksVars } from '../../graphql/models';
import { QueryResult } from '@apollo/client';
import BlocksChart from '../../components/BlocksChart';
import BlockCard from '../../components/block/BlockCard';
import SearchInput from '../../components/SearchInput';
import PageHeader from '../../components/PageHeader';
import PageHead from '../../components/PageHead';

interface FilterProps {
    label: string;
    value: string;
    onDelete?: () => void;
}

const Filter: FunctionComponent<FilterProps> = ({ label, value, onDelete }) => (
    <HStack spacing={4} justify="flex-start">
        <Tag borderRadius="full" variant="solid">
            <TagLabel>
                {label}: {value}
            </TagLabel>
            <TagCloseButton onClick={onDelete} />
        </Tag>
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
        'lightyellow',
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
        <VStack spacing={5} {...stackProps}>
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

interface BlocksProps {
    chainId: number;
}

const Blocks: FC<BlocksProps> = ({ chainId }) => {
    const router = useRouter();

    let { block: blockId } = router.query;
    // TODO: use blockId
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';

    const [searchKey, setSearchKey] = useState<string>(blockId);

    // list of all blocks, unfiltered
    const all = useBlocks(undefined, 20);

    // list of blocks filtered by producer
    const byProducer = useBlocks({ producer: searchKey }, 20);

    // list of blocks filtered by node
    const byNode = useBlocks({ node: searchKey }, 20);
    const pageBg = useColorModeValue('white', 'dark.gray.primary');

    return (
        <Layout>
            <PageHead title="Cartesi Proof of Stake Blocks" />

            <PageHeader title="Blocks">
                <SearchInput
                    w={[100, 200, 400, 400]}
                    onSearchChange={(e) => setSearchKey(e.target.value)}
                />
            </PageHeader>

            <HStack w="100%" px="6vw" py="5" bg={pageBg}>
                <BlocksChart result={all} />
            </HStack>

            {!searchKey && (
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
                filterValue={searchKey}
                w="100%"
                px="6vw"
                py="5"
                bg={pageBg}
            />
            <BlockList
                chainId={chainId}
                result={byNode}
                filterField="node"
                filterValue={searchKey}
                w="100%"
                px="6vw"
                py="5"
                bg={pageBg}
            />
        </Layout>
    );
};

export default Blocks;
