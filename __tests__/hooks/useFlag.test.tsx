import { renderHook } from '@testing-library/react';
import useFlag from '../../src/hooks/useFlag';

describe('useFlag', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = {
            ...originalEnv,
        };
    });

    it('should return false when flag does not exist', () => {
        //@ts-expect-error
        const { result } = renderHook(() => useFlag('non-existing-flag'));
        expect(result.current).toEqual(false);
    });

    it('should pos-v2-enabled flag value be based on environment variable value', () => {
        process.env = {
            ...process.env,
            NEXT_PUBLIC_FLAG_POS_V2_ENABLED: 'false',
        };
        const { result, rerender } = renderHook(() => useFlag('posV2Enabled'));
        const currentValue = result.current;
        expect(currentValue).toEqual(false);
        // flag value change
        process.env = {
            ...process.env,
            NEXT_PUBLIC_FLAG_POS_V2_ENABLED: 'true',
        };

        rerender('posV2Enabled');
        const newValue = result.current;
        expect(newValue).toEqual(true);
    });

    it('should ankr-enabled flag value be based on environment variable value', () => {
        process.env = {
            ...process.env,
            NEXT_PUBLIC_FLAG_ANKR_ENABLED: 'true',
        };

        const { result, rerender } = renderHook(() => useFlag('ankrEnabled'));

        const currentValue = result.current;
        expect(currentValue).toEqual(true);

        // then it changes to false
        process.env = {
            ...process.env,
            NEXT_PUBLIC_FLAG_ANKR_ENABLED: 'false',
        };

        rerender('ankrEnabled');
        const newValue = result.current;
        expect(newValue).toEqual(false);
    });
});
