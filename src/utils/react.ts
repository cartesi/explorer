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
import { isString } from 'lodash';
import { Duration } from 'luxon';

export function useDependentState<D>(dependency: D): [D, (data: D) => void] {
    const [state, setState] = useState<D>(dependency);

    useEffect(() => {
        setState(dependency);
    }, [dependency]);

    return [state, setState];
}

/**
 * @desc Returns a label representing the time left until the given date, or undefined if the given date is in the past.
 * Label updates every second, until it reaches the given date, where it becomes undefined.
 * @param timestamp
 * @param fields
 * @param isHumanizedOutput
 * @param format
 */
export const useTimeLeft = (
    timestamp: number,
    fields = 2,
    isHumanizedOutput = true,
    format?: string
): string | undefined => {
    const applyFormat = useCallback((duration: number, format: string) => {
        if (duration <= 0) {
            return undefined;
        }

        return Duration.fromMillis(duration).toFormat(format);
    }, []);

    const durationToShortDate = useCallback((duration: number) => {
        return new Date(duration).toISOString().substring(11, 16);
    }, []);

    const formatDuration = useCallback((duration, fields) => {
        return humanizeDuration(duration, {
            largest: fields,
            round: true,
        });
    }, []);

    const formatRemainingTime = useCallback(
        (duration: number) => {
            return isHumanizedOutput
                ? isString(format)
                    ? applyFormat(duration, format)
                    : formatDuration(duration, fields)
                : durationToShortDate(duration);
        },
        [
            fields,
            format,
            formatDuration,
            isHumanizedOutput,
            applyFormat,
            durationToShortDate,
        ]
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
    }, [timestamp, fields, isHumanizedOutput, format, formatRemainingTime]);

    return timeLeft;
};
