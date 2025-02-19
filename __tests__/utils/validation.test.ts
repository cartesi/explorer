// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { validateEns } from '../../src/utils/validation';

describe('validateEns util', () => {
    it('should correctly validate ens', () => {
        expect(validateEns('abc.xyz.com')).toBe(true);
        expect(validateEns('https://ensname.com')).toBe(true);
        expect(validateEns('xyz')).toBe(false);
        expect(validateEns('')).toBe(false);
        expect(validateEns(undefined)).toBe(false);
    });
});
