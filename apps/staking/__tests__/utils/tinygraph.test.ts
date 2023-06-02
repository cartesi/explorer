// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { tinyGraphUrl, themes, shapes } from '../../src/utils/tinygraph';
import { Block } from '../../src/graphql/models';

const block = {
    chain: {
        number: 0,
        protocol: {
            version: 3,
        },
        targetInterval: 138,
    },
    commission: '290000000000000000000',
    difficulty: '62703697598165246132',
    id: '0x95983dc0ee3611f220d0012124033916f855386856b77f7ec0a716a6a4d54b10',
    node: {
        id: '0x9a50ecec41fd63f5a02522ddb3da7319a6a30276',
    },
    number: 569,
    producer: {
        id: '0x9a50ecec41fd63f5a02522ddb3da7319a6a30276',
        totalBlocks: 291,
    },
    reward: '2900000000000000000000',
    timestamp: '1685119548',
} as unknown as Block;

describe('tinygraph util', () => {
    it('should generate correct tinygraph url', () => {
        const themeId = block.chain.number % themes.length;
        const shapeId = (block.chain.protocol.version - 1) % shapes.length;

        expect(tinyGraphUrl(block)).toBe(
            `https://tinygraphs.cartesi.io/${shapes[shapeId]}/${block.producer.id}?theme=${themes[themeId]}&numcolors=4&size=220&fmt=svg`
        );
    });
});
