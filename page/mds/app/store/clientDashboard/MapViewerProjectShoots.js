/**
 * MODEL
 */
Ext.define('mds.store.clientDashboard.MapViewerProjectShoots', {
    extend: 'Ext.data.Store',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'mds.model.clientDashboard.MapViewerProjectShoot',
            proxy: {
                type: 'ajax',
                limitParam: undefined,
                pageParam: undefined,
                startParam: undefined,
                url: 'index.cfm?fuseaction=aClientDashboard.getProjectActivities',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});