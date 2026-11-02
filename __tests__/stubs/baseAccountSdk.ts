/**
 * Stands in for `@base-org/account` under Jest. wagmi's baseAccount connector
 * only needs `getProvider()`, and the real `createBaseAccountSDK` performs a
 * HEAD fetch on creation. This mirrors the SDK's choice of the injected
 * provider inside the Coinbase Wallet in-app browser.
 */
export const createBaseAccountSDK = () => ({
    getProvider: () => (window.top as Window)?.ethereum ?? window.ethereum,
});
