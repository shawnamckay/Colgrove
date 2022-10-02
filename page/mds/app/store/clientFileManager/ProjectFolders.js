Ext.define('mds.store.clientFileManager.ProjectFolders', {
    extend: 'Ext.data.TreeStore',
    model: 'mds.model.clientFileManager.ProjectFolder',
    proxy: {
        type: 'jsonp',
        api: {
            read: 'index.cfm?fuseaction=aClientFileManager.getProjectFolders'
        },
        extraParams:{
            projectID: (Ext.Object.fromQueryString(document.location.search)).ProjectUID,
            parentFolderID: 0
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