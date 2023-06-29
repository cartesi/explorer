// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { SlideInOut } from '../../../src/components/animation/SlideInOut';

const DummyComponent = ({ text }) => <h1>{text}</h1>;

describe('SlideInOut component', () => {
    it('should be able to render children component when display prop is true', () => {
        render(
            <SlideInOut display>
                <DummyComponent text="Hello there" />
            </SlideInOut>
        );

        expect(screen.queryByText('Hello there')).toBeInTheDocument();
    });

    it('should not render the children component when display prop is false', () => {
        render(
            <SlideInOut display={false}>
                <DummyComponent text="Howdy" />
            </SlideInOut>
        );

        expect(screen.queryByText('Howdy')).not.toBeInTheDocument();
    });
});
