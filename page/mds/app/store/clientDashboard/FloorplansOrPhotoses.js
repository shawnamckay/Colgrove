/**
 * STORE
 */
Ext.define('mds.store.clientDashboard.FloorplansOrPhotoses', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'FloorplansOrPhotos', 
            type: 'string'
        }
    ],
    data:[{
        FloorplansOrPhotos: 'photos'
    }],
    autoLoad: false,
    my: {}
});
