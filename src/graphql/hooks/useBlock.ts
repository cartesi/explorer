import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { LotteryTicket } from '../models';
import { BLOCK } from '../queries/block';

const useBlock = (id: string) => {
    const [block, setBlock] = useState<LotteryTicket>();

    const { loading, error, data } = useQuery(BLOCK, {
        variables: {
            id,
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setBlock(data.lotteryTicket);
        }
    }, [loading, error, data]);

    return {
        block,
    };
};

export default useBlock;
