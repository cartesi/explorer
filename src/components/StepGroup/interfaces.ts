// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export interface IStepMeta {
    title: string;
    subtitle: string;
}

/**
 * API expected by the StepGroup for each Step component so the StepGroup injects the
 * expected functions to move around and present it's own header when rendering on small screens using expected data
 * from onStepActive callback. That is based in duck typing.
 */
export interface IStep {
    stepNumber: number;
    inFocus?: boolean;
    onComplete?: (...a: any) => void;
    onPrevious?: (...a: any) => void;
    onStepActive?: (stepInfo: IStepMeta) => void;
}
