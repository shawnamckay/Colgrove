/**
 * MODEL
 */
Ext.define('mds.model.clientNavigation.MegamenuChild', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientNavigation.MegamenuParent'
    ],
    belongsTo: {
        model: 'mds.model.clientNavigation.MegamenuParent'
    },
    fields: [
        {
            name: 'text'
        },
        {
            name: 'href'
        }
    ]
});
