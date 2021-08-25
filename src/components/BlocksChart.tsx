// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
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
import { QueryResult } from '@apollo/client';
import { BlocksData, BlocksVars } from '../graphql/models';

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
    const blocksPerChain = _.groupBy(
        blocks,
        (block) => `${block.chain.protocol.version}-${block.chain.number}`
    );

    // unique list of protocols
    const protocols = blocks
        .map((b) => b.chain.protocol.version)
        .filter((value, index, array) => array.indexOf(value) === index);

    // create one y-axis for each protocol
    const yAxes = protocols.map((protocol) => (
        <YAxis
            yAxisId={protocol}
            key={protocol}
            dataKey="difficulty"
            name="Difficulty"
            tickFormatter={(v: number) => v.toExponential(1)}
            domain={['auto', 'auto']}
            orientation={protocol == 1 ? 'left' : 'right'}
            width={80}
            type="number"
        />
    ));

    // create one Line per chain
    const chains = Object.keys(blocksPerChain).map((chainId) => {
        // get chain blocks
        const blocks = blocksPerChain[chainId];
        const chain = blocks[0].chain;
        const protocol = chain.protocol;

        // get important data for chart
        const data = blocks.map((block) => ({
            id: block.id,
            timestamp: block.timestamp,
            difficulty: parseFloat(block.difficulty),
        }));

        // follow tinygraphs color pattern
        const id = chain.number;
        const color = id >= 0 && id < colors.length ? colors[id] : colors[0];

        // create scatter plot
        return (
            <Scatter
                key={chainId}
                yAxisId={protocol.version}
                className=""
                name={`Chain ${chainId}`}
                data={data}
                line={{ stroke: color }}
                lineJointType="stepAfter"
                lineType="joint"
                fill={color}
            />
        );
    });

    const timestampFormat = (timestamp: number): string => {
        const date = DateTime.fromMillis(timestamp * 1000);
        return date.toUTC().toLocaleString(DateTime.DATETIME_SHORT);
    };

    const tooltipFormatter = (value, name) => {
        if (name === 'Difficulty') {
            return value;
        } else if (name === 'Time') {
            return DateTime.fromMillis(value * 1000)
                .toUTC()
                .toLocaleString(DateTime.DATETIME_FULL);
        }
        return value;
    };

    return (
        <ResponsiveContainer height={300}>
            <ScatterChart>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey="timestamp"
                    domain={['auto', 'auto']}
                    tickFormatter={timestampFormat}
                    name="Time"
                    type="number"
                    scale="time"
                    tick={{ width: 100 }}
                />
                {yAxes}
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
