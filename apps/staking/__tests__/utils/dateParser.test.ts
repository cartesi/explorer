// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { toUnixTimestamp } from '../../src/utils/dateParser';

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
});
