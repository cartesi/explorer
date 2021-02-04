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

const colors = [
    '#5dd54b',
    '#e84586',
    '#fa4c03',
    '#b0bf18',
    '#007179',
    '#f6e340',
    '#5087f3',
    '#8d4ada',
    '#f70005',
    '#000000',
];

const BlocksChart = (props: BlocksChartProps) => {
    const blocks = props.result.data?.blocks || [];

    // group blocks per chain
    const blocksPerChain = _.groupBy(blocks, (block) => block.chain.number);

    // create one Line per chain
    const chains = Object.keys(blocksPerChain).map((chainId) => {
        // get chain blocks
        const blocks = blocksPerChain[chainId];

        // get important data for chart
        const data = blocks.map((block) => ({
            id: block.id,
            timestamp: block.timestamp,
            difficulty: bigInt(block.difficulty).divide(1e18),
        }));
        // follow tinygraphs color pattern
        const id = parseInt(chainId);
        const color = id >= 0 && id < colors.length ? colors[id] : colors[0];

        // create scatter plot
        return (
            <Scatter
                key={chainId}
                className=""
                name={`Chain ${chainId}`}
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

    const difficultyFormat = (difficulty: bigInt.BigInteger): string => {
        const nDifficulty = parseFloat(difficulty.toString());

        if (nDifficulty >= 1e9) {
            return (nDifficulty / 1e9).toString() + 'G';
        } else if (nDifficulty >= 1e6) {
            return (nDifficulty / 1e6).toString() + 'M';
        } else if (nDifficulty >= 1e3) {
            return (nDifficulty / 1e3).toString() + 'K';
        }
        return nDifficulty.toString();
    };

    const tooltipFormatter = (value, name, props) => {
        if (name === 'Difficulty') {
            return difficultyFormat(value);
        } else if (name === 'Time') {
            return DateTime.fromMillis(value * 1000)
                .toUTC()
                .toLocaleString(DateTime.DATETIME_FULL);
        }
        return value;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ left: 30 }}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey="timestamp"
                    domain={['auto', 'auto']}
                    tickFormatter={timestampFormat}
                    name="Time"
                    type="number"
                    tick={{ width: 100 }}
                />
                <YAxis
                    dataKey="difficulty"
                    name="Difficulty"
                    tickFormatter={difficultyFormat}
                    domain={['auto', 'auto']}
                    type="number"
                />
                <Legend
                    wrapperStyle={{
                        paddingTop: 15,
                    }}
                />
                {chains}
                <Tooltip formatter={tooltipFormatter} />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default BlocksChart;
