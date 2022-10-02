Ext.define('mds.store.clientFloorplanViewer.Pushpins', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientFloorplanViewer.Pushpin',
    proxy: {
        type: 'jsonp',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'index.cfm?fuseaction=aClientFloorplanViewer.getPushpin'
        }
    },
    autoLoad: false
});