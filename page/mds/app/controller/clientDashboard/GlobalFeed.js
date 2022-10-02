/**
 * "GlobalFeed" is not GlobalFeeds. GlobalFeed is a collection of, say,
 *   ProjectFeeds and is a feed bunching the others.
 */
Ext.define('mds.controller.clientDashboard.GlobalFeed', {
    extend: 'mds.controller.clientDashboard.AbstractDashboardController',
    models: [
        //'clientDashboard.MapViewerProject',
        'clientDashboard.GlobalFeedProject',
        'clientDashboard.GlobalFeedShoot'
    ],
    stores: [
        //'clientDashboard.MapViewerProjects',
        'clientDashboard.GlobalFeeds'
    ],
    views: [
        'clientDashboard.GlobalFeedDisp',
        'clientDashboard.GlobalFeedList',
        'clientDashboard.GlobalFeedView'
    ],
    refs: [
        {
            ref: 'disp',
            selector: 'globalFeedDisp'
        },
        {
            ref: 'left',
            selector: 'globalFeedList'
        },
        {
            ref: 'right',
            selector: 'globalFeedView'
        }
    ],
    init: function(application) {
        var me = this;
        var store = me.getClientDashboardGlobalFeedsStore();
        store.load();
        me.control({
            'globalFeedDisp': {
                show: me.onDispShow
            },
            'globalFeedList': {
                selectionchange: me.onProjectListSelectionChange
            },
            'globalFeedView': {
                dashboardpreferenceclicked: me.onDashboardpreference
            }
        });
    }
});