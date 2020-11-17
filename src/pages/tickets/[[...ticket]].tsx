import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import useTickets from '../../graphql/hooks/useTickets';
import { tinyString } from '../../utils/stringUtils';
import useTicket from '../../graphql/hooks/useTicket';

const Ticket = () => {
    const router = useRouter();
    let { ticket: ticketId } = router.query;
    ticketId = ticketId as string;

    const { tickets, refreshTickets } = useTickets();
    const { ticket } = useTicket(ticketId);

    return (
        <Layout className="tickets">
            <Head>
                <title>Cartesi - Tickets</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="tickets-header"></div>

            <div className="tickets-content">
                {ticket && <div className="tickets-content-ticket row"></div>}

                <div className="tickets-content-ticket-list">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="table-header-text">Ticket#</th>
                                <th className="table-header-text">Date</th>
                                <th className="table-header-text">
                                    Claimer Address
                                </th>
                                <th className="table-header-text">
                                    Node Address
                                </th>
                                <th className="table-header-text">
                                    Reward (CTSI)
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.map((ticket) => {
                                const now = new Date();
                                const uptimeDays = Math.ceil(
                                    (now.getTime() - ticket.timestamp * 1000) /
                                        1000 /
                                        60 /
                                        24
                                );
                                return (
                                    <tr key={ticket.id} className="body-text-2">
                                        <td>{ticket.round}</td>
                                        <td>
                                            {new Date(
                                                ticket.timestamp * 1000
                                            ).toUTCString()}
                                        </td>
                                        <td>{tinyString(ticket.user.id)}</td>
                                        <td>{tinyString(ticket.worker.id)}</td>
                                        <td>{ticket.userPrize}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Ticket;
