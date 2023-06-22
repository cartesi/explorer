// Copyright (C) 2022 Cartesi Pte. Ltd.

import { getUnixTime, startOfDay, sub } from 'date-fns';
import { pipe } from 'lodash/fp';

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

/**
 * Converts the time in milliseconds to seconds (unix timestamp).
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#get_the_number_of_seconds_since_the_ecmascript_epoch
 * @param numberInMillis
 * @returns
 */
const parseToUnixTime = (numberInMillis: number): number =>
    Math.floor(numberInMillis / 1000);

/**
 * Converts valid time in milliseconds or Date to seconds (unix timestamp).
 * @param v
 */
export function toUnixTimestamp(v: number): number;
export function toUnixTimestamp(v: Date): number;
export function toUnixTimestamp(v: Date | number): number;
export function toUnixTimestamp(v: unknown): number {
    if (typeof v === 'number') return parseToUnixTime(v);
    else if (v instanceof Date) return parseToUnixTime(v.getTime());
    else
        throw new Error(
            `Supported types are [Date, number]. number needs to be a valid timestamp in milliseconds.`
        );
}

const pastDays = (days: number) => sub(Date.now(), { days });

export const getPastDaysInSeconds = pipe(pastDays, startOfDay, getUnixTime);
