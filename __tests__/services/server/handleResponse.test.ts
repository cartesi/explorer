// Copyright (C) 2024 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { NextResponse } from 'next/server';
import handleResponse from '../../../src/services/server/handleResponse';

jest.mock('next/server', () => {
    const mockJson = jest.fn();
    const mockNextResponse = jest.fn().mockImplementation(() => {
        return { json: mockJson };
    });

    return {
        __esModule: true,
        NextResponse: mockNextResponse,
    };
});

describe('Response Handler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with data body when service result is ok', () => {
        NextResponse.json = jest.fn();
        const jsonSpy = jest.spyOn(NextResponse, 'json');

        handleResponse({ ok: true, data: { message: 'hello' } });

        expect(jsonSpy).toHaveBeenCalledWith(
            { data: { message: 'hello' } },
            { status: 200 }
        );
    });

    it('should be able to change the status code for service results that are ok', () => {
        NextResponse.json = jest.fn();
        const jsonSpy = jest.spyOn(NextResponse, 'json');

        handleResponse({ ok: true, data: { message: 'Entry created!' } }, 201);

        expect(jsonSpy).toHaveBeenCalledWith(
            { data: { message: 'Entry created!' } },
            { status: 201 }
        );
    });

    it('should return 401 when the service result error is related to unauthorized access', () => {
        NextResponse.json = jest.fn();
        const jsonSpy = jest.spyOn(NextResponse, 'json');

        handleResponse({ ok: false, error: 'unauthorized' });

        expect(jsonSpy).toHaveBeenCalledWith(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    });

    it('should return 405 when service result is related to not-allowed method calls', () => {
        NextResponse.json = jest.fn();
        const jsonSpy = jest.spyOn(NextResponse, 'json');

        handleResponse({ ok: false, error: 'method_not_allowed' });

        expect(jsonSpy).toHaveBeenCalledWith(
            { message: 'Method not allowed' },
            { status: 405 }
        );
    });

    it('should return 404 when service result error is related to a non-user', () => {
        NextResponse.json = jest.fn();
        const jsonSpy = jest.spyOn(NextResponse, 'json');

        handleResponse({ ok: false, error: 'not_an_user' });

        expect(jsonSpy).toHaveBeenCalledWith(
            { message: 'Not found' },
            { status: 404 }
        );
    });

    it('should return 500 any other error due to runtime errors', () => {
        NextResponse.json = jest.fn();
        const jsonSpy = jest.spyOn(NextResponse, 'json');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        handleResponse({ ok: false, error: 'DB-failure' });

        expect(jsonSpy).toHaveBeenCalledWith(
            { message: 'Something went wrong.' },
            { status: 500 }
        );
    });
});
