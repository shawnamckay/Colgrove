Ext.define('mds.store.clientWebcamOverview.Webcams', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientWebcamOverview.Webcam',
    autoLoad: true,
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aClientWebcam.getWebcams',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            ProjectUID: (Ext.Object.fromQueryString(document.location.search)).ProjectUID
        }
    }
});