function ComponentDataProcessor(baseName: string) {
    const allData = {
        components: [],
        baseComponents: [],
        designTokens: [],
        cssModules: [],
        themes: [],
        mixins: [],
        controllers: [],
        decorators: [],
        summaries: {
            components: [],
            baseComponents: [],
            designTokens: [],
            cssModules: [],
            themes: [],
            mixins: [],
            controllers: [],
            decorators: []
        }
    }

    function _sort(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    };

    function _getSuperclass(component, coreOnly) {
        let sc = null;

        if (component.superclass && component.superclass.name !== 'LitElement') {
            if (coreOnly) {
                sc = allData.baseComponents.find(c => component.superclass.name === c.name);
            } else {
                sc = allData.components.find(c => component.superclass.name === c.name);

                if (!sc) {
                    sc = allData.baseComponents.find(c => component.superclass.name === c.name);
                }
            }
        }

        return sc;
    }

    function _mergeSlots(component, coreOnly) {
        component.slots = component.slots ?? [];
        let slots = [...component.slots];

        if ((component.superclass) && (component.superclass.name !== 'LitElement')) {
            const superclass = _getSuperclass(component, coreOnly);
            const baseSlots = _mergeSlots(superclass, coreOnly);
            slots = [...slots, ...baseSlots];
        }

        return slots;
    };

    function _patchAttributes(items) {
        items.forEach(item => {
            item.attributes.forEach(attr => {
                const prop = item.properties.find(p => attr.fieldName === p.name);

                if (prop) {
                    attr.default = prop.default;
                }
            });
        });
    }

    function _addAttributes(items) {
        items.forEach(item => {
            item.properties.forEach(prop => {
                if (prop.attribute) {
                    const attr = item.attributes.filter(a => a.attribute === prop.attribute);

                    if (attr.length === 0) {
                        item.attributes.push(prop);
                    }
                }
            });
        });
    }

    require(`../../../../manifests/${baseName}/custom-elements.json`).modules.forEach(m => {
        //m.declarations.forEach(d => console.log(`${d.kind} - ${d.type?.text}`) )
        m.declarations.filter(d => (d.kind === 'class') || d.kind === 'mixin' || d.kind === 'controller' || d.kind === 'function').forEach(d => {
            //const members = d.members ? d.members.filter(m => !m.name.startsWith('_')).sort(_sort) : [];
            const members = d.members ? d.members.sort(_sort) : [];
            members.forEach(m => m.protected = m.name.startsWith('_'));

            const attributes = d.attributes ? d.attributes.filter(m => !m.name.startsWith('_') && !m.readonly).sort(_sort) : [];
            const type = d.type?.text;

            if (type) {
                switch (type) {
                    case 'decorator': {
                        const decorator = {
                            name: d.name,
                            displayName: d.displayname,
                            designSystem: d.designsystem ? d.designsystem : 'Core',
                            packageName: d.packageName ?? null,
                            category: d.category ?? null,
                            summary: d.summary ?? null,
                            description: d.description ?? null,
                            parameters: d.parameters,
                            return: d.return ? d.return : { type: { text: 'void' } }
                        }

                        allData.decorators.push(decorator);
                        allData.summaries.decorators.push({
                            name: decorator.name,
                            displayName: decorator.displayName,
                            summary: decorator.summary,
                            category: decorator.category
                        });
                        break;
                    }

                    case 'component': {
                        const component = {
                            name: d.name,
                            displayName: d.displayname,
                            designSystem: d.designsystem ? d.designsystem : 'Core',
                            packageName: d.packageName,
                            category: d.category ?? null,
                            superclass: d.superclass ? d.superclass : null,
                            tagName: d.tagName,
                            summary: d.summary,
                            description: d.description,
                            cssProperties: d.cssProperties ? d.cssProperties.sort(_sort) : [],
                            cssParts: d.cssParts ? d.cssParts.sort(_sort) : [],
                            slots: d.slots ? d.slots.sort(_sort) : [],
                            events: d.events ? d.events.sort(_sort) : [],
                            attributes: attributes,
                            properties: members ? members.filter(m => (m.kind === 'field' && !m.static)).map(m => {
                                return {
                                    name: m.name,
                                    summary: m.summary,
                                    description: m.description,
                                    type: m.type,
                                    attribute: m.attribute,
                                    default: m.default,
                                    inheritedFrom: m.inheritedFrom,
                                    allowedValues: m.allowedvalues,
                                    protected: m.protected,
                                    readonly: m.readonly
                                };
                            }) : [],
                            methods: members ? members.filter(m => (m.kind === 'method' && !m.static)).map(m => {
                                return {
                                    name: m.name,
                                    summary: m.summary,
                                    description: m.description,
                                    parameters: m.parameters,
                                    return: m.return ? m.return : { type: { text: 'void' } },
                                    inheritedFrom: m.inheritedFrom,
                                    protected: m.protected
                                };
                            }) : []
                        }

                        if (component.tagName) {
                            allData.components.push(component);
                            allData.summaries.components.push({
                                name: component.name,
                                displayName: component.displayName,
                                summary: component.summary,
                                category: component.category
                            });
                        } else {
                            delete component.tagName;
                            allData.baseComponents.push(component);
                            allData.summaries.baseComponents.push({
                                name: component.name,
                                displayName: component.displayName,
                                summary: component.summary,
                                category: component.category
                            });
                        }

                        break;
                    }

                    case 'designtoken': {
                        allData.designTokens.push(d);
                        break;
                    }

                    case 'cssmodule': {
                        allData.cssModules.push(d);
                        break;
                    }

                    case 'theme': {
                        allData.themes.push(d);
                        break;
                    }
                }
            }
        });
    });

    // Merge inherited slots.
    allData.baseComponents.forEach(c => {
        c.slots = _mergeSlots(c, true);
    });

    allData.components.forEach(c => {
        c.slots = _mergeSlots(c, false);
    });

    _addAttributes(allData.baseComponents);
    _addAttributes(allData.components)

    // Patch attributes.
    _patchAttributes(allData.baseComponents);
    _patchAttributes(allData.components);

    // Create summaries.

    return allData;
}

