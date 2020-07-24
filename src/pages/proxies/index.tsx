// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default ({ proxies }) => {
    const router = useRouter();
    return (
        <div className="container">
            <Head>
                <title>Proxies</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Proxies</h1>
                <ul>
                    {proxies.map((address) => (
                        <li key={address}>
                            <Link href={`/proxies/${address}`}>
                                <a>{address}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>

            <footer></footer>
        </div>
    );
};

export const getServerSideProps = async () => {
    const proxies = ['0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0'];
    return { props: { proxies } };
};
