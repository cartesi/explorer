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
            where: {},
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshTickets = async (filter) => {
        let { data }: any = await fetchMore({
            variables: {
                where: filter ? filter : {},
            },
        });

        if (data) {
            const newTickets = data.lotteryTickets.map((ticket) => ({
                ...ticket,
                key: ticket.id,
            }));

            setTickets(newTickets.sort((a, b) => b.timestamp - a.timestamp));
        }
    };

    useEffect(() => {
        if (fetchMore && tickets.length) {
            const interval = setInterval(() => {
                refreshTickets(false);
            }, 300000);

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
