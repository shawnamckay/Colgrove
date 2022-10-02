Ext.define('mds.store.clientPhotoViewer.Webcams', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoViewer.Webcam',
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aClientWebcam.getViewerWebcams',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false
});