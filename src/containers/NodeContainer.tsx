// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumberish } from '@ethersproject/bignumber';

import { useBalance, useBlockNumber } from '../services/eth';
import Node from '../components/node/Node';

export interface NodeContainerProps {
    user: string;
    onHire: (worker: string, deposit: BigNumberish) => void;
    onCancelHire: (worker: string) => void;
    onRetire: (worker: string) => void;
}

const NodeContainer: FC<NodeContainerProps> = (props) => {
    const { account, chainId } = useWeb3React<Web3Provider>();
    const { user, onHire, onCancelHire, onRetire } = props;

    // query block number
    const blockNumber = useBlockNumber();

    // query user ETH balance
    const balance = useBalance(account, [blockNumber]);

    return (
        <Node
            chainId={chainId}
            user={user}
            balance={balance}
            onHire={onHire}
            onCancelHire={onCancelHire}
            onRetire={onRetire}
        />
    );
};

export default NodeContainer;
