Ext.define('mds.store.clientNavigation.ProjectFloorplans', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientNavigation.MegamenuParent',
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aClientNavigation.ProjectMegamenu',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        /**
         * beforeload(Ext.data.Store store, Ext.data.Operation operation, Object eOpts)
         */
        beforeload: function() {
            var me = this;
            var search = (Ext.Object.fromQueryString(document.location.search));
            var projectUID = search.ProjectUID ? search.ProjectUID : '00000000-0000-0000-0000-000000000000';
            var ajaxProxy = this.getProxy();
            ajaxProxy.setExtraParam('ProjectUID', projectUID);
        }
    },
    autoLoad: false
});