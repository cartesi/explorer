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
import { FC, useEffect, useState } from 'react';

export interface ICTSINumberInputProps {
    value?: number;
    min?: number;
    max?: number;
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
    value,
    min = 0,
    max,
    maxPrecision = 18,
    hasNumberSteppers = true,
    setMaxOnOverflow = false,
    onChange,
}) => {
    const [innerValue, setInnerValue] = useState<string>('0');

    const handleOnChange = (value) => {
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
        if (!value) return;

        const trimmedValue =
            value?.toFixed(4)?.toString()?.replace(/\.0+$/, '') || '0';

        setInnerValue(trimmedValue);
    }, [value]);

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
                    parseFloat(inputText) > max
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
                pl={8}
                w={hasNumberSteppers ? 24 : 14}
                h="100%"
                children={<Box>CTSI</Box>}
            />
            {/* {hasNumberSteppers && (
                <NumberInputStepper data-testid="number-stepper">
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            )} */}
        </NumberInput>
    );
};
