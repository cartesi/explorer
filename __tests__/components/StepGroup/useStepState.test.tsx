// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook, act } from '@testing-library/react-hooks';
import { StepStatus } from '../../../src/components/Step';
import { useStepState } from '../../../src/components/StepGroup/useStepState';

describe('useStepState hook', () => {
    it('should return an array with two values the state as the first and a function as the second', () => {
        const { result } = renderHook(() => useStepState({ inFocus: true }));
        const [state, setState] = result.current;
        expect(state).toBeDefined();
        expect(state).toBeInstanceOf(Object);
        expect(setState).toBeDefined();
        expect(setState).toBeInstanceOf(Function);
    });

    it('should return status as not-active when not in focus', () => {
        const { result } = renderHook(() => useStepState({ inFocus: false }));
        const [state] = result.current;

        expect(state).toHaveProperty('status', StepStatus.NOT_ACTIVE);
    });

    it('should return status as active when in focus', () => {
        const { result } = renderHook(() => useStepState({ inFocus: true }));
        const [state] = result.current;

        expect(state).toHaveProperty('status', StepStatus.ACTIVE);
    });

    it('should return status as not_active when nothing is passed as argument', () => {
        const { result } = renderHook(() => useStepState({}));
        const [state] = result.current;

        expect(state).toHaveProperty('status', StepStatus.NOT_ACTIVE);
    });

    it('should update the value when the setter is called', () => {
        const { result } = renderHook(() => useStepState({ inFocus: true }));
        const [state, setStepState] = result.current;

        expect(state).toHaveProperty('status', StepStatus.ACTIVE);

        act(() => {
            setStepState(StepStatus.COMPLETED);
        });

        expect(result.current[0]).toHaveProperty(
            'status',
            StepStatus.COMPLETED
        );
    });

    it('should keep status as completed even when not in-focus anymore', () => {
        const { result, rerender } = renderHook(
            ({ inFocus }) => useStepState({ inFocus }),
            { initialProps: { inFocus: true } }
        );
        const [, setStepState] = result.current;

        act(() => setStepState(StepStatus.COMPLETED));

        expect(result.current[0]).toHaveProperty(
            'status',
            StepStatus.COMPLETED
        );

        rerender({ inFocus: false });

        expect(result.current[0]).toHaveProperty(
            'status',
            StepStatus.COMPLETED
        );
    });

    it('should switch in between active and not-active when in-focus changes and did not reach completed state', () => {
        const { result, rerender } = renderHook(
            ({ inFocus }) => useStepState({ inFocus }),
            { initialProps: { inFocus: true } }
        );

        expect(result.current[0]).toHaveProperty('status', StepStatus.ACTIVE);

        rerender({ inFocus: false });

        expect(result.current[0]).toHaveProperty(
            'status',
            StepStatus.NOT_ACTIVE
        );
    });
});
