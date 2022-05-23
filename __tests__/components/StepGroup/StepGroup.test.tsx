// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import React, { useEffect, useState } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import {
    Step,
    StepActions,
    StepBody,
    StepStatus,
} from '../../../src/components/Step';
import { StepGroup, IStep } from '../../../src/components/StepGroup';
import { Button, useBreakpointValue } from '@chakra-ui/react';

jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useBreakpointValue: jest.fn(),
    };
});

const mockUseBreakpointValue = useBreakpointValue as jest.MockedFunction<
    typeof useBreakpointValue
>;

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;
const DummyStep = ({
    stepNumber,
    inFocus,
    onComplete,
    onPrevious,
    onStepActive,
}: IStep) => {
    const [state, setState] = useState({
        status: inFocus ? ACTIVE : NOT_ACTIVE,
    });

    useEffect(() => {
        if (!inFocus && state.status === COMPLETED) return;

        const status = inFocus ? ACTIVE : NOT_ACTIVE;
        setState((state) => ({ ...state, status }));
    }, [inFocus]);

    return (
        <Step
            stepNumber={stepNumber}
            onActive={onStepActive}
            title={`Title ${stepNumber}`}
            subtitle={`Subtitle ${stepNumber}`}
            status={state.status}
        >
            <StepBody>Step body number {stepNumber}</StepBody>
            <StepActions>
                <Button onClick={onPrevious}>PREVIOUS {stepNumber}</Button>
                <Button onClick={onComplete}>NEXT {stepNumber}</Button>
            </StepActions>
        </Step>
    );
};

describe('StepGroup component', () => {
    beforeEach(() => {
        mockUseBreakpointValue.mockReturnValue(false);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('Should display the steps correctly and only the first step is active', () => {
        render(<StepGroup steps={[DummyStep, DummyStep, DummyStep]} />);

        initialStateAssertion(screen);
    });

    it('Should navigate to the next step when first is completed', () => {
        render(<StepGroup steps={[DummyStep, DummyStep, DummyStep]} />);
        initialStateAssertion(screen);
        fireEvent.click(screen.getByText('NEXT 1'));

        expect(
            screen.queryByText('Step body number 1')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Step body number 2')).toBeInTheDocument();
        expect(screen.getByText('PREVIOUS 2')).toBeInTheDocument();
        expect(screen.getByText('NEXT 2')).toBeInTheDocument();
    });

    it('Should navigate to the previous step when click on previous button', () => {
        render(<StepGroup steps={[DummyStep, DummyStep, DummyStep]} />);
        initialStateAssertion(screen);
        fireEvent.click(screen.getByText('NEXT 1'));
        expect(
            screen.queryByText('Step body number 1')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Step body number 2')).toBeInTheDocument();

        fireEvent.click(screen.getByText('PREVIOUS 2'));

        expect(
            screen.queryByText('Step body number 2')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Step body number 1')).toBeInTheDocument();
    });

    it('Should not allow to go back to Step 0 when clicking previous', () => {
        render(<StepGroup steps={[DummyStep, DummyStep, DummyStep]} />);
        initialStateAssertion(screen);

        fireEvent.click(screen.getByText('PREVIOUS 1'));

        initialStateAssertion(screen);
    });

    it('Should display only the active step on small screens', () => {
        mockUseBreakpointValue.mockReturnValue(true);
        render(<StepGroup steps={[DummyStep, DummyStep, DummyStep]} />);

        expect(screen.getByText('Title 1')).toBeInTheDocument();
        expect(screen.getByText('Subtitle 1')).toBeInTheDocument();
        expect(screen.getByText('Step body number 1')).toBeInTheDocument();
        expect(screen.getByText('PREVIOUS 1')).toBeInTheDocument();
        expect(screen.getByText('NEXT 1')).toBeInTheDocument();
        expect(screen.queryByText('Title 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Title 3')).not.toBeInTheDocument();
    });

    it('Should display in the header all the step number on small screens', () => {
        mockUseBreakpointValue.mockReturnValue(true);
        render(<StepGroup steps={[DummyStep, DummyStep, DummyStep]} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
});

function initialStateAssertion(screen) {
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Subtitle 1')).toBeInTheDocument();
    expect(screen.getByText('Step body number 1')).toBeInTheDocument();
    expect(screen.getByText('PREVIOUS 1')).toBeInTheDocument();
    expect(screen.getByText('NEXT 1')).toBeInTheDocument();

    expect(screen.getByText('Title 2')).toBeInTheDocument();
    expect(screen.getByText('Subtitle 2')).toBeInTheDocument();
    expect(screen.queryByText('Step body number 2')).not.toBeInTheDocument();
    expect(screen.queryByText('PREVIOUS 2')).not.toBeInTheDocument();
    expect(screen.queryByText('NEXT 2')).not.toBeInTheDocument();

    expect(screen.getByText('Title 3')).toBeInTheDocument();
    expect(screen.getByText('Subtitle 3')).toBeInTheDocument();
    expect(screen.queryByText('Step body number 3')).not.toBeInTheDocument();
    expect(screen.queryByText('PREVIOUS 3')).not.toBeInTheDocument();
    expect(screen.queryByText('NEXT 3')).not.toBeInTheDocument();
}
