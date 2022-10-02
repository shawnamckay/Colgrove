Ext.define('mds.store.clientFloorplanViewer.PushpinPhotos', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientFloorplanViewer.PushpinPhoto',
    proxy: {
        type: 'jsonp',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'index.cfm?fuseaction=aClientFloorplanViewer.getPushpinPhotos'
        }
    },
    autoLoad: false
});