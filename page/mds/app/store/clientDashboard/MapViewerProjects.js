/**
 * MODEL
 */
Ext.define('mds.store.clientDashboard.MapViewerProjects', {
    extend: 'Ext.data.Store',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'mds.model.clientDashboard.MapViewerProject',
            proxy: {
                type: 'ajax',
                limitParam: undefined,
                pageParam: undefined,
                startParam: undefined,
                url: 'index.cfm?fuseaction=aClientNavigation.ProjectNavigation',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});