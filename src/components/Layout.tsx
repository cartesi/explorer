// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import NavBar from './NavBar';

import {
    allLotteryTicketsQueryVars,
    ALL_LOTTERY_TICKETS,
} from '../graphql/lottery';
import { initializeApollo } from '../services/apollo';

const LayoutComponent = ({ children, className = '' }) => {
    return (
        <div
            className={`layout container-fluid ${className}`}
            style={{ minHeight: '100vh' }}
        >
            <NavBar />
            <div>
                <div className="layout-content">{children}</div>
                <div className="layout-footer">
                    Copyright (C) 2020 Cartesi Pte. Ltd.
                </div>
            </div>
        </div>
    );
};

export default LayoutComponent;

export async function getStaticProps() {
    const apolloClient = initializeApollo();

    await apolloClient.query({
        query: ALL_LOTTERY_TICKETS,
        variables: allLotteryTicketsQueryVars,
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        },
        revalidate: 1,
    };
}
