Ext.define('mds.model.clientPhotoViewer.Webcam', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'WebcamUID',
        type: 'string'
    }, {
        name: 'MostRecentPhotoDate',
        type: 'tzadate'
    }, {
        name: 'FirstPhotoDate',
        type: 'tzadate'
    }, {
        name: 'WebcamLabel',
        type: 'string'
    }, {
        name: 'WebcamIsStreaming',
        type: "numeric"
    }, {
        name: 'TimelapseURL',
        type: "string"
    }],
    idProperty: "WebcamUID"
});