import { act, renderHook } from '@testing-library/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
    useAccount,
    useAccountEffect,
    useDisconnect,
    usePublicClient,
    useSwitchChain,
    useWalletClient,
} from 'wagmi';
import { WalletType } from '../../../src/components/wallet/definitions';
import { UnsupportedNetworkError } from '../../../src/components/wallet/errors/UnsupportedNetworkError';
import {
    checkNetwork,
    getWalletType,
    shouldSwitchToMainnet,
    useWagmiWallet,
} from '../../../src/components/wallet/useWagmiWallet';
import { Network, networks } from '../../../src/utils/networks';

jest.unmock('../../../src/components/wallet/useWagmiWallet');

jest.mock('wagmi', () => ({
    useAccount: jest.fn(),
    useAccountEffect: jest.fn(),
    useDisconnect: jest.fn(),
    usePublicClient: jest.fn(),
    useSwitchChain: jest.fn(),
    useWalletClient: jest.fn(),
}));

jest.mock('@rainbow-me/rainbowkit', () => ({
    useConnectModal: jest.fn(),
}));

const useAccountMock = useAccount as jest.MockedFunction<typeof useAccount>;
const useAccountEffectMock = useAccountEffect as jest.MockedFunction<
    typeof useAccountEffect
>;
const useDisconnectMock = useDisconnect as jest.MockedFunction<
    typeof useDisconnect
>;
const usePublicClientMock = usePublicClient as jest.MockedFunction<
    typeof usePublicClient
>;
const useSwitchChainMock = useSwitchChain as jest.MockedFunction<
    typeof useSwitchChain
>;
const useWalletClientMock = useWalletClient as jest.MockedFunction<
    typeof useWalletClient
>;
const useConnectModalMock = useConnectModal as jest.MockedFunction<
    typeof useConnectModal
>;
const supported = Object.keys(networks).map(Number);
const address = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const metaMask = {
    id: 'io.metamask',
    name: 'MetaMask',
    type: 'injected',
} as any;
const safe = { id: 'safe', name: 'Safe', type: 'safe' } as any;

const publicClient = { chain: { id: 1 } } as any;
const walletClient = { account: { address } } as any;

const disconnect = jest.fn();
const switchChainAsync = jest.fn();
const openConnectModal = jest.fn();

const connected = (overrides: Partial<ReturnType<typeof useAccount>> = {}) =>
    ({
        address,
        chainId: Network.MAINNET,
        connector: metaMask,
        status: 'connected',
        isConnected: true,
        ...overrides,
    }) as any;

const disconnected = () =>
    ({
        address: undefined,
        chainId: undefined,
        connector: undefined,
        status: 'disconnected',
        isConnected: false,
    }) as any;

describe('checkNetwork', () => {
    it('returns undefined when the chain id is not set yet', () => {
        expect(checkNetwork(undefined, supported)).toBeUndefined();
    });

    it('returns null for a supported chain', () => {
        expect(checkNetwork(Network.SEPOLIA, supported)).toBeNull();
    });

    it('returns an UnsupportedNetworkError otherwise', () => {
        const error = checkNetwork(10, supported);
        expect(error).toBeInstanceOf(UnsupportedNetworkError);
        expect(error.message).toEqual(
            `Network id 10 is not supported. Supported network ids are ${supported.join(
                ', ',
            )}`,
        );
    });

    it('uses the explorer supported chains by default', () => {
        expect(checkNetwork(Network.LOCAL)).toBeNull();
        expect(checkNetwork(5)).toBeInstanceOf(UnsupportedNetworkError);
    });
});

describe('getWalletType', () => {
    it('maps the safe connector to the sdk type', () => {
        expect(getWalletType(safe)).toEqual(WalletType.SDK);
    });

    it('maps injected wallets and the MetaMask SDK to the injected type', () => {
        expect(getWalletType(metaMask)).toEqual(WalletType.INJECTED);
        expect(getWalletType({ id: 'metaMaskSDK', type: 'metaMask' })).toEqual(
            WalletType.INJECTED,
        );
    });

    it('has no type for other connectors', () => {
        expect(
            getWalletType({ id: 'walletConnect', type: 'walletConnect' }),
        ).toBeUndefined();
        expect(getWalletType(undefined)).toBeUndefined();
    });
});

