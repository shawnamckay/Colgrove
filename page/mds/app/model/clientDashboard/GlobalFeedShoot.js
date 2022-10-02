/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.GlobalFeedShoot', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientDashboard.GlobalFeedProject'
    ],
    belongsTo: {
        model: 'mds.model.clientDashboard.GlobalFeedProject'
    },
    fields: [
        {
            name: 'plan'
        },
        {
            name: 'type'
        },
        {
            name: 'count'
        },
        {
            name: 'ShootUID'
        },
        {
            name: 'image0ID'
        },
        {
            name: 'image0URL'
        },
        {
            name: 'image1ID'
        },
        {
            name: 'image1URL'
        },
        {
            name: 'image2ID'
        },
        {
            name: 'image2URL'
        },
        {
            name: 'image3ID'
        },
        {
            name: 'image3URL'
        }
    ]
});
