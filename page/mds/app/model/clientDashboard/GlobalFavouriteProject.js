/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.GlobalFavouriteProject', {
    extend: 'Ext.data.Model',
    uses: [
        'mds.model.clientDashboard.GlobalFavouriteImage'
    ],
    hasMany: {
        model: 'mds.model.clientDashboard.GlobalFavouriteImage',
        name: 'images'
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
            name: 'logoSrc'
        },
        {
            name: 'favoritesAlbumUID'
        }
    ]
});
