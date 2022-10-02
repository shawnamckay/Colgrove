/**
 * 
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalFavouritesDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalFavouritesDisp',
    hidden: true,
    id: 'globalFavourites',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'globalFavouritesList',
            width: 225
        },
        {
            xtype: 'globalFavouritesView'
        }
    ]
});