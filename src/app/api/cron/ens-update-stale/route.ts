// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { headers } from 'next/headers';
import AddressENSService from '../../../../services/server/ens/AddressENSService';
import handleResponse from '../../../../services/server/handleResponse';

const cronSecret = process.env.CRON_SECRET;

const checkAuthorization = async () => {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    return authorization === `Bearer ${cronSecret}`;
};

export async function GET() {
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) {
        return handleResponse({ ok: false, error: 'unauthorized' });
    }

    console.time('ens-update-stale');
    const result = await AddressENSService.refreshEntries();
    console.timeEnd('ens-update-stale');
    return handleResponse(result);
}
