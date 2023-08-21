import React, { FC } from 'react';
import {
    HStack,
    Spinner,
    Text,
    Flex,
    useColorModeValue,
    useToken,
    useColorMode,
} from '@chakra-ui/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { isObject, minBy, maxBy } from 'lodash';
import { DateTime } from 'luxon';
import { StakingPoolUserHistory } from '../../graphql/models';

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
    month: DateTime;
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
                      timestamp: Math.floor(
                          DateTime.fromMillis(month.toMillis())
                              .endOf('month')
                              .toMillis() / 1000
                      ),
                  },
              ]
            : [
                  {
                      timestamp: Math.floor(
                          DateTime.fromMillis(month.toMillis())
                              .startOf('month')
                              .toMillis() / 1000
                      ),
                      totalUsers,
                  },
                  {
                      timestamp: Math.floor(
                          DateTime.fromMillis(month.toMillis())
                              .endOf('month')
                              .toMillis() / 1000
                      ),
                      totalUsers,
                  },
              ];
    const labels = data.map((item) =>
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

    const round = (number, increment) =>
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
                                data: data.map((item) => item.totalUsers),
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
                                    borderColor: tickColor,
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
                                    borderColor: tickColor,
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
