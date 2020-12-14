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
import { DateTime } from 'luxon';
import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    Scatter,
    ScatterChart,
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
        // get chain blocks
        const blocks = blocksPerChain[chainId];

        // get important data for chart
        const data = blocks.map((block) => ({
            id: block.id,
            timestamp: block.timestamp,
            difficulty: bigInt(block.difficulty),
        }));

        // TODO: how to generate random color
        const color = '#8884d8';

        // create scatter plot
        return (
            <Scatter
                key={chainId}
                name={`Chain ${chainId} Difficulty`}
                data={data}
                line={{ stroke: color }}
                lineJointType="stepBefore"
                lineType="joint"
                fill={color}
            />
        );
    });

    const timestampFormat = (timestamp: number): string => {
        const date = DateTime.fromMillis(timestamp * 1000);
        return date.toUTC().toLocaleString(DateTime.DATETIME_SHORT);
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey="timestamp"
                    domain={['auto', 'auto']}
                    tickFormatter={timestampFormat}
                    name="Time"
                    type="number"
                />
                <YAxis
                    dataKey="difficulty"
                    name="Difficulty"
                    domain={['auto', 'auto']}
                    type="number"
                />
                <Legend />
                {chains}
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default BlocksChart;
