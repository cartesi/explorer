// Copyright (C) 2024 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { NextApiRequest } from 'next';
import { allowedMethodBuilder } from '../../../src/services/server/allowedMethods';

const requestMockBuilder = (obj: Partial<NextApiRequest>) => {
    const req: jest.Mocked<NextApiRequest> = {
        ...obj,
    } as unknown as jest.Mocked<NextApiRequest>;

    return req;
};

describe('Allowed Method Builder', () => {
    it('should return false when a method is not allowed', () => {
        const isMethodAllowed = allowedMethodBuilder({ methods: ['GET'] });
        const req = requestMockBuilder({ method: 'POST' });
        expect(isMethodAllowed(req)).toEqual(false);
    });

    it('should return true if the request method is one of the allowed methods listed', () => {
        const isMethodAllowed = allowedMethodBuilder({
            methods: ['PUT', 'DELETE'],
        });

        const req = requestMockBuilder({ method: 'DELETE' });

        expect(isMethodAllowed(req)).toEqual(true);
    });
});
