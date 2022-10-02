/**
 * MODEL
 */
Ext.define('mds.model.clientNavigation.NavigationPreference4Project', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientNavigation.NavigationBar4Project'
    ],
    hasMany: {
        model: 'mds.model.clientNavigation.NavigationBar4Project',
        name: 'navigationBar4Project'
    },
    fields: [
        {
            name: 'projectLogoURL',
            type: 'string',
            defaultValue: ''
        },
        {
            name: 'projectLogoHeight',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'projectLogoWidth',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'companyLogoURL',
            type: 'string',
            defaultValue: ''
        },
        {
            name: 'companyLogoHeight',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'companyLogoWidth',
            type: 'int',
            defaultValue: 0
        }
    ]
});
