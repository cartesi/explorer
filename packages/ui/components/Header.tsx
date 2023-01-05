// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import NavBar, { HeaderLink } from './header/NavBar';
import theme from '../styles/theme';

type Props = { links: HeaderLink[] };
const Header = ({ links }: Props) => {
    return <NavBar w="100%" zIndex={theme.zIndices.xxl} links={links} />;
};

export default Header;
