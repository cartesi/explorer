// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createSystem, defaultConfig } from '@chakra-ui/react';
// import { Button } from './components/button';
// import { Input } from './components/input';
// import { Modal } from './components/modal';
import { formsTheme } from './formsTheme';
import { onboardTheme } from './onboard';
import { onboardTheme as onboardThemeV1 } from './onboardTheme';
import { colors } from './foundations/colors';
import { fonts } from './foundations/fonts';
import { zIndices } from './foundations/zIndices';
import { tableRecipe } from './recipes/table';
import { buttonRecipe } from './recipes/button';
import { linkRecipe } from './recipes/link';
import { textRecipe } from './recipes/text';
import { headingRecipe } from './recipes/heading';

const theme = createSystem(defaultConfig, {
    globalCss: {
        'html, body': {
            color: {
                base: 'gray.950',
                _dark: 'white',
            },
        },
        ...onboardThemeV1,
        ...onboardTheme,
        ...formsTheme,
    },
    // components: {
    //     Button,
    //     Modal,
    //     Input,
    // },
    theme: {
        tokens: {
            fonts,
            colors,
            zIndex: zIndices,
        },
        recipes: {
            button: buttonRecipe,
            link: linkRecipe,
            text: textRecipe,
            heading: headingRecipe,
        },
        slotRecipes: {
            table: tableRecipe,
        },
    },
});

export default theme;
