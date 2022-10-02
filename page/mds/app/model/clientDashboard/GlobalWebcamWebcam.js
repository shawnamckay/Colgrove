/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.GlobalWebcamWebcam', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientDashboard.GlobalWebcamProject'
    ],
    belongsTo: {
        model: 'mds.model.clientDashboard.GlobalWebcamProject'
    },
    fields: [
        {
            name: 'WebcamUID'
        },
        {
            name: 'webcamTitle'
        },
        {
            name: 'imageURL'
        }
    ]
});
