// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import useBlocks, {
    useNodeBlocks,
    useProducerBlocks,
} from '../../graphql/hooks/useBlocks';
import { tinyGraphUrl } from '../../utils/tinygraph';
import { formatCTSI } from '../../utils/token';
import { Block, BlocksData, BlocksVars } from '../../graphql/models';
import { QueryResult } from '@apollo/client';

interface BlockItemProps {
    block: Block;
    highlight?: 'node' | 'producer' | 'id';
}
const BlockItem = (props: BlockItemProps) => {
    const { block } = props;
    const highlight = (field: string) =>
        field === props.highlight ? 'highlight' : '';

    return (
        <div className="blocks-content-block row" key={block.id}>
            <div className="col-12 col-md-9">
                <div className="row">
                    <div className="sub-title-4 col-4 my-1">Block</div>
                    <div className="body-text-2 col-8 my-1">
                        {block.chain.id}-{block.number}
                    </div>

                    <div className="sub-title-4 col-4 my-1">Date</div>
                    <div className="body-text-2 col-8 my-1">
                        {new Date(block.timestamp * 1000).toUTCString()}
                    </div>

                    <div className="sub-title-4 col-4 my-1">Producer</div>
                    <div
                        className={`body-text-2 col-8 my-1 ${highlight(
                            'producer'
                        )}`}
                    >
                        {block.producer.id}
                    </div>

                    <div className="sub-title-4 col-4 my-1">Node</div>
                    <div
                        className={`body-text-2 col-8 my-1 ${highlight(
                            'node'
                        )}`}
                    >
                        {block.node.id}
                    </div>

                    <div className="sub-title-4 col-4 my-1">Hash</div>
                    <div
                        className={`body-text-2 col-8 my-1 ${highlight('id')}`}
                    >
                        {block.id}
                    </div>

                    <div className="sub-title-4 col-4 my-1">Reward</div>
                    <div className="body-text-2 col-8 my-1">
                        {formatCTSI(block.reward, 18)} CTSI
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-3 d-flex flex-column align-items-center justify-content-center pt-2">
                <img
                    className="blocks-content-block-image"
                    src={tinyGraphUrl(block)}
                />
            </div>
        </div>
    );
};

interface BlockListProps {
    result: QueryResult<BlocksData, BlocksVars>;
    filterField?: 'node' | 'producer' | 'id';
    filterValue?: string;
}
const BlockList = (props: BlockListProps) => {
    const blocks = props.result.data?.blocks || [];
    const loading = props.result.loading;
    const fetchMore = props.result.fetchMore;

    const loadMore = () => {
        if (blocks.length > 0 && fetchMore) {
            const oldest = blocks[blocks.length - 1];
            fetchMore({
                variables: {
                    where: { timestamp_lt: oldest.timestamp },
                },
            });
        }
    };

    // if this is a filtered list and there are no block, just don't render anything
    if (props.filterField && blocks.length == 0) {
        return <div />;
    }

    return (
        <div className="blocks-content mt-5">
            {props.filterField && (
                <span className="badge rounded-pill bg-secondary">
                    {props.filterField}: {props.filterValue}
                </span>
            )}
            <div className="blocks-content-block-list">
                {blocks.map((block) => {
                    return (
                        <BlockItem
                            key={block.id}
                            block={block}
                            highlight={props.filterField}
                        />
                    );
                })}
            </div>

            <div className="text-center">
                <button
                    type="button"
                    className="btn btn-dark"
                    onClick={loadMore}
                    disabled={loading}
                >
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        {loading ? (
                            <span
                                className="spinner-border spinner-border-sm my-1"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : (
                            <i className="fas fa-ellipsis-h my-1"></i>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

const Blocks = () => {
    const router = useRouter();
    let { block: blockId } = router.query;
    // TODO: use blockId
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';
    const [searchKey, setSearchKey] = useState<string>(blockId);

    const all = useBlocks();
    const byProducer = useProducerBlocks(searchKey);
    const byNode = useNodeBlocks(searchKey);

    return (
        <Layout className="blocks">
            <Head>
                <title>Cartesi - Blocks</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header pb-4">
                <div className="info-text-md text-white">Blocks</div>

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

            {!searchKey && <BlockList result={all} />}
            <BlockList
                result={byProducer}
                filterField="producer"
                filterValue={searchKey}
            />
            <BlockList
                result={byNode}
                filterField="node"
                filterValue={searchKey}
            />
        </Layout>
    );
};

export default Blocks;
