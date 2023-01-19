import React, { FC } from 'react';
import Head from 'next/head';
import { isString } from 'lodash';

export interface PageHead {
    name?: string;
    title: string;
    description?: string;
    isHome?: boolean;
}

const PageHead: FC<PageHead> = ({
    name = 'Stake CTSI',
    title,
    description,
    isHome = false,
}) => {
    const formattedTitle = isHome ? `${name} - ${title}` : `${title} | ${name}`;
    const hasDescription = isString(description) && description !== '';

    return (
        <Head>
            <title>{formattedTitle}</title>
            {hasDescription && (
                <meta name="description" content={description} />
            )}
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://tinygraphs.cartesi.io" />.
        </Head>
    );
};

export default PageHead;
