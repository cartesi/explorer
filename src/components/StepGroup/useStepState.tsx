// Copyright (C) 2022 Cartesi Pte. Ltd.

import { useEffect, useState } from 'react';
import { StepStatus } from '../Step/enums';

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

type Props = { inFocus?: boolean };
type State = { status: StepStatus };
type HookReturn = [State, (status: StepStatus) => void];

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;

const useStepState = (props: Props): HookReturn => {
    const { inFocus } = props || {};
    const [state, setState] = useState<State>({
        status: inFocus ? ACTIVE : NOT_ACTIVE,
    });

    useEffect(() => {
        if (!inFocus && state.status === COMPLETED) return;

        const status = inFocus ? ACTIVE : NOT_ACTIVE;
        setState((state) => ({ ...state, status }));
    }, [inFocus]);

    return [state, (status) => setState((state) => ({ ...state, status }))];
};

export { useStepState };
