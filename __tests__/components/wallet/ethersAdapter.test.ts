import { Web3Provider } from '@ethersproject/providers';
import { renderHook, waitFor } from '@testing-library/react';
import {
    toWeb3Provider,
    useEthersLibrary,
} from '../../../src/components/wallet/ethersAdapter';

const buildConnector = (uid: string) =>
    ({
        uid,
        getProvider: jest.fn().mockResolvedValue({ request: jest.fn() }),
    }) as any;

describe('ethers adapter', () => {
    it('wraps an EIP-1193 provider with the "any" network', () => {
        const provider = toWeb3Provider({ request: jest.fn() });
        expect(provider).toBeInstanceOf(Web3Provider);
        expect(provider.anyNetwork).toBe(true);
    });

    it('builds one Web3Provider per connector and keeps it across re-renders', async () => {
        const connector = buildConnector('a');
        const { result, rerender } = renderHook(
            ({ c }) => useEthersLibrary(c),
            { initialProps: { c: connector } },
        );

        await waitFor(() =>
            expect(result.current).toBeInstanceOf(Web3Provider),
        );
        const first = result.current;

        rerender({ c: connector });
        await waitFor(() => expect(result.current).toBe(first));
        expect(connector.getProvider).toHaveBeenCalledTimes(1);
    });

    it('swaps the provider when the connector changes and clears it on disconnect', async () => {
        const first = buildConnector('a');
        const second = buildConnector('b');
        const { result, rerender } = renderHook(
            ({ c }) => useEthersLibrary(c),
            { initialProps: { c: first } },
        );
        await waitFor(() =>
            expect(result.current).toBeInstanceOf(Web3Provider),
        );
        const initial = result.current;

        rerender({ c: second });
        await waitFor(() => expect(result.current).not.toBe(initial));
        expect(result.current).toBeInstanceOf(Web3Provider);

        rerender({ c: undefined });
        await waitFor(() => expect(result.current).toBeUndefined());
    });
});
