/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.GlobalFavouriteImage', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientDashboard.GlobalFavouriteProject'
    ],
    belongsTo: {
        model: 'mds.model.clientDashboard.GlobalFavouriteProject'
    },
    fields: [
        {
            name: 'src', 
            type: 'string'
        },
        {
            name: 'PhotoID', 
            type: 'numeric'
        },
        {
            name: 'UDEFPhotoUID', 
            type: 'string'
        },
        {
            name: 'WebcamPhotoUID', 
            type: 'string'
        }
    ]
});
