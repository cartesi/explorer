export const tinyString = (str: string) => {
    if (str.length > 8) {
        return str.slice(0, 5) + '...' + str.slice(-3);
    }
    return str;
};
