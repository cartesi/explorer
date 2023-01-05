// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, {
    createContext,
    FC,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Router } from 'next/router';
import ReactGA from 'react-ga';
import { useWallet } from '@explorer/wallet';

const TrackingID = 'UA-124332259-9';
const CustomDimensions = {
    WalletName: 'dimension1',
};

interface TrackingProviderProps {
    children: React.ReactNode;
}

interface TrackingContextProps {
    addTracker: (trackerId: string, trackerName: string) => void;
    logEvent: (args: ReactGA.EventArgs) => void;
    removeTracker: (trackerName: string) => void;
}

const TrackingContext = createContext<TrackingContextProps>(undefined);

// take only the first 8 chars from address for tracking purposes
const anonymizeUser = (account: string) => account?.substring(2, 10);

const TrackingProvider: FC<TrackingProviderProps> = (props) => {
    const { account, walletName } = useWallet();

    // we create a default state to keep track of whether GA
    // has been initialized, if we're tracking a unique user,
    // and to hold all of our trackers

    const [analytics, setAnalytics] = useState({
        isInitialized: false,
        hasUser: false,
        trackers: ['explorer'],
    });

    // We create a function handle all route changes that occur
    // and track a users movements across pages in our app

    const handleRouteChange = (url: string) => {
        ReactGA.set({ page: url }, analytics.trackers);
        ReactGA.pageview(url, analytics.trackers);
    };

    // We only want to initialize GA on the client side
    // This will fail if you're trying to initialize server side
    // useEffect will help us handle this case as it only runs
    // client side

    const addTracker = (trackerId: string, trackerName: string) => {
        if (analytics.isInitialized) {
            ReactGA.addTrackers([
                {
                    trackingId: trackerId,
                    gaOptions: {
                        name: trackerName,
                    },
                },
            ]);
            setAnalytics((prev) => ({
                ...prev,
                trackers: [...prev.trackers, trackerName],
            }));
        }
    };
    const removeTracker = (trackerName: string) => {
        if (analytics.isInitialized) {
            setAnalytics((prev) => ({
                ...prev,
                trackers: prev.trackers.filter(
                    (tracker) => tracker !== trackerName
                ),
            }));
        }
    };
    const logEvent = ({ category = '', action = '', label = '' }) => {
        if (analytics.isInitialized) {
            ReactGA.event(
                {
                    category,
                    action,
                    label,
                },
                analytics.trackers
            );
        }
    };

    useEffect(() => {
        const { isInitialized, hasUser, trackers } = analytics;

        if (!isInitialized) {
            ReactGA.initialize(TrackingID, {
                gaOptions: {
                    name: 'explorer',
                    userId: anonymizeUser(account),
                },
            });
            setAnalytics((prev) => ({
                ...prev,
                isInitialized: true,
                hasUser,
            }));

            // in case we dont have the user initially,
            // we handle setting a user in our tracker
        } else if (isInitialized && !hasUser) {
            ReactGA.set({ userId: anonymizeUser(account) }, trackers);

            setAnalytics((prev) => ({
                ...prev,
                hasUser: !!account,
            }));
        }

        // Handle all route changes
        Router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            // clean up
            Router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [account]);

    useEffect(() => {
        const { isInitialized, trackers } = analytics;
        if (isInitialized && walletName) {
            const data = { [CustomDimensions.WalletName]: walletName };
            ReactGA.event(
                {
                    category: 'Wallet',
                    action: 'Selection',
                    ...data,
                },
                trackers
            );
        }
    }, [walletName]);

    return (
        <TrackingContext.Provider
            value={{ addTracker, logEvent, removeTracker }}
            {...props}
        />
    );
};
const useTracking = () => useContext(TrackingContext);

export { TrackingProvider, useTracking };
