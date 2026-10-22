'use client';

import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import { GoogleTagManager } from '@next/third-parties/google';
import { FC, ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

const TrackerProvider: FC<ProvidersProps> = ({ children }) => (
    <>
        {process.env.NODE_ENV === 'production' && gtmId && (
            <GoogleTagManager gtmId={gtmId} />
        )}
        <GA4TrackerProvider>{children}</GA4TrackerProvider>
    </>
);

export default TrackerProvider;
