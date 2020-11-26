export const tinyString = (str: string) => {
    if (str.length > 9) {
        return str.slice(0, 5) + '...' + str.slice(-4);
    }
    return str;
};
