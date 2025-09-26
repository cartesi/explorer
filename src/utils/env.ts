/**
 * @description Checks if the current environment is production
 * @returns boolean - true if the environment is production, false otherwise
 */
export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

/**
 * @description Checks if the current environment is development
 * @returns boolean - true if the environment is development, false otherwise
 */
export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
};
