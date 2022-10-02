/**
 * MODEL
 */
Ext.define('mds.model.clientNavigation.NavigationBar4Project', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientNavigation.NavigationPreference4Project'
    ],
    belongsTo: {
        model: 'mds.model.clientNavigation.NavigationPreference4Project'
    },
    fields: [
        {
            name: 'alias',
            type: 'string',
            defaultValue: ''
        },
        {
            name: 'visible',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'DisplayLabel', // from ExternalLink table
            type: 'string',
            defaultValue: ''
        },
        {
            name: 'LinkURL', // from ExternalLink table
            type: 'string',
            defaultValue: ''
        },
        {
            name: 'NewWindow', // from ExternalLink table
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'CSSClass', // from ExternalLink table
            type: 'string',
            defaultValue: ''
        }
    ]
});
