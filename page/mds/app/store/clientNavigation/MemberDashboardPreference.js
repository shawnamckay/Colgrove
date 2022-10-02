/**
 * STORE
 */
Ext.define('mds.store.clientNavigation.MemberDashboardPreference', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'MemberDashboardPreference',
        type: 'string'
    }],
    data: {
        MemberDashboardPreference: "globalfeed"
    },
    autoLoad: false
});
