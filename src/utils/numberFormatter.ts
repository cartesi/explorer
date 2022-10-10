import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
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
    options?: Intl.NumberFormatOptions
) => {
    const formatter = new Intl.NumberFormat('en-US', options);
    return formatter.format(value * 100);
};

export const formatPercent = (
    value: BigNumberish,
    options?: Intl.NumberFormatOptions
) => {
    if (typeof value === 'number') {
        return formatPercentNumber(value, options);
    } else {
        return formatPercentNumber(parseFloat(value.toString()), options);
    }
};

/**
 *
 * @param value BigNumberish from ethers project
 * @param unit 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration';
 * @param options Intl.NumberFormat options
 * @returns a pair [valueAsString, unitAsString]
 */
export const format = (
    value: BigNumberish,
    unit: Unit,
    options: Intl.NumberFormatOptions
): string[] => {
    const numberFormat = new Intl.NumberFormat('en-US', options);
    switch (unit) {
        case 'eth':
            return [
                numberFormat.format(parseFloat(formatUnits(value, 18))),
                'ETH',
            ];
        case 'ctsi':
            return [
                numberFormat.format(parseFloat(formatUnits(value, 18))),
                'CTSI',
            ];
        case 'percent':
            return [formatPercent(value, options), '%'];
        case 'usd':
            return [numberFormat.format(parseFloat(value.toString())), 'USD'];
        case 'duration':
            return formatDuration(parseFloat(value.toString()));
        default:
            return [numberFormat.format(BigNumber.from(value).toNumber()), ''];
    }
};

/**
 *
 * @param value BigNumberish from ethers project
 * @param unit 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration';
 * @param options Intl.NumberFormat options
 * @returns {String} value as string
 */
export const formatValue = (
    value: BigNumberish,
    unit: Unit,
    options: Intl.NumberFormatOptions
): string => {
    const [stringValue] = format(value, unit, options);
    return stringValue;
};

export const formatNumberValue = (
    value: number,
    fractionDigits = 2,
    unit = 'decimal'
): string => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
        notation: 'compact',
        style: unit,
    });

    return numberFormat.format(value);
};
