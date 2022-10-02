/**
 * STORE
 */
Ext.define('mds.store.clientNavigation.MemberProjectPreference', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'MemberProjectPreference', 
            type: 'string'
        }
    ],
    proxy: {
        type: 'ajax',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        url: 'index.cfm?fuseaction=aClientNavigation.doMemberProjectPreference',
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
