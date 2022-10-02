/**
 * MODEL
 */
Ext.define('mds.model.clientNavigation.MegamenuParent', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientNavigation.MegamenuChild'
    ],
    hasMany: {
        model: 'mds.model.clientNavigation.MegamenuChild',
        name: 'shoots'
    },
    fields: [
        {
            name: 'text'
        }
    ]
});
