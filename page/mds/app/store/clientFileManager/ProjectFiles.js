Ext.define('mds.store.clientFileManager.ProjectFiles', {
    extend: 'Ext.data.TreeStore',
    model: 'mds.model.clientFileManager.ProjectFile',
    proxy: {
        type: 'jsonp',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'index.cfm?fuseaction=aClientFileManager.getProjectFiles'
        },
        extraParams: {
            projectID: (Ext.Object.fromQueryString(document.location.search)).ProjectUID,
            parentFolderID: 0
        }
    },
    sorters: [{
        property: 'isFolder',
        direction: 'DESC'
    }],
    listeners: {
        beforeload: function(store, operation, eOpts){

        }
    },
    root: {
        DocumentFilename: 'Project files',
        DocumentMimeType: 'folder',
        DocumentParent: 0,
        expanded: true,
        loaded: true,
        id: 0
    }
});