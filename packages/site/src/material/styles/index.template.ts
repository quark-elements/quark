(function () {
    const { html } = require('@quark-elements/doc');

    const config = {
        layout: 'material',
        title: 'Styles'
    }

    const render = (data, include) => html`
    <h1>Styles</h1>
`;

    module.exports = {
        config: config,
        render: render,
    };
})();