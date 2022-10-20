import React from 'react';
import Head from 'next/head';
import { isString } from 'lodash';

export interface PageHead {
    name?: string;
    title?: string;
}

const PageHead = ({ name = 'Explorer', title }) => {
    const formattedTitle =
        isString(title) && title !== '' ? `${name} - ${title}` : name;

    return (
        <Head>
            <title>{formattedTitle}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default PageHead;
