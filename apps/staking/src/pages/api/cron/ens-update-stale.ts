// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { NextApiRequest, NextApiResponse } from 'next';
import { allowedMethodBuilder } from '../../../services/server/allowedMethods';
import AddressENSService from '../../../services/server/ens/AddressENSService';
import handleResponse from '../../../services/server/handleResponse';

const isMethodAllowed = allowedMethodBuilder({ methods: ['GET'] });
const cronSecret = process.env.CRON_SECRET;

const isAuthorized = (req: NextApiRequest) =>
    req.headers.authorization === `Bearer ${cronSecret}`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!isAuthorized(req))
        return handleResponse({ ok: false, error: 'unauthorized' }, res);

    if (isMethodAllowed(req)) {
        console.time('ens-update-stale');
        const result = await AddressENSService.refreshEntries();
        console.timeEnd('ens-update-stale');
        handleResponse(result, res);
    } else {
        handleResponse({ ok: false, error: 'method_not_allowed' }, res);
    }
};

export default handler;