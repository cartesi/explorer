import React, { useEffect, useState } from 'react';
import { LotteryTicket } from '../graphql/models';
import { tinyString } from '../utils/stringUtils';

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

    const themes = [
        'frogideas',
        'sugarsweets',
        'heatwave',
        'daisygarden',
        'seascape',
        'summerwarmth',
        'bythepool',
        'duskfalling',
        'berrypie',
    ];

    const tinyGraphUrl = (ticket) => {
        return `https://www.tinygraphs.com/labs/isogrids/hexa/${
            ticket.round
        }?theme=${
            themes[ticket.round % themes.length]
        }&numcolors=4&size=220&fmt=svg`;
    };

    return (
        <div className="landing-lottery-ticket" key={ticket.id}>
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
