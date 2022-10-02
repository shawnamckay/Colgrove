Ext.define('mds.controller.clientDashboard.GlobalVideos', {
    extend: 'mds.controller.clientDashboard.AbstractDashboardController',
    views: ['clientDashboard.GlobalVideosDisp', 'clientDashboard.GlobalVideosList', 'clientDashboard.GlobalVideosView'],
    refs: [{
        ref: 'disp',
        selector: 'globalVideosDisp'
    }, {
        ref: 'left',
        selector: 'globalVideosList'
    }, {
        ref: 'right',
        selector: 'globalVideosView'
    }],
    init: function(application){
        var me=this;
        me.control({
            'globalVideosDisp': {
                show: me.onDispShow
            },
            'globalVideosList': {
                selectionchange: me.onProjectListSelectionChange
            },
            'globalVideosView': {
                dashboardpreferenceclicked: me.onDashboardpreference
            }
        });
    }
});
