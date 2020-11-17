import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import useTickets from '../../graphql/hooks/useTickets';
import { tinyString } from '../../utils/stringUtils';
import useTicket from '../../graphql/hooks/useTicket';
import { useCartesiToken } from '../../services/token';
import { tinyGraphUrl } from '../../utils/tinygraph';
import Link from 'next/link';

const Ticket = () => {
    const router = useRouter();
    let { ticket: ticketId } = router.query;
    ticketId = ticketId[0] as string;

    const { formatCTSI } = useCartesiToken(null, null, null);
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
                {ticket && (
                    <div className="tickets-content-ticket row">
                        <div className="col-9 row">
                            <div className="sub-title-4 col-4">Date</div>
                            <div className="body-text-2 col-8">
                                {new Date(
                                    ticket.timestamp * 1000
                                ).toUTCString()}
                            </div>

                            <div className="sub-title-4 col-4">
                                Claimer Address
                            </div>
                            <div className="body-text-2 col-8">
                                {ticket.user.id}
                            </div>

                            <div className="sub-title-4 col-4">
                                Node Address
                            </div>
                            <div className="body-text-2 col-8">
                                {ticket.worker.id}
                            </div>

                            <div className="sub-title-4 col-4">Reward</div>
                            <div className="body-text-2 col-8">
                                {formatCTSI(ticket.userPrize)}
                            </div>
                        </div>
                        <div className="col-3 d-flex flex-column align-items-center">
                            <img
                                className="landing-lottery-ticket-content-content-image"
                                src={tinyGraphUrl(ticket)}
                            />
                            <div className="body-text-2 pt-1">
                                {tinyString(ticketId)}
                            </div>
                        </div>
                    </div>
                )}

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
                                        <td>
                                            <Link
                                                href={'/tickets/' + ticket.id}
                                            >
                                                {ticket.round}
                                            </Link>
                                        </td>
                                        <td>
                                            {new Date(
                                                ticket.timestamp * 1000
                                            ).toUTCString()}
                                        </td>
                                        <td>{tinyString(ticket.user.id)}</td>
                                        <td>{tinyString(ticket.worker.id)}</td>
                                        <td>{formatCTSI(ticket.userPrize)}</td>
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
