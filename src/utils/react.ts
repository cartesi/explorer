// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useCallback, useEffect, useState } from 'react';
import humanizeDuration from 'humanize-duration';

/**
 * @desc Returns a label representing the time left until the given date, or undefined if the given date is in the past.
 * Label updates every second, until it reaches the given date, where it becomes undefined.
 * @param timestamp
 * @param fields
 * @param isHumanizedOutput
 */
export const useTimeLeft = (
    timestamp: number,
    fields = 2,
    isHumanizedOutput = true
): string | undefined => {
    const durationToShortDate = useCallback((duration: number) => {
        return new Date(duration).toISOString().substring(11, 16);
    }, []);

    const formatDuration = useCallback((duration: number, fields: number) => {
        return humanizeDuration(duration, {
            largest: fields,
            round: true,
        });
    }, []);

    const formatRemainingTime = useCallback(
        (duration: number) => {
            return isHumanizedOutput
                ? formatDuration(duration, fields)
                : durationToShortDate(duration);
        },
        [fields, formatDuration, isHumanizedOutput, durationToShortDate]
    );

    const [timeLeft, setTimeLeft] = useState<string>(
        formatRemainingTime(timestamp - Date.now())
    );

    useEffect(() => {
        const delay = 1000;
        const intervalId = setInterval(() => {
            if (Date.now() >= timestamp) {
                setTimeLeft(undefined);
                clearInterval(intervalId);
            } else {
                const duration = timestamp - Date.now();
                const nextTimeLeft = formatRemainingTime(duration);

                setTimeLeft(nextTimeLeft);
            }
        }, delay);

        return () => clearInterval(intervalId);
    }, [timestamp, fields, isHumanizedOutput, formatRemainingTime]);

    return timeLeft;
};
