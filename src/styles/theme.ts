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
// import { formsTheme } from './formsTheme';
// import { buildOnboardTheme } from './onboard';
// import { buildOnboardTheme as onboardThemeV1 } from './onboardTheme';
import { colors } from './foundations/colors';
import { fonts } from './foundations/fonts';
import { zIndices } from './foundations/zIndices';
import { tableRecipe } from './recipes/table';
import { buttonRecipe } from './recipes/button';
import { linkRecipe } from './recipes/link';
import { textRecipe } from './recipes/text';
import { headingRecipe } from './recipes/heading';

const theme = createSystem(defaultConfig, {
    // styles: {
    //     global: (props: any) => {
    //         return {
    //             'html, body': {
    //                 color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    //             },
    //             ...onboardThemeV1(props),
    //             ...buildOnboardTheme(props),
    //             ...formsTheme(),
    //         };
    //     },
    // },
    // config: {
    //     initialColorMode: 'dark',
    // },
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
