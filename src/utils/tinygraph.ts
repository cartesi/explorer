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

export const tinyGraphUrl = (block: Block): string => {
    const themeId = parseInt(block.chain.id) % themes.length;
    return `http://tinygraphs-cartesi.herokuapp.com/labs/isogrids/hexa/${block.producer.id}?theme=${themes[themeId]}&numcolors=4&size=220&fmt=svg`;
};
