import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { LotteryTicket } from '../models';
import { LOTTERY_TICKET } from '../queries/ticket';

const useTicket = (id: string) => {
    const [ticket, setTicket] = useState<LotteryTicket>();

    const { loading, error, data } = useQuery(LOTTERY_TICKET, {
        variables: {
            id,
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setTicket(data.lotteryTicket);
        }
    }, [loading, error, data]);

    return {
        ticket,
    };
};

export default useTicket;
