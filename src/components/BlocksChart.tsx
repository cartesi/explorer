// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import type { useQuery } from '@apollo/client/react';
import { intlFormat } from 'date-fns';
import _ from 'lodash';
import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { BlocksData, BlocksVars } from '../graphql/models';
import { useColorMode, useColorModeValue } from './ui/color-mode';

export interface BlocksChartProps {
    result: useQuery.Result<BlocksData, BlocksVars>;
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
    const { colorMode } = useColorMode();
    const defaultColor = colorMode === 'light' ? '#008DA5' : '#00f6ff';

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
        const color = id > 0 && id < colors.length ? colors[id] : defaultColor;

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
        return intlFormat(new Date(timestamp * 1000), {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'UTC',
        });
    };

    const tooltipFormatter = (value, name) => {
        if (name === 'Difficulty') {
            return value;
        } else if (name === 'Time') {
            return intlFormat(new Date(value * 1000), {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'UTC',
                timeZoneName: 'short',
            });
        }
        return value;
    };

    const bg = useColorModeValue('white', '#161618'); // dark.gray.primary = #161618
    return (
        <ResponsiveContainer height={300}>
            <ScatterChart>
                <CartesianGrid stroke="#ccc" fill={bg} />
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
