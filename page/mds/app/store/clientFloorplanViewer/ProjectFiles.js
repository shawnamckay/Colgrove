Ext.define('mds.store.clientFloorplanViewer.ProjectFiles', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientFloorplanViewer.ProjectFile',
    proxy: {
        type: 'ajax',
        // url: 'index.cfm?fuseaction=aClientFloorplanViewer.getPushpin',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            // create  : 'index.cfm?fuseaction=aClientFloorplanViewer.acceptFileWithPushpin',
            read    : 'index.cfm?fuseaction=aClientFloorplanViewer.getProjectFiles'
            //update  : 'index.cfm?fuseaction=aClientFloorplanViewer.updatePushpinFile'
            //destroy : '/controller/destroy_action'
        }
    },
    sorters: [{
        property: 'isFolder',
        direction: 'DESC'
    }],
    listeners: {
        beforeload: function(store,operation,eOpts) {
    		
        }
    },
    autoLoad: false
});