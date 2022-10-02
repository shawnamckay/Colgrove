/**
 * STORE
 */
Ext.define('mds.store.clientTeamTalk.GetTeamTalk', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'test', 
            type: 'string',
            defaultValue: 'testDefault'
        }
    ],
    proxy: {
        type: 'ajax',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        url: 'index.cfm?fuseaction=aClientTeamTalk.getTeamTalk',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json'
        }
    },
    autoLoad: false,
    listeners: {
        // beforeload(Ext.data.Store store, Ext.data.Operation operation, Object eOpts)
        beforeload: function() {
            var me = this;
            var search = (Ext.Object.fromQueryString(document.location.search));
            var searchP = search.ProjectUID ? search.ProjectUID : '00000000-0000-0000-0000-000000000000';
            var ajaxProxy = me.getProxy();
            ajaxProxy.setExtraParam('ProjectUID', searchP);
        }
    }
});
