import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { LOTTERY_TICKETS } from '../queries/lottery';
import { LotteryTicket } from '../models';

const useTickets = () => {
    const [tickets, setTickets] = useState<Array<LotteryTicket>>([]);

    const { loading, error, data, fetchMore } = useQuery(LOTTERY_TICKETS, {
        variables: {
            first: 10,
            where: { timestamp_gt: 0 },
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshTickets = async (continueLoading = true) => {
        let { data }: any = await fetchMore({
            variables: {
                where: continueLoading
                    ? {
                          timestamp_lt: tickets[tickets.length - 1].timestamp,
                      }
                    : {},
            },
        });

        if (data) {
            const newTickets = _.unionBy(
                data.lotteryTickets.map((ticket) => ({
                    ...ticket,
                    key: ticket.id,
                })),
                tickets,
                'key'
            );

            setTickets(newTickets.sort((a, b) => b.timestamp - a.timestamp));
        }
    };

    useEffect(() => {
        if (fetchMore && tickets.length) {
            const interval = setInterval(() => {
                refreshTickets(false);
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, tickets]);

    useEffect(() => {
        if (!loading && !error && data) {
            const newTickets = data.lotteryTickets.map((ticket) => {
                return {
                    ...ticket,
                    key: ticket.id,
                };
            });

            setTickets(newTickets.sort((a, b) => b.timestamp - a.timestamp));
        }
    }, [loading, error, data]);

    return {
        tickets,
        refreshTickets,
    };
};

export default useTickets;
