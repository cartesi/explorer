'use client';

import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import TagManager from 'react-gtm-module';
import { FC, ReactNode, useEffect } from 'react';
import { isProduction } from '../utils/env';

interface ProvidersProps {
    children: ReactNode;
}

const TrackerProvider: FC<ProvidersProps> = ({ children }) => {
    useEffect(() => {
        if (isProduction()) {
            TagManager.initialize({
                gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
            });
        }
    }, []);

    return <GA4TrackerProvider>{children}</GA4TrackerProvider>;
};

export default TrackerProvider;
