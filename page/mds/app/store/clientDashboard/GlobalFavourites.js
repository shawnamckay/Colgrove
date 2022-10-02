/**
 * MODEL
 */
Ext.define('mds.store.clientDashboard.GlobalFavourites', {
    extend: 'Ext.data.Store',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'mds.model.clientDashboard.GlobalFavouriteProject',
            proxy: {
                type: 'jsonp',
                limitParam: undefined,
                pageParam: undefined,
                startParam: undefined,
                url: 'index.cfm?fuseaction=aClientDashboard.getGlobalFavourites',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});
