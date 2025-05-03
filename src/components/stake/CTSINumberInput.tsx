// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, InputGroup, NumberInput } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { FC, useEffect, useState } from 'react';

export interface ICTSINumberInputProps {
    value?: number;
    min?: number;
    max?: number;
    maxPrecision?: number;
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
    setMaxOnOverflow = false,
    onChange,
}) => {
    const [innerValue, setInnerValue] = useState<string>('0');
    const rightElementColor = useColorModeValue('gray.300', 'white');
    const inputBg = useColorModeValue('transparent', 'dark.border.quaternary');
    const controlsColor = useColorModeValue('gray.900', 'white');

    const handleOnChange = ({ value }) => {
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
        <InputGroup>
            <NumberInput.Root
                value={innerValue}
                min={min}
                max={max}
                width="full"
                bg={inputBg}
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
                onValueChange={handleOnChange}
            >
                <NumberInput.Label />
                <InputGroup
                    endElement={
                        <NumberInput.Scrubber pr={6} pointerEvents="none">
                            <Box color={rightElementColor}>CTSI</Box>
                        </NumberInput.Scrubber>
                    }
                >
                    <>
                        <NumberInput.Control zIndex={100}>
                            <NumberInput.IncrementTrigger
                                color={controlsColor}
                            />
                            <NumberInput.DecrementTrigger
                                color={controlsColor}
                            />
                        </NumberInput.Control>
                        <NumberInput.Input paddingInlineEnd={16} />
                    </>
                </InputGroup>
            </NumberInput.Root>
        </InputGroup>
    );
};
