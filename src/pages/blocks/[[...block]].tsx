import React, { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import useBlocks from '../../graphql/hooks/useBlocks';
import { tinyString } from '../../utils/stringUtils';
import { useCartesiToken } from '../../services/token';
import { tinyGraphUrl } from '../../utils/tinygraph';

const Block = () => {
    const router = useRouter();
    let { block: blockId } = router.query;
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';

    const { formatCTSI } = useCartesiToken(null, null, null);
    const { blocks, refreshBlocks, loading, filter } = useBlocks(
        blockId == '' ? {} : { id: blockId }
    );

    const [searchKey, setSearchKey] = useState(blockId);

    const doSearch = () => {
        refreshBlocks(
            searchKey != ''
                ? searchKey.startsWith('0x')
                    ? {
                          id: searchKey,
                      }
                    : {
                          round: searchKey,
                      }
                : {},
            true
        );
    };

    const loadMore = () => {
        let filter: any = {
            timestamp_lt: blocks[blocks.length - 1].timestamp,
        };

        if (searchKey != '') {
            filter = {
                ...filter,
                id: searchKey,
            };
        }
        refreshBlocks(filter);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            doSearch();
        }
    };

    const filterBlock = (block) => {
        if (!filter.round && !filter.id) return true;
        if (filter.round) return filter.round == block.round;
        if (filter.id) return filter.id == block.id;
        return false;
    };

    return (
        <Layout className="blocks">
            <Head>
                <title>Cartesi - Blocks</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="blocks-header d-flex justify-content-between align-items-center py-3">
                <div className="overline text-white">Blocks</div>

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

            <div className="blocks-content">
                <div className="blocks-content-block-list">
                    {blocks.filter(filterBlock).map((block) => {
                        return (
                            <div
                                className="blocks-content-block row"
                                key={block.id}
                            >
                                <div className="col-9 row">
                                    <div className="sub-title-4 col-4">
                                        Block #
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {block.round}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Date
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {new Date(
                                            block.timestamp * 1000
                                        ).toUTCString()}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Claimer Address
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {block.user.id}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Node Address
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {block.worker.id}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Reward
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {formatCTSI(block.userPrize)}
                                    </div>
                                </div>
                                <div className="col-3 d-flex flex-column align-items-center">
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

export default Block;
