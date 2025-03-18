// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { allowedMethodBuilder } from '../../../../services/server/allowedMethods';
import AddressENSService from '../../../../services/server/ens/AddressENSService';
import handleResponse from '../../../../services/server/handleResponse';
import { getChainId } from '../../../../services/server/utils';

const isMethodAllowed = allowedMethodBuilder({ methods: ['GET', 'HEAD'] });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (isMethodAllowed(req)) {
        const chainName = (req.query.chain ?? '') as string;
        const address = (req.query?.address ?? '') as string;

        if (!ethers.utils.isAddress(address))
            return res
                .status(422)
                .json({ message: `${address} is not a valid address format.` });

        const chainId = getChainId(chainName);
        const result = await AddressENSService.getEntry(address, chainId);

        handleResponse(result, res);
    } else {
        handleResponse({ ok: false, error: 'method_not_allowed' }, res);
    }
};

export default handler;
