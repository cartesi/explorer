// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { isString } from 'lodash';

export const truncateString = (str: string): string => {
    if (str && str.length > 9) {
        return `${str.slice(0, 5)}...${str.slice(-4)}`;
    }
    return str;
};

export const truncateStringMobile = (str: string): string => {
    if (str && str.length > 9) {
        return `${str.slice(0, 9)}...${str.slice(-8)}`;
    }
    return str;
};

export const formatEnsName = (
    address: string,
    ensName?: string,
    maxChars = 12
): string =>
    isString(ensName)
        ? ensName
        : address.length > maxChars
        ? address.slice(0, maxChars)
        : address;
