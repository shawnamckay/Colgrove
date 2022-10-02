/**
 * 
 */
Ext.define('mds.controller.clientDashboard.GlobalWebcams', {
    extend: 'mds.controller.clientDashboard.AbstractDashboardController',
    models: [
        'clientDashboard.GlobalWebcamProject',
        'clientDashboard.GlobalWebcamWebcam'
    ],
    stores: [
        'clientDashboard.GlobalWebcams'
    ],
    views: [
        'clientDashboard.GlobalWebcamsDisp',
        'clientDashboard.GlobalWebcamsList',
        'clientDashboard.GlobalWebcamsView'
    ],
    refs: [
        {
            ref: 'disp',
            selector: 'globalWebcamsDisp'
        },
        {
            ref: 'left',
            selector: 'globalWebcamsList'
        },
        {
            ref: 'right',
            selector: 'globalWebcamsView'
        }
    ],
    init: function(application) {
        var me = this;
        var store = me.getClientDashboardGlobalWebcamsStore();
        store.load();
        me.control({
            'globalWebcamsDisp': {
                show: me.onDispShow
            },
            'globalWebcamsList': {
                selectionchange: me.onProjectListSelectionChange
            },
            'globalWebcamsView': {
                dashboardpreferenceclicked: me.onDashboardpreference
            }
        });
    }
});
