import React, { useEffect, useState } from 'react';
import { LotteryTicket } from '../graphql/models';
import { tinyString } from '../utils/stringUtils';
import { tinyGraphUrl } from '../utils/tinygraph';

interface TicketCardProps {
    ticket: LotteryTicket;
}

const TicketCard = (props: TicketCardProps) => {
    const { ticket } = props;

    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        if (ticket) {
            setTimestamp(timeAgo(ticket.timestamp));

            setInterval(() => {
                setTimestamp(timeAgo(ticket.timestamp));
            }, 1000);
        }
    }, [ticket]);

    const timeAgo = (timestamp: number) => {
        const ticketTime = new Date(timestamp * 1000);
        const currentTime = new Date();
        const offset = (currentTime.getTime() - ticketTime.getTime()) / 1000;

        // const h = offset > 3600 ? `${Math.floor(offset / 3600)}:` : '';
        const m = offset > 60 ? `${Math.floor(offset / 60)}` : '0';
        const s = offset < 300 ? `:${Math.floor(offset % 60)}` : '';

        return m + s + ' minutes ago';
    };

    return (
        <div className="landing-lottery-ticket">
            <div className="landing-lottery-ticket-time sub-title-4">
                <img src="/images/clock.png" />
                {' ' + timestamp}
            </div>
            <div className="landing-lottery-ticket-content">
                <div className="landing-lottery-ticket-content-header body-text-2">
                    Ticket #{ticket.round}
                </div>
                <div className="landing-lottery-ticket-content-content">
                    <div className="landing-lottery-ticket-content-content-text">
                        <div className="body-text-2">
                            Claimer
                            <div className="sub-title-3 mt-1">
                                {tinyString(ticket.user.id)}
                            </div>
                        </div>
                        <div className="body-text-2 mt-4">
                            Node
                            <div className="mt-1">
                                {tinyString(ticket.worker.id)}
                            </div>
                        </div>
                    </div>

                    <img
                        className="landing-lottery-ticket-content-content-image"
                        src={tinyGraphUrl(ticket)}
                    />
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
