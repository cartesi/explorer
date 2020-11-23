import React, { useEffect, useState } from 'react';
import { LotteryTicket } from '../graphql/models';
import { tinyString } from '../utils/stringUtils';
import { tinyGraphUrl } from '../utils/tinygraph';

interface BlockCardProps {
    block: LotteryTicket;
}

const BlockCard = (props: BlockCardProps) => {
    const { block } = props;

    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        if (block) {
            setTimestamp(timeAgo(block.timestamp));

            setInterval(() => {
                setTimestamp(timeAgo(block.timestamp));
            }, 1000);
        }
    }, [block]);

    const timeAgo = (timestamp: number) => {
        const blockTime = new Date(timestamp * 1000);
        const currentTime = new Date();
        const offset = (currentTime.getTime() - blockTime.getTime()) / 1000;

        // const h = offset > 3600 ? `${Math.floor(offset / 3600)}:` : '';
        const m = offset > 60 ? `${Math.floor(offset / 60)}` : '0';
        const s = offset < 300 ? `:${Math.floor(offset % 60)}` : '';

        return m + s + ' minutes ago';
    };

    return (
        <div className="landing-lottery-block">
            <div className="landing-lottery-block-time sub-title-4">
                <img src="/images/clock.png" />
                {' ' + timestamp}
            </div>
            <div className="landing-lottery-block-content">
                <div className="landing-lottery-block-content-header body-text-2">
                    Ticket #{block.round}
                </div>
                <div className="landing-lottery-block-content-content">
                    <div className="landing-lottery-block-content-content-text">
                        <div className="body-text-2">
                            Claimer
                            <div className="sub-title-3 mt-1">
                                {tinyString(block.user.id)}
                            </div>
                        </div>
                        <div className="body-text-2 mt-4">
                            Node
                            <div className="mt-1">
                                {tinyString(block.worker.id)}
                            </div>
                        </div>
                    </div>

                    <img
                        className="landing-lottery-block-content-content-image"
                        src={tinyGraphUrl(block)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlockCard;
