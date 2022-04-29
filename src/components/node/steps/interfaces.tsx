import { MouseEventHandler } from 'react';

export interface CommonStepProps {
    stepNumber: number;
    inFocus?: boolean;
    onComplete?: MouseEventHandler<HTMLButtonElement>;
    onPrevious?: MouseEventHandler<HTMLButtonElement>;
}
