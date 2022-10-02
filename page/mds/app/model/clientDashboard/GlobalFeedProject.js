/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.GlobalFeedProject', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientDashboard.GlobalFeedShoot'
    ],
    hasMany: {
        model: 'mds.model.clientDashboard.GlobalFeedShoot',
        name: 'shoots'
    },
    fields: [
        {
            name: 'id'
        },
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
            name: 'date'
        },
        {
            name: 'count'
        },
        {
            name: 'logoURL'
        }
    ]
});
