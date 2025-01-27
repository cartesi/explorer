import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../../src/hooks/useDebounce';

describe('Hooks/useDebounce', () => {
    it('should debounce callback until a given delay has passed', async () => {
        const callback = jest.fn();
        const delay = 400;
        const { result } = renderHook(() => useDebounce(callback, delay));
        ['h', 'he', 'hell', 'hello'].forEach((arg) => result.current(arg));

        await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

        expect(callback).toHaveBeenCalledWith('hello');
    });
});
