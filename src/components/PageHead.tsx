import { isString } from 'lodash';
import Head from 'next/head';
import { FC } from 'react';
import { getTinyGraphsServiceUrl } from '../utils/tinygraph';

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
            <link rel="preconnect" href={getTinyGraphsServiceUrl()} />.
        </Head>
    );
};

export default PageHead;
