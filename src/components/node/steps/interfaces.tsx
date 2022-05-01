import { MouseEventHandler } from 'react';

export interface CommonStepProps {
    stepNumber: number;
    inFocus?: boolean;
    onComplete?: MouseEventHandler<HTMLButtonElement>;
    onPrevious?: MouseEventHandler<HTMLButtonElement>;
    onStepActive?: (stepInfo: StepInfo) => void;
}

export interface StepInfo {
    title: string;
    subtitle: string;
}
