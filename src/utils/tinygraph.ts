// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Block } from '../graphql/models';

export const themes = [
    'frogideas',
    'sugarsweets',
    'heatwave',
    'daisygarden',
    'seascape',
    'summerwarmth',
    'bythepool',
    'duskfalling',
    'berrypie',
];

export const shapes = [
    'labs/isogrids/hexa', // Hexa isogrids
    'squares', // Squares
    'isogrids', // Isogrids
    'spaceinvaders', // Space invaders
    'labs/isogrids/hexa16', // Hexa rotation 1/6
];

export const tinyGraphUrl = (block: Block, shapeIndex?: number): string => {
    const themeId = block.chain.number % themes.length;
    const shapeId =
        shapeIndex ?? (block.chain.protocol.version - 1) % shapes.length;
    return `https://tinygraphs.cartesi.io/${shapes[shapeId]}/${block.producer.id}?theme=${themes[themeId]}&numcolors=4&size=220&fmt=svg`;
};
