import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { LOTTERY_TICKETS } from '../queries/lottery';
import { LotteryTicket } from '../models';

const useTickets = () => {
    const [tickets, setTickets] = useState<Array<LotteryTicket>>([]);
    const [filter, setFilter] = useState({});

    const { loading, error, data, fetchMore } = useQuery(LOTTERY_TICKETS, {
        variables: {
            first: 10,
            where: filter,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshTickets = async (newFilter = null) => {
        setFilter(newFilter ? newFilter : {});
    };

    const updateTickets = (rawTickets: Array<LotteryTicket>) => {
        let newTickets = rawTickets.map((ticket) => ({
            ...ticket,
            key: ticket.id,
        }));
        newTickets = _.unionBy(tickets, newTickets, 'key');

        setTickets(newTickets.sort((a, b) => b.timestamp - a.timestamp));
    };

    useEffect(() => {
        if (fetchMore && tickets.length) {
            const interval = setInterval(() => {
                refreshTickets();
            }, 300000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, tickets]);

    useEffect(() => {
        if (!loading && !error && data) {
            updateTickets(data.lotteryTickets);
        }
    }, [loading, error, data]);

    return {
        tickets,
        loading,
        error,
        refreshTickets,
    };
};

export default useTickets;
