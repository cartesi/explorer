// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import bigInt from 'big-integer';
import _ from 'lodash';
import {
    CartesianGrid,
    LineChart,
    Line,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { BlocksData, BlocksVars } from '../graphql/models';
import { QueryResult } from '@apollo/client';

export interface BlocksChartProps {
    result: QueryResult<BlocksData, BlocksVars>;
}

const BlocksChart = (props: BlocksChartProps) => {
    const blocks = props.result.data?.blocks || [];

    // group blocks per chain
    const blocksPerChain = _.groupBy(blocks, (block) => block.chain.id);

    // create one Line per chain
    const chains = Object.keys(blocksPerChain).map((chainId) => {
        const blocks = blocksPerChain[chainId];
        const data = blocks.map((block) => ({
            id: block.id,
            date: new Date(block.timestamp * 1000),
            difficulty: bigInt(block.difficulty),
        }));
        return (
            <Line
                name={`Chain ${chainId} Difficulty`}
                type="linear"
                data={data}
                dataKey="difficulty"
            />
        );
    });

    return (
        <LineChart width={550} height={300}>
            {chains}
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
        </LineChart>
    );
};

export default BlocksChart;
