// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import * as React from 'react';
import { Global } from '@emotion/react';

export const Fonts = () => (
    <Global
        styles={`


        @font-face {
            font-family: "FK Grotesk";
            src: local("FK Grotesk Light Italic"), local("FKGrotesk-LightItalic"),
              url("/fonts/FKGrotesk-LightItalic.woff2") format("woff2"),
              url("/fonts/FKGrotesk-LightItalic.woff") format("woff");
            font-weight: 300;
            font-style: italic;
            font-display: swap;
          }
          
          @font-face {
            font-family: "FK Grotesk";
            src: local("FK Grotesk Italic"), local("FKGrotesk-Italic"),
              url("/fonts/FKGrotesk-Italic.woff2") format("woff2"),
              url("/fonts/FKGrotesk-Italic.woff") format("woff");
            font-weight: normal;
            font-style: italic;
            font-display: swap;
          }
          
          @font-face {
            font-family: "FK Grotesk";
            src: local("FK Grotesk Light"), local("FKGrotesk-Light"),
              url("/fonts/FKGrotesk-Light.woff2") format("woff2"),
              url("/fonts/FKGrotesk-Light.woff") format("woff");
            font-weight: 300;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: "FK Grotesk";
            src: local("FK Grotesk Regular"), local("FKGrotesk-Regular"),
              url("/fonts/FKGrotesk-Regular.woff2") format("woff2"),
              url("/fonts/FKGrotesk-Regular.woff") format("woff");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
      `}
    />
);
