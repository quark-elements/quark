/**
@license
MIT License
Copyright (c) 2021 Paul H Mason. All rights reserved.
*/
import '../_utils/DesignSystemLayoutImports.js';
import { provideMaterialDesignSystem, MaterialTheme, ThemeMode, ThemeDensity, TextDirection } from '@quark-elements/material/MaterialDesignSystem.js';

const defaultThemeBrand = new MaterialTheme('default');

provideMaterialDesignSystem()
    .registerThemes(
        defaultThemeBrand
    )
    .withThemeMode(ThemeMode.System)
    .withDensity(ThemeDensity.Comfortable)
    .withDirection(TextDirection.LTR)
    .useThemeBrand(
        defaultThemeBrand.name
    );