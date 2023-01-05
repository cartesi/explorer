// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createContext, ReactNode, useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useWallet } from '@explorer/wallet';

const measurementID = 'G-0J9KC579GV';

// in GA4 that is the property configured to be collected from the event.
const CustomDimensions = {
    WalletName: 'wallet_name',
};

// take only the first 8 chars from address for tracking purposes
const anonymizeUser = (account: string) => account?.substring(2, 10);

interface TrackingProviderProps {
    children?: ReactNode;
}

const GA4TrackerContext = createContext<TrackingProviderProps>(undefined);

const GA4TrackerProvider = (props: TrackingProviderProps) => {
    const [analytics, setAnalytics] = useState({
        isInitialised: false,
        hasUser: false,
    });

    const { account, walletName } = useWallet();

    useEffect(() => {
        const { isInitialised, hasUser } = analytics;

        if (!isInitialised && process.env.NODE_ENV === 'production') {
            ReactGA.initialize(measurementID, {
                gaOptions: {
                    name: 'explorer',
                    userId: anonymizeUser(account),
                },
            });
            setAnalytics((prev) => ({
                ...prev,
                isInitialised: true,
                hasUser,
            }));
            // in case we dont have the user initially,
        } else if (isInitialised && !hasUser) {
            ReactGA.set({ userId: anonymizeUser(account) });
            setAnalytics((prev) => ({
                ...prev,
                hasUser: !!account,
            }));
        }
    }, [account]);

    useEffect(() => {
        const { isInitialised } = analytics;
        if (isInitialised && walletName) {
            const params = {
                [CustomDimensions.WalletName]: walletName,
            };
            ReactGA.event('Wallet Selection', params);
        }
    }, [walletName]);

    // is returning nothing as context-value at the moment
    return (
        <GA4TrackerContext.Provider value={{}}>
            {props.children}
        </GA4TrackerContext.Provider>
    );
};

export { GA4TrackerProvider };
