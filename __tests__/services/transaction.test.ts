import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { Contract, ContractTransaction } from 'ethers';
import { useWallet } from '../../src/contexts/wallet';
import { Transaction, useTransaction } from '../../src/services/transaction';
import { confirmations, Network } from '../../src/utils/networks';
import { buildContractReceipt, buildContractTransaction } from './mocks';

const walletMod = '../../src/contexts/wallet';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('Transaction service', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    beforeEach(() => {
        // Partial filled Happy returns
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 1,
        });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should have a default state when initiated', () => {
        const { result } = renderHook(() => useTransaction<string>());
        const transaction = result.current;
        expect(transaction).toMatchObject({
            ack: expect.any(Function),
            set: expect.any(Function),
            acknowledged: true,
            error: undefined,
            isOngoing: false,
            receipt: undefined,
            result: undefined,
            state: 'acknowledged',
            submitting: false,
            transaction: undefined,
        } as Transaction<string>);
    });

    describe('Set stages', () => {
        it('should change state to submitting when a transaction is first set', () => {
            const { result } = renderHook(() => useTransaction<string>());
            expect(result.current).toHaveProperty('acknowledged', true);
            expect(result.current).toHaveProperty('submitting', false);
            expect(result.current).toHaveProperty('state', 'acknowledged');
            expect(result.current).toHaveProperty('isOngoing', false);

            act(() => {
                result.current.set(
                    new Promise<ContractTransaction>((resolve) => {
                        return null;
                    })
                );
            });

            expect(result.current).toHaveProperty('acknowledged', false);
            expect(result.current).toHaveProperty('submitting', true);
            expect(result.current).toHaveProperty('state', 'submitting');
            expect(result.current).toHaveProperty('isOngoing', true);
        });

        it('should change state to waiting_confirmation when contract-transaction resolve (i.e. user signed the transaction)', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.confirmations = 0;
            const { result, waitForValueToChange } = renderHook(() =>
                useTransaction<string>()
            );
            expect(result.current).toHaveProperty('state', 'acknowledged');
            expect(result.current).toHaveProperty('isOngoing', false);
            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            await waitForValueToChange(() => result.current.state);

            expect(result.current).toHaveProperty(
                'state',
                'waiting_confirmation'
            );
            expect(result.current.isOngoing).toBe(true);
            expect(result.current.submitting).toBe(false);
            expect(result.current.transaction).toBeDefined();
        });

        it('should change state to confirmed when contract-transaction reaches the expected confirmations based on network', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.confirmations = confirmations[Network.MAINNET];
            // A dummy close to real contract receipt
            contractTransaction.wait.mockResolvedValue(buildContractReceipt());
            const { result, waitForValueToChange } = renderHook(() =>
                useTransaction<string>()
            );

            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            await waitForValueToChange(() => result.current.state);

            expect(result.current).toHaveProperty('state', 'confirmed');
            expect(result.current.isOngoing).toBe(false);
            expect(result.current.transaction).toBeDefined();
            expect(result.current.receipt).toBeDefined();
        });
    });
});
