const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';  
  font-src 'self';
  frame-ancestors 'self' https://app.safe.global;
`;

/** @type {import('next').NextConfig} */
module.exports = {
    typedRoutes: true,
    reactStrictMode: true,
    // Do not generate the AGENTS.md / CLAUDE.md files next writes on "next dev".
    agentRules: false,
    // cdp-sdk (via wagmi's Base connector) imports optional @x402/* peers that
    // are not installed; keep it out of the server bundle.
    serverExternalPackages: ['@coinbase/cdp-sdk'],
    async headers() {
        return [
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: ContentSecurityPolicy.replace(
                            /\s{2,}/g,
                            ' ',
                        ).trim(),
                    },
                ],
            },
            {
                source: '/api/:chain/stats',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, HEAD',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ];
    },
};
