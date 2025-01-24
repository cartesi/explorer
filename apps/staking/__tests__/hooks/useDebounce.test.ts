import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../../src/hooks/useDebounce';

describe('Hooks/useDebounce', () => {
    it('should debounce callback until a given delay has passed', async () => {
        const callback = jest.fn();
        const delay = 400;
        const { result } = renderHook(() => useDebounce(callback, delay));

        const functionInvocations = Array.from({ length: 4 }).map(
            () =>
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        result.current();
                        resolve();
                    }, 100);
                })
        );
        await Promise.all(functionInvocations);

        await waitFor(() => expect(callback).toHaveBeenCalledTimes(1), {
            timeout: delay + 10,
        });
    });
});
