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

export const tinyGraphUrl = (ticket) => {
    return `https://www.tinygraphs.com/labs/isogrids/hexa/${ticket.id}?theme=${
        themes[ticket.round % themes.length]
    }&numcolors=4&size=220&fmt=svg`;
};
