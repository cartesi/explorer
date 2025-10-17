const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';  
  font-src 'self';
  frame-ancestors 'self' https://app.safe.global;
`;

/** @type {import('next').NextConfig} */
module.exports = {
    typedRoutes: true,
    webpack: (config, { isServer }) => {
        // On "next build" command, pino-pretty should be set as external deps to avoid module-not-found problem.
        if (isServer) {
            config.externals.push('pino-pretty');
        }
        return config;
    },
    reactStrictMode: true,
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
