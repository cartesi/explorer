import React from 'react';
import Head from 'next/head';

export interface PageHead {
    name?: string;
    title: string;
    isHome?: boolean;
}

const PageHead = ({ name = 'Stake CTSI', title, isHome = false }) => {
    const formattedTitle = isHome ? `${name} - ${title}` : `${title} | ${name}`;

    return (
        <Head>
            <title>{formattedTitle}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default PageHead;
