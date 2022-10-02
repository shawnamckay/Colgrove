/**
 * STORE
 */
Ext.define('mds.store.clientNavigation.NavigationPreference4Dashboard', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'alias',
            type: 'string'
        },
        {
            name: 'visible',
            type: 'boolean'
        }
    ],
    data: [
        {
        visible: true,
        alias: "globalfeed"
        },
        {
        visible: false,
        alias: "mapviewer"
        },
        {
        visible: true,
        alias: "favourites"
        },
        {
        visible: true,
        alias: "webcams"
        },
        {
        visible: false,
        alias: "plus"
        }
    ],
    autoLoad: false
});
