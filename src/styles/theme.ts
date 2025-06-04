// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createSystem, defaultConfig } from '@chakra-ui/react';
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
import { fieldRecipe } from './recipes/field';
import { inputRecipe } from './recipes/input';
import { dialogRecipe } from './recipes/dialog';
import { alertRecipe } from './recipes/alert';
import { radioGroupRecipe } from './recipes/radioGroup';

const theme = createSystem(defaultConfig, {
    globalCss: {
        'html, body': {
            fontSize: 'md',
            color: {
                base: 'gray.800',
                _dark: 'white',
            },
        },
        ...onboardThemeV1,
        ...onboardTheme,
        ...formsTheme,
    },
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
            input: inputRecipe,
        },
        slotRecipes: {
            table: tableRecipe,
            field: fieldRecipe,
            dialog: dialogRecipe,
            alert: alertRecipe,
            radioGroup: radioGroupRecipe,
        },
    },
});

export default theme;
