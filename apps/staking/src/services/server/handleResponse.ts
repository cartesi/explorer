// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { NextApiResponse } from 'next';
import { ServiceError, ServiceResult } from './types';

const handleResponse = <T>(
    result: ServiceResult<T>,
    res: NextApiResponse,
    statusCode = 200
) => {
    if (result.ok === true)
        return res.status(statusCode).json({ data: result.data });

    handleError(result.error, res);
};

const handleError = (error: ServiceError, res: NextApiResponse) => {
    switch (error) {
        case 'unauthorized':
            return res.status(401).send('Unauthorized');
        case 'method_not_allowed':
            return res.status(405).send('Method not allowed');
        case 'not_an_user':
            return res.status(404).send('Not found');
        default:
            return res.status(500).json({ message: 'Something went wrong.' });
    }
};

export default handleResponse;
