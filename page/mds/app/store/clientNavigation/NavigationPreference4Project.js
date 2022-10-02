/**
 * STORE
 */
Ext.define('mds.store.clientNavigation.NavigationPreference4Project', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientNavigation.NavigationPreference4Project',
    proxy: {
        type: 'jsonp',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        url: 'index.cfm?fuseaction=aClientNavigation.getNavigationPreference4Project',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        // beforeload(Ext.data.Store store, Ext.data.Operation operation, Object eOpts)
        beforeload: function() {
            var me = this;
            var search = (Ext.Object.fromQueryString(document.location.search));
            var searchP = search.ProjectUID ? search.ProjectUID : '00000000-0000-0000-0000-000000000000';
            var ajaxProxy = me.getProxy();
            ajaxProxy.setExtraParam('ProjectUID', searchP);
        }
    },
    autoLoad: false
});
