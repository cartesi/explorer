import { formatUnits } from 'viem';
import { Numeric, toBigInt } from './bigint';
import humanizeDuration from 'humanize-duration';

export type Unit = 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration';

export const formatDuration = (ms: number): string[] => {
    return humanizeDuration(ms, {
        round: true,
        largest: 1,
    }).split(' ');
};

export const formatPercentNumber = (
    value: number,
    options?: Intl.NumberFormatOptions,
) => {
    const formatter = new Intl.NumberFormat('en-US', options);
    return formatter.format(value * 100);
};

export const formatPercent = (
    value: Numeric,
    options?: Intl.NumberFormatOptions,
) => {
    if (typeof value === 'number') {
        return formatPercentNumber(value, options);
    } else {
        return formatPercentNumber(parseFloat(value.toString()), options);
    }
};

/**
 *
 * @param value bigint | number | string
 * @param unit 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration';
 * @param options Intl.NumberFormat options
 * @returns a pair [valueAsString, unitAsString]
 */
export const format = (
    value: Numeric,
    unit: Unit,
    options: Intl.NumberFormatOptions,
): string[] => {
    const numberFormat = new Intl.NumberFormat('en-US', options);
    switch (unit) {
        case 'eth':
            return [
                numberFormat.format(
                    parseFloat(formatUnits(toBigInt(value), 18)),
                ),
                'ETH',
            ];
        case 'ctsi':
            return [
                numberFormat.format(
                    parseFloat(formatUnits(toBigInt(value), 18)),
                ),
                'CTSI',
            ];
        case 'percent':
            return [formatPercent(value, options), '%'];
        case 'usd':
            return [numberFormat.format(parseFloat(value.toString())), 'USD'];
        case 'duration':
            return formatDuration(parseFloat(value.toString()));
        default:
            return [numberFormat.format(Number(value)), ''];
    }
};

/**
 *
 * @param value bigint | number | string
 * @param unit 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration';
 * @param options Intl.NumberFormat options
 * @returns {String} value as string
 */
export const formatValue = (
    value: Numeric,
    unit: Unit,
    options: Intl.NumberFormatOptions,
): string => {
    const [stringValue] = format(value, unit, options);
    return stringValue;
};

type IntlUnit = keyof Intl.NumberFormatOptionsStyleRegistry;

type FormatNumberValueFn = (
    value: number,
    fractionDigits?: number,
    unit?: IntlUnit,
) => string;

export const formatNumberValue: FormatNumberValueFn = (
    value: number,
    fractionDigits = 2,
    unit = 'decimal',
) => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
        notation: 'compact',
        style: unit,
    });

    return numberFormat.format(value);
};
