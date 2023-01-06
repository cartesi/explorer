// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Layout, PageBody, PageHeader, PagePanel } from '@explorer/ui';
import { FC, ReactNode } from 'react';

type Props = { children: ReactNode };

export const PageLayout: FC<Props> = ({ children }) => {
    return (
        <Layout
            footerContracts={[]}
            footerLinks={[]}
            headerLinks={[{ href: '/', key: 'home', label: 'Home' }]}
        >
            {children}
        </Layout>
    );
};

export { PageBody, PageHeader, PagePanel };
