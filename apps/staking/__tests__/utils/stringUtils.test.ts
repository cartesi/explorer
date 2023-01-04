// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { formatEnsName } from '../../src/utils/stringUtils';

describe('StringUtils functions', () => {
    it('should format ens name', () => {
        let ensName = 'ctsi.omnistake.eth';
        const address = '0x2942aa4356783892c624125acfbbb80d29629a9d';

        expect(formatEnsName(address, ensName)).toBe(ensName);

        ensName = undefined;
        const maxChars = 12;
        expect(formatEnsName(address, ensName, maxChars)).toBe(
            address.slice(0, maxChars)
        );
    });
});