describe('shouldSwitchToMainnet', () => {
    it('never switches in development', () => {
        expect(shouldSwitchToMainnet(Network.SEPOLIA, 'development')).toBe(
            false,
        );
    });

    it('switches outside development when not on mainnet', () => {
        expect(shouldSwitchToMainnet(Network.SEPOLIA, 'production')).toBe(true);
        expect(shouldSwitchToMainnet(undefined, 'production')).toBe(true);
    });

    it('does nothing when already on mainnet', () => {
        expect(shouldSwitchToMainnet(Network.MAINNET, 'production')).toBe(
            false,
        );
    });
});

describe('useWagmiWallet', () => {
    beforeEach(() => {
        useConnectModalMock.mockReturnValue({ openConnectModal } as any);
        useDisconnectMock.mockReturnValue({ disconnect } as any);
        useSwitchChainMock.mockReturnValue({ switchChainAsync } as any);
        usePublicClientMock.mockReturnValue(publicClient);
        useWalletClientMock.mockReturnValue({ data: walletClient } as any);
        useAccountEffectMock.mockImplementation(() => undefined);
        switchChainAsync.mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('is inactive while disconnected and opens the connect modal on activate', async () => {
        useAccountMock.mockReturnValue(disconnected());

        const { result } = renderHook(() => useWagmiWallet());

        expect(result.current.active).toBe(false);
        expect(result.current.account).toBeUndefined();
        expect(result.current.error).toBeUndefined();

        await act(() => result.current.connectWallet());
        expect(openConnectModal).toHaveBeenCalledTimes(1);
    });

    it('exposes a lowercase account, the clients and the wallet name once connected', () => {
        useAccountMock.mockReturnValue(connected());

        const { result } = renderHook(() => useWagmiWallet());

        expect(result.current.active).toBe(true);
        expect(result.current.account).toEqual(address.toLowerCase());
        expect(result.current.chainId).toEqual(Network.MAINNET);
        expect(result.current.publicClient).toBe(publicClient);
        expect(result.current.walletClient).toBe(walletClient);
        expect(result.current.walletName).toEqual('MetaMask');
        expect(result.current.walletType).toEqual(WalletType.INJECTED);
        expect(result.current.isGnosisSafe).toBe(false);
        expect(result.current.error).toBeNull();
        expect(usePublicClientMock).toHaveBeenCalledWith({
            chainId: Network.MAINNET,
        });
    });

    it('flags an unsupported network and stays inactive', () => {
        useAccountMock.mockReturnValue(connected({ chainId: 10 }));

        const { result } = renderHook(() => useWagmiWallet());

        expect(result.current.error).toBeInstanceOf(UnsupportedNetworkError);
        expect(result.current.active).toBe(false);
        expect(usePublicClientMock).toHaveBeenCalledWith({
            chainId: undefined,
        });
    });

    it('recognises a Safe connection', () => {
        useAccountMock.mockReturnValue(connected({ connector: safe }));

        const { result } = renderHook(() => useWagmiWallet());

        expect(result.current.isGnosisSafe).toBe(true);
        expect(result.current.walletType).toEqual(WalletType.SDK);
        expect(result.current.walletName).toEqual('Safe');
    });

    it('stays inactive until the wallet client is ready', () => {
        useAccountMock.mockReturnValue(connected());
        useWalletClientMock.mockReturnValue({ data: undefined } as any);

        const { result } = renderHook(() => useWagmiWallet());

        expect(result.current.active).toBe(false);
    });

    it('asks the wallet to switch to mainnet after connecting elsewhere', () => {
        useAccountMock.mockReturnValue(connected({ chainId: Network.SEPOLIA }));

        renderHook(() => useWagmiWallet());

        const { onConnect } = useAccountEffectMock.mock.calls[0][0];
        onConnect({ chainId: Network.SEPOLIA } as any);
        expect(switchChainAsync).toHaveBeenCalledWith({
            chainId: Network.MAINNET,
        });

        switchChainAsync.mockClear();
        onConnect({ chainId: Network.MAINNET } as any);
        expect(switchChainAsync).not.toHaveBeenCalled();
    });

    it('disconnects through wagmi', () => {
        useAccountMock.mockReturnValue(connected());

        const { result } = renderHook(() => useWagmiWallet());
        act(() => result.current.disconnectWallet());

        expect(disconnect).toHaveBeenCalledTimes(1);
    });

    it('removes the wallet selection left behind by the previous library', () => {
        useAccountMock.mockReturnValue(disconnected());
        window.localStorage.setItem('SELECTED_WALLETS_V2', 'MetaMask');

        renderHook(() => useWagmiWallet());

        expect(window.localStorage.getItem('SELECTED_WALLETS_V2')).toBeNull();
    });
});
