/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const modules = [
    '@explorer/ui',
    '@explorer/wallet',
    '@explorer/utils',
    '@explorer/services',
];
const withTM = require('next-transpile-modules')(modules);

module.exports = withTM({
    reactStrictMode: true,
});
