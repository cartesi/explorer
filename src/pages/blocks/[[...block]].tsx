import React, { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import useBlocks from '../../graphql/hooks/useBlocks';
import { tinyString } from '../../utils/stringUtils';
import { useCartesiToken } from '../../services/token';
import { tinyGraphUrl } from '../../utils/tinygraph';
import { Block } from '../../graphql/models';

const Blocks = () => {
    const router = useRouter();
    let { block: blockId } = router.query;
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';

    const { formatCTSI } = useCartesiToken(null, null, null);
    const { blocks, refreshBlocks, loading, filter } = useBlocks(
        blockId == '' ? {} : { id: blockId }
    );

    const [searchKey, setSearchKey] = useState<string>(blockId);

    const doSearch = () => {
        refreshBlocks(
            searchKey != ''
                ? searchKey.startsWith('0x')
                    ? {
                          id: searchKey,
                      }
                    : {
                          number: parseInt(searchKey),
                      }
                : {},
            true
        );
    };

    const loadMore = () => {
        refreshBlocks({
            ...filter,
            timestamp_lt: blocks[blocks.length - 1].timestamp,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            doSearch();
        }
    };

    const filterBlock = (block: Block) => {
        if (!filter.number && !filter.id) return true;
        if (filter.number) return filter.number == block.number;
        if (filter.id) return filter.id == block.id;
        return false;
    };

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
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn btn-dark ml-2 px-3"
                        onClick={doSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="blocks-content mt-5">
                <div className="blocks-content-block-list">
                    {blocks.filter(filterBlock).map((block) => {
                        return (
                            <div
                                className="blocks-content-block row"
                                key={block.id}
                            >
                                <div className="col-12 col-md-9">
                                    <div className="row">
                                        <div className="sub-title-4 col-4 my-1">
                                            Block
                                        </div>
                                        <div className="body-text-2 col-8 my-1">
                                            {block.chain.id}-{block.number}
                                        </div>

                                        <div className="sub-title-4 col-4 my-1">
                                            Date
                                        </div>
                                        <div className="body-text-2 col-8 my-1">
                                            {new Date(
                                                block.timestamp * 1000
                                            ).toUTCString()}
                                        </div>

                                        <div className="sub-title-4 col-4 my-1">
                                            Claimer Address
                                        </div>
                                        <div className="body-text-2 col-8 my-1">
                                            {block.producer.id}
                                        </div>

                                        <div className="sub-title-4 col-4 my-1">
                                            Node Address
                                        </div>
                                        <div className="body-text-2 col-8 my-1">
                                            {block.node.id}
                                        </div>

                                        <div className="sub-title-4 col-4 my-1">
                                            Reward
                                        </div>
                                        <div className="body-text-2 col-8 my-1">
                                            {formatCTSI(block.reward)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3 d-flex flex-column align-items-center justify-content-center pt-2">
                                    <img
                                        className="blocks-content-block-image"
                                        src={tinyGraphUrl(block)}
                                    />
                                    <div className="body-text-2 pt-1">
                                        {tinyString(block.id)}
                                    </div>
                                </div>
                            </div>
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
                            {loading && (
                                <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            )}
                            Load Previous Blocks
                        </div>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Blocks;