function ComponentNavigatorProcessor(baseName: string) {
    const data = require(`../_data/${baseName}componentdata`)();

    function _sortPages(a, b) {
        var nameA = a.label.toUpperCase();
        var nameB = b.label.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    };

    function _categorize(list: Array<any>) {
        const pages = [];
        const categories = [...new Set(list.map(p => p.category))].filter(c => c !== null).sort();
    
        categories.forEach(c => {
            pages.push({
                label: c,
                items: list.filter(a => a.category === c).sort(_sortPages)
            });
        });
    
        list.filter(a => a.category === null).forEach(c => {
            pages.push(c);
        });
    
        pages.sort(_sortPages);

        return pages;
    }

    /* COMPONENTS */
    const components = data.components.map(component => {
        return {
            url: `/${baseName}/components/${component.name}/`,
            label: component.displayName,
            category: component.category,
            designSystem: component.designSystem,
            packageName: component.packageName
        }
    });

    const componentPages = _categorize(components);

    /* BASE COMPONENTS */
    const baseComponents = data.baseComponents.map(component => {
        return {
            url: `/${baseName}/components/${component.name}/`,
            label: component.displayName,
            category: component.category,
            designSystem: component.designSystem,
            packageName: component.packageName
        }
    });

    const baseComponentPages = _categorize(baseComponents);

    /* DECORATORS */
    const decorators = data.decorators.map(decorator => {
        return {
            url: `/${baseName}/decorators/${decorator.name}/`,
            label: decorator.displayName,
            category: decorator.category,
            designSystem: decorator.designSystem,
            packageName: decorator.packageName
        }
    });

    const decoratorPages = _categorize(decorators);

    /* RESULT */
    return {
        componentPages: componentPages,
        baseComponentPages: baseComponentPages,
        decoratorPages: decoratorPages
    }
}

module.exports = {
    ComponentDataProcessor,
    ComponentNavigatorProcessor
}