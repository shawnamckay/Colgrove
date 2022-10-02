Ext.define('mds.store.clientPhotoViewer.Photos', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoViewer.Photo',
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aclientPhotoViewer.getPhotos',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad:false
});