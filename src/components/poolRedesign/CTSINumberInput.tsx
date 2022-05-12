// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    InputRightElement,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { FC, LegacyRef, useEffect, useState } from 'react';

interface ICTSINumberInputProps {
    defaultValue?: number;
    min?: number;
    max?: number;
    ref?: LegacyRef<HTMLDivElement>;
    maxPrecision?: number;
    hasNumberSteppers?: boolean;
    setMaxOnOverflow?: boolean;
    onChange?: (
        bigNumberValue: BigNumber,
        numberValue: number,
        value: string
    ) => void;
}

export const CTSINumberInput: FC<ICTSINumberInputProps> = ({
    defaultValue,
    min = 0,
    max,
    maxPrecision = 18,
    hasNumberSteppers = true,
    setMaxOnOverflow = false,
    onChange,
}) => {
    const [innerValue, setInnerValue] = useState<string>(
        '0' // defaultValue?.toFixed(4)?.toString()?.replace(/\.0+$/, '') || '0' // remove trailing zeroes. i.e: 123.00
    );

    const handleOnChange = (value) => {
        console.log('onchange called');
        const numberValue = parseFloat(value);

        if (isNaN(numberValue) || numberValue < min) {
            // on bad input, set the min allowed

            setInnerValue(min.toString());

            if (onChange) {
                onChange(
                    parseUnits(min.toString(), maxPrecision),
                    min,
                    min.toString()
                );
            }

            return;
        }

        // remove trailing zero. ex: 0123
        if (value.startsWith('0') && value.length > 1) {
            value = value.substring(1);
        }

        setInnerValue(value);

        if (onChange) {
            onChange(parseUnits(value, maxPrecision), numberValue, value);
        }
    };

    useEffect(() => {
        if (!defaultValue) return;

        console.log('changed default value', defaultValue);

        const value =
            defaultValue?.toFixed(4)?.toString()?.replace(/\.0+$/, '') || '0';

        setInnerValue(value);
    }, [defaultValue]);

    // useEffect(() => {
    //     handleOnChange(innerValue);
    // }, [innerValue, handleOnChange]);

    return (
        <NumberInput
            value={innerValue}
            min={min}
            max={max}
            onBeforeInputCapture={(e) => {
                const inputText: string = (e as any)?.data;

                // no -/+ e7 allowed
                if (
                    inputText.includes('-') ||
                    inputText.includes('+') ||
                    inputText.includes('e')
                ) {
                    e.preventDefault();
                    return;
                }

                // in case of double ..
                if (inputText === '.' && innerValue.includes('.')) {
                    e.preventDefault();
                    return;
                }

                // in case of paste
                if (
                    inputText.includes('.') &&
                    inputText.split('.')[1].length >= maxPrecision
                ) {
                    e.preventDefault();
                    return;
                }

                // in case of typing
                if (
                    innerValue.includes('.') &&
                    innerValue.split('.')[1].length >= maxPrecision
                ) {
                    e.preventDefault();
                    return;
                }

                if (
                    parseFloat(innerValue) > max ||
                    parseFloat(inputText) > max // ||
                    // parseFloat(innerValue + inputText) > max
                ) {
                    e.preventDefault();
                    if (setMaxOnOverflow) setInnerValue(max.toString());
                }
            }}
            onChange={handleOnChange}
        >
            <NumberInputField />
            <InputRightElement
                color="gray.300"
                size="lg"
                pointerEvents="none"
                w={hasNumberSteppers ? 24 : 14}
                h="100%"
                children={<Box>CTSI</Box>}
            />
            {hasNumberSteppers && (
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            )}
        </NumberInput>
    );
};
