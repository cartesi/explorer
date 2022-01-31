// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import humanizeDuration from 'humanize-duration';

export function useDependentState<D>(dependency: D): [D, (data: D) => void] {
    const [state, setState] = useState<D>(dependency);

    useEffect(() => {
        setState(dependency);
    }, [dependency]);

    return [state, setState];
}

/**
 * Returns a label representing the time left until the given date, or undefined if the given date is in the past.
 * Label updates every second, until it reaches the given date, where it becomes undefined.
 **/
export const useTimeLeft = (
    timestamp: number,
    fields = 2,
    humanizeOutput = true
) => {
    const [timeLeft, setTimeLeft] = useState<string>(undefined);
    useEffect(() => {
        const intervalId = setInterval(() => {
            const t = Date.now();
            if (t >= timestamp) {
                setTimeLeft(undefined);
                clearInterval(intervalId);
            } else {
                const duration = timestamp - Date.now();
                const outputHumanized = humanizeDuration(duration, {
                    largest: fields,
                    round: true,
                });

                const output = outputHumanized
                    .replaceAll('minutes', '')
                    .replaceAll('hours', '')
                    .replaceAll('minute', '')
                    .replaceAll('hour', '')
                    .replaceAll(',', ':')
                    .replaceAll(' ', '')
                    .trim(); // TODO: remove and use proper way to display time

                setTimeLeft(humanizeOutput ? outputHumanized : output);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timestamp, fields]);
    return timeLeft;
};
