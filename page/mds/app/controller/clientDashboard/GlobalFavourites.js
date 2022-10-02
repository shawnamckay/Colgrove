/**
 * 
 */
Ext.define('mds.controller.clientDashboard.GlobalFavourites', {
    extend: 'mds.controller.clientDashboard.AbstractDashboardController',
    models: [
        // 'clientDashboard.MapViewerProject',
        'clientDashboard.GlobalFavouriteImage',
        'clientDashboard.GlobalFavouriteProject'
    ],
    stores: [
        // 'clientDashboard.MapViewerProjects',
        'clientDashboard.GlobalFavourites'
    ],
    views: [
        'clientDashboard.GlobalFavouritesDisp',
        'clientDashboard.GlobalFavouritesList',
        'clientDashboard.GlobalFavouritesView'
    ],
    refs: [
        {
            ref: 'disp',
            selector: 'globalFavouritesDisp'
        },
        {
            ref: 'left',
            selector: 'globalFavouritesList'
        },
        {
            ref: 'right',
            selector: 'globalFavouritesView'
        }
    ],
    init: function(application) {
        var me = this;
        var store = me.getClientDashboardGlobalFavouritesStore();
        store.load();
        me.control({
            'globalFavouritesDisp': {
                show: me.onDispShow
            },
            'globalFavouritesList': {
                selectionchange: me.onProjectListSelectionChange
            },
            'globalFavouritesView': {
                dashboardpreferenceclicked: me.onDashboardpreference
            }
        });
    }
});
