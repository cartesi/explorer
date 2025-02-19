// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export enum Network {
    MAINNET = 1,
    LOCAL = 31337,
    SEPOLIA = 11155111,
}

export const networks = {
    1: 'mainnet',
    31337: 'localhost',
    11155111: 'sepolia',
};

export const confirmations = {
    1: 3,
    31337: 1,
    11155111: 1,
};

export const etherscanLinks = {
    1: 'https://etherscan.io',
    31337: null,
    11155111: 'https://sepolia.etherscan.io',
};
