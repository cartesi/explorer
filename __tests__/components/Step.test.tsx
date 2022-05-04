// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import {
    Step,
    StepBody,
    StepActions,
    StepStatus,
} from '../../src/components/Step';
import { Button, Heading } from '@chakra-ui/react';

describe('Step component', () => {
    const CreateStep = (status: StepStatus) => (
        <Step
            stepNumber={1}
            title="Hello There"
            subtitle="This is the first step"
            status={status}
        >
            <StepBody>
                <Heading>That is the body</Heading>
            </StepBody>
            <StepActions>
                <Button>Next</Button>
            </StepActions>
        </Step>
    );
    afterEach(() => {
        cleanup();
    });

    it('should render the header, body and actions when status is active', () => {
        render(CreateStep(StepStatus.ACTIVE));

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Hello There')).toBeInTheDocument();
        expect(screen.getByText('This is the first step')).toBeInTheDocument();
        expect(screen.getByText('That is the body')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should render only the header title and subtitle and step number when status is not-active ', () => {
        render(CreateStep(StepStatus.NOT_ACTIVE));

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Hello There')).toBeInTheDocument();
        expect(screen.getByText('This is the first step')).toBeInTheDocument();
        expect(screen.queryByText('That is the body')).not.toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should render only the title, subtitle and check icon instead of step number when status is completed ', () => {
        const { container } = render(CreateStep(StepStatus.COMPLETED));

        expect(container.querySelector('.step-header svg')).toBeInTheDocument();
        expect(screen.getByText('Hello There')).toBeInTheDocument();
        expect(screen.getByText('This is the first step')).toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument();
        expect(screen.queryByText('That is the body')).not.toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
});
