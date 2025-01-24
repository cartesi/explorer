import { useCallback } from 'react';
import { debounce } from 'lodash/fp';

export const useDebounce = (callback: (args?: any) => void, delay = 500) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Lodash debounce needs to be set up like this in react context
    return useCallback(debounce(delay, callback), []);
};
