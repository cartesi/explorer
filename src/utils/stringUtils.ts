export const tinyString = (str: string) => {
    if (str.length > 10) {
        return str.slice(0, 6) + '...' + str.slice(-4);
    }
    return str;
};
