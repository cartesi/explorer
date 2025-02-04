/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const modules = ['@explorer/ui', '@explorer/wallet'];

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';  
  font-src 'self';
  frame-ancestors 'self' https://app.safe.global;
`;

module.exports = {
    reactStrictMode: true,
    transpilePackages: modules,
    async headers() {
        return [
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: ContentSecurityPolicy.replace(
                            /\s{2,}/g,
                            ' '
                        ).trim(),
                    },
                ],
            },
        ];
    },
};
