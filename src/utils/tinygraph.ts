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

/**
 * Returns the base URL for the tinygraphs service,
 * which can be configured through the environment variable NEXT_PUBLIC_TINYGRAPHS_URL.
 * If the environment variable is not set, it defaults to the Cartesi provided service.
 * @returns The base URL for the tinygraphs service.
 */
export const getTinyGraphsServiceUrl = () => {
    return (
        process.env.NEXT_PUBLIC_TINYGRAPHS_URL || 'https://tinygraph.cartesi.io'
    );
};

/**
 * Generates a URL for a tiny graph image based on ethereum address and optional shape index.
 * The URL is constructed using the block's producer ID, chain number, and protocol version to determine the theme and shape of the graph.
 * @param block The block object containing information about the producer, chain, and protocol version.
 * @param shapeIndex Optional index to override the default shape selection.
 * @returns The URL of the generated tiny graph image.
 */
export const tinyGraphUrl = (block: Block, shapeIndex?: number): string => {
    const themeId = block.chain.number % themes.length;
    const tinyGraphsBaseUrl = getTinyGraphsServiceUrl();
    const shapeId =
        shapeIndex ?? (block.chain.protocol.version - 1) % shapes.length;
    return `${tinyGraphsBaseUrl}/${shapes[shapeId]}/${block.producer.id}?theme=${themes[themeId]}&numcolors=4&size=220&fmt=svg`;
};
