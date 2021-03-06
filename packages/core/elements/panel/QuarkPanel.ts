/**
@license
MIT License
Copyright (c) 2021 Paul H Mason. All rights reserved.
*/
import { QuarkElement } from '../QuarkElement.js';
import { html } from 'lit';

/**
 * @customtype component
 * @summary The base component class for all Quark panel components.
 * @displayname Panel
 * @category Core
 * @slot - Default
 */
export class QuarkPanel extends QuarkElement {
    render() {
        return html`<slot></slot>`;
    }
}