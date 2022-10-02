/**
 * MODEL
 */
Ext.define('mds.store.clientDashboard.GlobalWebcams', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'mds.model.clientDashboard.GlobalWebcamProject',
    proxy: {
        type: 'jsonp',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        url: 'index.cfm?fuseaction=aClientDashboard.getGlobalWebcams',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
