/**
@license
MIT License
Copyright (c) 2021 Paul H Mason. All rights reserved.
*/
import { Theme, themeManager } from "@quark-elements/theme";

class DesignSystemProvider {
    constructor(themeType) {
        this._themeType = themeType;
    }

    get themeType() {
        return this._themeType;
    }
    
    registerComponents() {
        return this;
    }

    registerIcons() {
        return this;
    }

    registerIcon() {
        return this;
    }

    registerThemes() {
        for (let i = 0; i < arguments.length; i++) {
            const arg = arguments[i];

            if (arg instanceof this._themeType) {
                arguments[i].register();
            } else {
                console.warn('Theme is not of the correct type');
            }
        }

        return this;
    }

    useThemeBrand(name) {
        if (name) {
            themeManager.use(name);
        }
        
        return this;
    }

    clearThemeBrand() {
        themeManager.clear();
        return this;
    }

    withThemeMode(mode = 'system') {
        themeManager.mode = mode;
        return this;
    }

    addIcon(name, content, size = 24) {
        this.themeType.addIcon(name, {
            content: content,
            size: size
        });
        
        return this;
    }

    aliasIcon(name, alias) {
        this.themeType.aliasIcon(name, alias);
        return this;
    }
}

export { DesignSystemProvider, Theme, themeManager }