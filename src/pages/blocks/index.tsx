import React from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import { Table } from 'antd';

import { ALL_PRIZES } from '../../graphql/prizes';

const Blocks = () => {
    const { loading, error, data, fetchMore, networkStatus } = useQuery(
        ALL_PRIZES,
        {
            variables: {
                first: 10,
                skip: 0,
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const loadingMorePrizes = networkStatus === NetworkStatus.fetchMore;

    const loadMorePrizes = () => {
        fetchMore({
            variables: {
                where: {
                    time_gt: allPrizes[allPrizes.length - 1].time,
                },
            },
        });
    };

    const { allPrizes } = data;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Winner',
            dataIndex: 'winner',
            key: 'winner',
        },
        {
            title: 'Prize',
            dataIndex: 'prize',
            key: 'prize',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={allPrizes} />
        </div>
    );
};

export default Blocks;
