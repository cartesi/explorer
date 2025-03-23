// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { NextResponse } from 'next/server';
import { ServiceError, ServiceResult } from './types';

const handleResponse = <T>(result: ServiceResult<T>, statusCode = 200) => {
    if (result.ok === true) {
        return NextResponse.json({ data: result.data }, { status: statusCode });
    }

    return handleError(result.error);
};

const handleError = (error: ServiceError) => {
    switch (error) {
        case 'unauthorized':
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        case 'method_not_allowed':
            return NextResponse.json(
                { message: 'Method not allowed' },
                { status: 405 }
            );
        case 'not_an_user':
            return NextResponse.json({ message: 'Not found' }, { status: 404 });
        default:
            return NextResponse.json(
                { message: 'Something went wrong.' },
                { status: 500 }
            );
    }
};

export default handleResponse;
