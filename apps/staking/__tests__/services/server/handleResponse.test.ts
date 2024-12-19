// Copyright (C) 2024 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { NextApiResponse } from 'next';
import handleResponse from '../../../src/services/server/handleResponse';

const responseMockBuilder = (mocks: any) => {
    const mock: jest.Mocked<NextApiResponse> = {
        status(value: number) {
            mocks.status(value);
            return this;
        },
        send(value: any) {
            mocks.send(value);
            return this;
        },
        json(obj: Object) {
            mocks.json(obj);
            return this;
        },
    } as unknown as jest.Mocked<NextApiResponse>;
    return mock;
};

describe('Response Handler', () => {
    const status = jest.fn();
    const json = jest.fn();
    const send = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with data body when service result is ok', () => {
        const res = responseMockBuilder({ status, json });

        handleResponse({ ok: true, data: { message: 'hello' } }, res);

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ data: { message: 'hello' } });
    });

    it('should be able to change the status code for service results that are ok', () => {
        const res = responseMockBuilder({ status, json });

        handleResponse(
            { ok: true, data: { message: 'Entry created!' } },
            res,
            201
        );

        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith({
            data: { message: 'Entry created!' },
        });
    });

    it('should return 401 when the service result error is related to unauthorized access', () => {
        const res = responseMockBuilder({ status, send });
        handleResponse({ ok: false, error: 'unauthorized' }, res);
        expect(status).toHaveBeenCalledWith(401);
        expect(send).toHaveBeenCalledWith('Unauthorized');
    });

    it('should return 405 when service result is related to not-allowed method calls', () => {
        const res = responseMockBuilder({ status, send });
        handleResponse({ ok: false, error: 'method_not_allowed' }, res);
        expect(status).toHaveBeenCalledWith(405);
        expect(send).toHaveBeenCalledWith('Method not allowed');
    });

    it('should return 404 when service result error is related to a non-user', () => {
        const res = responseMockBuilder({ status, send });
        handleResponse({ ok: false, error: 'not_an_user' }, res);
        expect(status).toHaveBeenCalledWith(404);
        expect(send).toHaveBeenCalledWith('Not found');
    });

    it('should return 500 any other error due to runtime errors', () => {
        const res = responseMockBuilder({ status, json });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        handleResponse({ ok: false, error: 'DB-failure' }, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ message: 'Something went wrong.' });
    });
});
