Ext.define('mds.store.clientPhotoViewer.Project', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoViewer.Project',
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aclientPhotoViewer.getProject',
        reader: {
            type: 'json'
        },
        extraParams: {
            ProjectUID: (Ext.Object.fromQueryString(document.location.search)).ProjectUID
        }
    },
    autoLoad: true
});