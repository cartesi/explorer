/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['ui']);

module.exports = withTM({
    reactStrictMode: true,
});
