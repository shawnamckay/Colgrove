/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.GlobalWebcamProject', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientDashboard.GlobalWebcamWebcam'
    ],
    hasMany: {
        model: 'mds.model.clientDashboard.GlobalWebcamWebcam',
        name: 'webcams'
    },
    fields: [
        {
            name: 'ProjectUID'
        },
        {
            name: 'projectTitle'
        },
        {
            name: 'projectAddress'
        },
        {
            name: 'logoURL'
        }
    ]
});
