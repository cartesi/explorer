// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useContext, useEffect, useState } from 'react';
import Web3Context from '../components/Web3Context';
import { getChain, IChainData } from '../services/chain';
import { Space, Typography } from 'antd';

const SelectedChain = () => {
    const { chainId } = useContext(Web3Context);
    const [chain, setChain] = useState<IChainData>(undefined);

    useEffect(() => {
        getChain(chainId).then(setChain);
    }, [chainId]);

    return (
        <Space style={{ float: 'right' }}>
            <b style={{ color: 'white' }}>Network: </b>
            {chain && (
                <Typography.Text style={{ color: 'white' }}>
                    {chain.name}
                </Typography.Text>
            )}
        </Space>
    );
};

export default SelectedChain;
