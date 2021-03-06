/**
@license
MIT License
Copyright (c) 2021 Paul H Mason. All rights reserved.
*/
import { expect } from '@open-wc/testing';
import { DesignToken } from '../lib/DesignToken.js';
import { ThemeMode, DeviceType, ThemeDensity } from '../lib/Types.js';

describe('design token', () => {
    it('throws an exception if no design token data is provided', async () => {
        expect(() => new DesignToken('test-token')).to.throw('A design token must have a value.');
    });
  
    // DEFAULTS ONLY
    it('creates a basic css variable', async () => {
        const token = new DesignToken('test-token', 'red');

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(false);
        expect(token.getValue()).to.equal('red');
        expect(token.getValue()).to.equal('red');
    });

    it('creates a reference css variable', async () => {
        const token = new DesignToken('test-token', '{ref-token}');

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(false);
        expect(token.getValue()).to.equal('var(--ref-token)');
    });

    it('creates a reference css variable with simple default', async () => {
        const token = new DesignToken('test-token', '{ref-token:blue}');

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(false);
        expect(token.getValue()).to.equal('var(--ref-token, blue)');
    });
 
    it('creates a reference css variable with reference default', async () => {
        const token = new DesignToken('test-token', '{ref-token:{another-ref-token}}');

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(false);
        expect(token.getValue()).to.equal('var(--ref-token, var(--another-ref-token))');
    });


    // DARK AND LIGHT MODE
    it('creates a dark and light css variable', async () => {
        const token = new DesignToken('test-token', { dark: 'black', light: 'white'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(true);

        expect(token.getValue(ThemeMode.Light)).to.equal('white');
        expect(token.getValue(ThemeMode.Dark)).to.equal('black');
        expect(token.getValue(ThemeMode.System)).to.equal('white');
    });

    it('returns the light css variable by default', async () => {
        const token = new DesignToken('test-token', { light: 'white'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(false);

        expect(token.getValue(ThemeMode.Light)).to.equal('white');
        expect(token.getValue(ThemeMode.Dark)).to.equal('white');
        expect(token.getValue(ThemeMode.System)).to.equal('white');
    });

    it('returns the default css variable by default', async () => {
        const token = new DesignToken('test-token', 'white');

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(false);

        expect(token.getValue(ThemeMode.Light)).to.equal('white');
        expect(token.getValue(ThemeMode.Dark)).to.equal('white');
        expect(token.getValue(ThemeMode.System)).to.equal('white');
    });

    it('returns the dark css variable by if there is no light value', async () => {
        const token = new DesignToken('test-token', { dark: 'black'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');
        expect(token.hasDarkValue).to.equal(true);

        expect(token.getValue(ThemeMode.Light)).to.equal('black');
        expect(token.getValue(ThemeMode.Dark)).to.equal('black');
        expect(token.getValue(ThemeMode.System)).to.equal('black');
    });

    // DESKTOP AND MOBILE DEVICES
    it('creates a desktop and mobile css variable', async () => {
        const token = new DesignToken('test-token', { desktop: 'black', mobile: 'white'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Mobile)).to.equal('white');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('black');
        expect(token.getValue(ThemeMode.Dark, DeviceType.Mobile)).to.equal('white');
        expect(token.getValue(ThemeMode.Dark, DeviceType.Desktop)).to.equal('black');
    });

    it('returns the desktop css variable by if there is no mobile value', async () => {
        const token = new DesignToken('test-token', { desktop: 'black'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Mobile)).to.equal('black');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('black');
        expect(token.getValue(ThemeMode.Dark, DeviceType.Mobile)).to.equal('black');
        expect(token.getValue(ThemeMode.Dark, DeviceType.Desktop)).to.equal('black');
    });

    it('returns the mobile css variable by if there is no desktop value', async () => {
        const token = new DesignToken('test-token', { mobile: 'black'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Mobile)).to.equal('black');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('black');
        expect(token.getValue(ThemeMode.Dark, DeviceType.Mobile)).to.equal('black');
        expect(token.getValue(ThemeMode.Dark, DeviceType.Desktop)).to.equal('black');
    });

    // DENSITY
    it('creates a compact, comfortable and sparse css variable', async () => {
        const token = new DesignToken('test-token', { compact: 'red', comfortable: 'green', sparse: 'blue'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Compact)).to.equal('red');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Comfortable)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Sparse)).to.equal('blue');
    });

    it('returns the confortable css variable by default', async () => {
        const token = new DesignToken('test-token', { comfortable: 'green'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Compact)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Comfortable)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Sparse)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('green');
        expect(token.getValue(ThemeMode.Light)).to.equal('green');
        expect(token.getValue()).to.equal('green');
    });

    it('returns the compact css variable by default if nothing else is provided', async () => {
        const token = new DesignToken('test-token', { compact: 'green'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Compact)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Comfortable)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Sparse)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('green');
        expect(token.getValue(ThemeMode.Light)).to.equal('green');
        expect(token.getValue()).to.equal('green');
    });

    it('returns the compact css variable if no comfortable value is provided', async () => {
        const token = new DesignToken('test-token', { compact: 'green', sparse: 'blue'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Compact)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Comfortable)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Sparse)).to.equal('blue');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('green');
        expect(token.getValue(ThemeMode.Light)).to.equal('green');
        expect(token.getValue()).to.equal('green');
    });

    it('returns the sparse css variable by default if nothing else is provided', async () => {
        const token = new DesignToken('test-token', { sparse: 'green'});

        expect(token.name).to.equal('test-token');
        expect(token.cssVariable).to.equal('--test-token');

        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Compact)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Comfortable)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop, ThemeDensity.Sparse)).to.equal('green');
        expect(token.getValue(ThemeMode.Light, DeviceType.Desktop)).to.equal('green');
        expect(token.getValue(ThemeMode.Light)).to.equal('green');
        expect(token.getValue()).to.equal('green');
    });
});