// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { differenceInDays } from 'date-fns';
import {
    getPastDaysInSeconds,
    toUnixTimestamp,
} from '../../src/utils/dateParser';

describe('dateParser util', () => {
    it('should parse milliseconds', () => {
        const time = new Date().getTime();
        expect(toUnixTimestamp(time)).toEqual(Math.floor(time / 1000));
    });

    it('should parse Date object', () => {
        const time = new Date();
        expect(toUnixTimestamp(time)).toEqual(
            Math.floor(time.getTime() / 1000)
        );
    });

    describe('date manipulation', () => {
        const today = new Date(1687417813360);

        beforeEach(() => {
            jest.spyOn(Date, 'now').mockImplementation(() => today.getTime());
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return past days in seconds (7 days ago)', () => {
            const resultInSeconds = getPastDaysInSeconds(7);

            expect(
                differenceInDays(today, new Date(resultInSeconds * 1000))
            ).toEqual(7);
        });

        it('should return past days in seconds (30 days ago)', () => {
            const resultInSeconds = getPastDaysInSeconds(30);

            expect(
                differenceInDays(today, new Date(resultInSeconds * 1000))
            ).toEqual(30);
        });
    });
});
