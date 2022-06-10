// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NodeInput } from '../../../../src/components/node/inputs/NodeInput';
import { buildNodeObj } from '../mocks';

describe('NodeInput component', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    const onValidationStub = jest.fn();
    const onChangeStub = jest.fn();

    const Component = ({ account, node }) => (
        <NodeInput
            account={account}
            node={node}
            onChange={onChangeStub}
            onValidationChange={onValidationStub}
        />
    );

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should render as expected', () => {
        const node = buildNodeObj();
        render(<Component account={''} node={node} />);

        expect(screen.getByLabelText('Node Address')).toBeInTheDocument();
    });

    describe('Input visual feedback', () => {
        it('should display loader when value change and node is loading information', () => {
            const node = buildNodeObj();
            node.loading = true;

            render(<Component account={''} node={node} />);

            const addressInput = screen.getByLabelText('Node Address');
            fireEvent.change(addressInput, { target: { value: account } });

            expect(
                screen.getByText('Checking node availability')
            ).toBeInTheDocument();
        });

        it('Should display green checkmark when node is available', () => {
            const node = buildNodeObj('available', '0x00');
            render(<Component account={account} node={node} />);
            const addressInput = screen.getByLabelText('Node Address');
            fireEvent.change(addressInput, { target: { value: account } });
            expect(
                screen.getByText('This node is available')
            ).toBeInTheDocument();
        });
    });

    describe('validations', () => {
        it('Should display message when node-address is already owned by someone else', () => {
            const node = buildNodeObj('owned', '0x00');
            render(<Component account={account} node={node} />);
            expect(
                screen.getByText('Looks like that node is already owned.')
            ).toBeInTheDocument();
        });

        it('Should display message when node-address is already owned by the user', () => {
            const node = buildNodeObj('owned', account);
            render(<Component account={account} node={node} />);
            expect(
                screen.getByText('Looks like you already own that node.')
            ).toBeInTheDocument();
        });

        it('Should display message when node-address is in a pending state and is owned by user', () => {
            const node = buildNodeObj('pending', account);
            render(<Component account={account} node={node} />);
            expect(
                screen.getByText(
                    'Looks like the node is yours but it is in a pending state'
                )
            ).toBeInTheDocument();
        });

        it('Should display message when node-address is in a pending state but owned by someone else', () => {
            const node = buildNodeObj('pending', '0x00');
            render(<Component account={account} node={node} />);
            expect(
                screen.getByText('Looks like that node is already owned.')
            ).toBeInTheDocument();
        });

        it('Should display message when node-address is in a retired state', () => {
            const node = buildNodeObj('retired', account);
            render(<Component account={account} node={node} />);
            expect(
                screen.getByText('This node is already retired.')
            ).toBeInTheDocument();
        });
    });
});
