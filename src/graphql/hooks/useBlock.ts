import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { Block } from '../models';
import { BLOCK } from '../queries/block';

const useBlock = (id: string) => {
    const [block, setBlock] = useState<Block>();

    const { loading, error, data } = useQuery(BLOCK, {
        variables: {
            id,
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setBlock(data.block);
        }
    }, [loading, error, data]);

    return {
        block,
    };
};

export default useBlock;
