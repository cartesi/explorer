// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NavBar } from '../../components/header/NavBar';

export default {
    title: 'Header/NavBar',
    component: NavBar,
    argTypes: {},
} as ComponentMeta<typeof NavBar>;

const Template: ComponentStory<typeof NavBar> = (args) => <NavBar {...args} />;

const defaultProps = {
    links: [
        {
            key: 'home',
            label: 'Home',
            href: '/',
        },
        {
            key: 'stake',
            label: 'Stake',
            href: '/stake',
        },
        {
            key: 'runners',
            label: 'Node Runners',
            href: '/node-runners',
        },
        {
            key: 'blocks',
            label: 'Blocks',
            href: '/blocks',
        },
    ],
};

export const Standard = Template.bind({});
Standard.args = { ...defaultProps };
Standard.story = {
    parameters: {
        nextRouter: {
            path: '/pools/[id]',
            asPath: '/pools/0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            query: {
                id: '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
            },
        },
    },
};
