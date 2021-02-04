import React, { useEffect, useState } from 'react';
import { Block } from '../graphql/models';
import { tinyString } from '../utils/stringUtils';
import { tinyGraphUrl } from '../utils/tinygraph';

interface BlockCardProps {
    block: Block;
}

const BlockCard = (props: BlockCardProps) => {
    const { block } = props;

    const [timestamp, setTimestamp] = useState<string>('');

    useEffect(() => {
        if (block) {
            setTimestamp(timeAgo(block.timestamp));

            const interval = setInterval(() => {
                setTimestamp(timeAgo(block.timestamp));
            }, 1000);

            return () => {
                clearInterval(interval);
            };
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
        <div className="block-card">
            <div className="block-card-time sub-title-4">
                <img src="/images/clock.png" className="mr-1" />
                {timestamp}
            </div>
            <div className="block-card-content">
                <div className="block-card-content-header body-text-2">
                    Block {block.chain.protocol.version}-{block.chain.number}-
                    {block.number}
                </div>
                <div className="block-card-content-content">
                    <div className="block-card-content-content-text">
                        <div className="body-text-2">
                            Producer
                            <div className="sub-title-3 mt-1">
                                {tinyString(block.producer.id)}
                            </div>
                        </div>
                        <div className="body-text-2 mt-4">
                            Node
                            <div className="mt-1">
                                {tinyString(block.node.id)}
                            </div>
                        </div>
                    </div>

                    <img
                        className="block-card-content-content-image"
                        src={tinyGraphUrl(block)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlockCard;
