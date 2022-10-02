Ext.define('mds.store.clientFloorplanViewer.ProjectPhotos', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientFloorplanViewer.ProjectPhoto',
    proxy: {
        type: 'ajax',
        // url: 'index.cfm?fuseaction=aClientFloorplanViewer.getPushpin',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            // create  : 'index.cfm?fuseaction=aClientFloorplanViewer.acceptFileWithPushpin',
            read    : 'index.cfm?fuseaction=aClientFloorplanViewer.getProjectPhotos'
            //update  : 'index.cfm?fuseaction=aClientFloorplanViewer.updatePushpinFile'
            //destroy : '/controller/destroy_action'
        }
    },
    listeners: {
        beforeload: function(store,operation,eOpts) {
    		
        }
    },
    autoLoad: false
});