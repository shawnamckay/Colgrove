Ext.define('mds.store.clientFloorplanViewer.HotspotPhotos', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoList.Photo',
    proxy: {
        type: 'jsonp',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'index.cfm?fuseaction=aClientFloorplanViewer.getPhotosByHotspot'
        }
    },
    sorters: [{
        property: 'PhotoDate',
        direction: 'DESC'
    }],
    autoLoad: false
});
