// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CheckIcon } from '@chakra-ui/icons';
import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Spinner,
    useColorModeValue,
    VisuallyHidden,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import {
    capitalize,
    cond,
    constant,
    isFunction,
    matches,
    stubTrue,
} from 'lodash/fp';
import { useEffect, useState } from 'react';
import { Node, NodeStatus } from '../../../services/node';
import { useMessages } from '../../../utils/messages';
import { BaseInput, ValidationResult } from '../../BaseInput';

type NodeField = 'nodeAddress';
interface NodeInputProps extends BaseInput<NodeField> {
    node: Node;
    account: string;
}

const useStyle = () => {
    const helperTxtColor = useColorModeValue('gray', 'gray.100');
    return {
        helperTxtColor,
    };
};

const evaluateNodeStatus = cond<Node, NodeStatus>([
    [matches({ available: true }), constant('available')],
    [matches({ retired: true }), constant('retired')],
    [matches({ pending: true }), constant('pending')],
    [matches({ owned: true }), constant('owned')],
    [stubTrue, constant('none')],
]);

const evaluateNode = (account: string, node: Node) => {
    const status = evaluateNodeStatus(node);
    const state = { isInvalid: false, errorMessage: '', status };
    const mine = account?.toLowerCase() === node?.user.toLowerCase();
    switch (status) {
        case 'owned':
            return {
                ...state,
                isInvalid: true,
                errorMessage: mine
                    ? useMessages('node.owned.mine')
                    : useMessages('node.owned.notMine'),
            };
        case 'pending':
            return {
                ...state,
                isInvalid: true,
                errorMessage: mine
                    ? useMessages('node.pending.mine')
                    : useMessages('node.pending.notMine'),
            };
        case 'retired':
            return {
                ...state,
                isInvalid: true,
                errorMessage: useMessages('node.retired'),
            };
        default:
            return state;
    }
};

const NodeInput = ({
    onChange,
    node,
    account,
    helperText,
    onValidationChange,
}: NodeInputProps) => {
    const { helperTxtColor } = useStyle();
    const [value, setValue] = useState<string>('');
    const { isInvalid, errorMessage, status } = evaluateNode(account, node);
    const displayLoader = value && node.loading && status === 'none';
    const isAvailable = value && status === 'available';

    useEffect(() => {
        if (!isFunction(onValidationChange)) return;

        const validation: ValidationResult<NodeField> = {
            name: 'nodeAddress',
            isValid: !isInvalid,
        };

        if (isInvalid) {
            validation.error = {
                message: errorMessage,
                type: `node${capitalize(status)}`,
            };
        }

        onValidationChange(validation);
    }, [isInvalid]);

    return (
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            mb={6}
            mt={4}
            isInvalid={isInvalid}
        >
            <FormLabel htmlFor="node_address" fontWeight="medium">
                Node Address
            </FormLabel>
            <InputGroup>
                <Input
                    id="node_address"
                    type="text"
                    size="lg"
                    onChange={(evt) => {
                        const value = evt?.target?.value || '';
                        setValue(value);
                        onChange(value);
                    }}
                />
                {displayLoader && (
                    <InputRightElement
                        h="100%"
                        children={
                            <Spinner label="Checking node availability" />
                        }
                    />
                )}
                {isAvailable && (
                    <InputRightElement h="100%">
                        <>
                            <VisuallyHidden>
                                This node is available
                            </VisuallyHidden>
                            <CheckIcon
                                id="node-available-check"
                                color="green.500"
                            />
                        </>
                    </InputRightElement>
                )}
            </InputGroup>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
            {helperText && (
                <FormHelperText fontSize={14} color={helperTxtColor}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export type { NodeField };
export { NodeInput, evaluateNode };
