Ext.define('mds.store.clientFloorplanViewer.PushpinFiles', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientFloorplanViewer.PushpinFile',
    proxy: {
        type: 'jsonp',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'index.cfm?fuseaction=aClientFloorplanViewer.getPushpinFiles'
        }
    },
    autoLoad: false
});