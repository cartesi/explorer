// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { Global } from '@emotion/react';

export const Fonts = () => (
    <Global
        styles={`
        
      @font-face {
        font-family: "Plus Jakarta Sans";
        src: local("Plus Jakarta Sans Medium"), local("PlusJakartaSans-Medium"), 
          url("/fonts/PlusJakartaSans-Medium.woff2") format('woff2');
        font-style: normal;
        font-weight: 500;
        font-display: swap;
      }
      @font-face {
        font-family: "Plus Jakarta Sans";
        src: local("Plus Jakarta Sans Semi Bold"), local("PlusJakartaSans-SemiBold"), 
          url("/fonts/PlusJakartaSans-SemiBold.woff2") format('woff2');
        font-style: normal;
        font-weight: 600;
        font-display: swap;
      }
      @font-face {
        font-family: "Inter";
        src: local("Inter Regular"), local("Inter-Regular"), 
          url("/fonts/Inter-Regular.woff2") format('woff2');
        font-style: normal;
        font-weight: normal;
        font-display: swap;
      }
      `}
    />
);
