import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { Block, BlockData, BlockVars } from '../models';
import { BLOCK } from '../queries/block';

const useBlock = (id: string) => {
    const [block, setBlock] = useState<Block>();

    const { loading, error, data } = useQuery<BlockData, BlockVars>(BLOCK, {
        variables: {
            id: id.toLowerCase(),
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
