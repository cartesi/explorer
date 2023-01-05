export class UnsupportedNetworkError extends Error {
    constructor(
        unsupportedNetworkId: number,
        supportedNetworkIds?: readonly number[]
    ) {
        super();
        this.name = this.constructor.name;
        const suffix =
            supportedNetworkIds && supportedNetworkIds.length > 0
                ? `Supported network ids are ${supportedNetworkIds.join(', ')}`
                : '';
        this.message = `Network id ${unsupportedNetworkId} is not supported. ${suffix}`;
    }
}
