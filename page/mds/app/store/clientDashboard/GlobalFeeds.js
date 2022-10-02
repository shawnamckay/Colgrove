/**
 * MODEL
 */
Ext.define('mds.store.clientDashboard.GlobalFeeds', {
    extend: 'Ext.data.Store',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'mds.model.clientDashboard.GlobalFeedProject',
            proxy: {
                type: 'jsonp',
                limitParam: undefined,
                pageParam: undefined,
                startParam: undefined,
                url: 'index.cfm?fuseaction=aClientDashboard.getGlobalFeedDailyUpdates',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});
