/**
 * STORE
 */
Ext.define('mds.store.clientNavigation.MemberHelpVersion', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'MemberHelpVersion',
            type: 'int'
        }
    ],
    proxy: {
        type: 'ajax',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        url: 'index.cfm?fuseaction=aClientNavigation.getMemberHelpVersion',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json'
        }
    },
    autoLoad: false
});
