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

export const tinyGraphUrl = (block: Block) => {
    return `https://www.tinygraphs.com/labs/isogrids/hexa/${block.id}?theme=${
        themes[block.number % themes.length]
    }&numcolors=4&size=220&fmt=svg`;
};
