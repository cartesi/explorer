import React, { FC } from 'react';
import { Flex, HStack, Spinner, Text, useToken } from '@chakra-ui/react';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { isObject, maxBy, minBy } from 'lodash';
import { StakingPoolUserHistory } from '../../graphql/models';
import { useColorMode, useColorModeValue } from '../ui/color-mode';
import { endOfMonth, startOfMonth } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
});

const tooltipTimeFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

export interface UsersChartProps {
    data: StakingPoolUserHistory[];
    month: Date;
    totalUsers: number;
    loading: boolean;
}

const UsersChart: FC<UsersChartProps> = (props) => {
    const { data: initialData, month, totalUsers, loading } = props;

    const data =
        initialData.length > 1
            ? initialData
            : initialData.length === 1
            ? [
                  ...initialData,
                  {
                      ...initialData[0],
                      timestamp: Math.floor(endOfMonth(month).getTime() / 1000),
                  },
              ]
            : [
                  {
                      timestamp: Math.floor(
                          startOfMonth(month).getTime() / 1000
                      ),
                      totalUsers,
                  },
                  {
                      timestamp: Math.floor(endOfMonth(month).getTime() / 1000),
                      totalUsers,
                  },
              ];
    const labels = data.map((item: StakingPoolUserHistory) =>
        dateTimeFormat.format(item.timestamp * 1000)
    );
    const hasData = initialData.length > 0;
    const hasUsers = totalUsers > 0;
    const minUsers =
        hasData && initialData.length > 1
            ? minBy(initialData, (item) => item.totalUsers).totalUsers
            : 0;
    const maxUsers = hasData
        ? maxBy(initialData, (item) => item.totalUsers).totalUsers
        : totalUsers;
    const visibleUsers = maxUsers - minUsers;

    const round = (number: number, increment: number) =>
        Math.ceil(number / increment) * increment;

    const stepSize =
        visibleUsers >= 100
            ? 50
            : visibleUsers >= 50
            ? 20
            : visibleUsers >= 20
            ? 2
            : 1;

    const maxY =
        stepSize > 1 && maxUsers < round(maxUsers, stepSize)
            ? round(maxUsers, stepSize)
            : maxUsers;

    const minY =
        stepSize > 1 && minUsers > round(minUsers, stepSize)
            ? round(minUsers, stepSize)
            : stepSize === 2 && minUsers % 2 !== 0
            ? minUsers - 1
            : minUsers;

    const { colorMode } = useColorMode();
    const [lineColorFromCssVar, tickLightColor, tickDarkColor] = useToken(
        'colors',
        [
            colorMode === 'light' ? 'dark.secondary' : 'dark.primary',
            'gray.700',
            'whiteAlpha.800',
        ]
    );
    const tickColor = useColorModeValue(tickLightColor, tickDarkColor);
    const containerMinHeight = hasUsers ? '22rem' : '6rem';

    return (
        <Flex
            minHeight={containerMinHeight}
            justifyContent="center"
            alignItems="center"
        >
            {loading ? (
                <HStack justify="center">
                    <Spinner />
                    <Text>Loading...</Text>
                </HStack>
            ) : hasUsers ? (
                <Line
                    data-testid="users-chart"
                    data={{
                        labels,
                        datasets: [
                            {
                                data: data.map(
                                    (item: StakingPoolUserHistory) =>
                                        item.totalUsers
                                ),
                                borderColor: lineColorFromCssVar,
                                backgroundColor: lineColorFromCssVar,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        clip: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            title: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    title: ([model]: {
                                        dataIndex: number;
                                    }[]) => {
                                        const item = data[model.dataIndex];

                                        return tooltipTimeFormat.format(
                                            item.timestamp * 1000
                                        );
                                    },
                                    label: (model: { dataIndex: number }) => {
                                        const item = data[model.dataIndex];

                                        return `${item.totalUsers} users`;
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false,
                                },
                                border: {
                                    color: tickColor,
                                },
                                ticks: {
                                    callback: (_, index) => {
                                        const item = data[index];

                                        return isObject(item)
                                            ? dateTimeFormat.format(
                                                  item.timestamp * 1000
                                              )
                                            : '';
                                    },
                                    color: tickColor,
                                },
                            },
                            y: {
                                max: maxY,
                                min: minY,
                                grid: {
                                    display: false,
                                },
                                border: {
                                    color: tickColor,
                                },
                                ticks: {
                                    stepSize,
                                    color: tickColor,
                                },
                            },
                        },
                    }}
                />
            ) : (
                <HStack justify="center">
                    <Text>No users</Text>
                </HStack>
            )}
        </Flex>
    );
};

export default UsersChart;
