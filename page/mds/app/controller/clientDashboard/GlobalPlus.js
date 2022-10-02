/**
 */
Ext.define('mds.controller.clientDashboard.GlobalPlus', {
    extend: 'Ext.app.Controller',
    stores: [
        'clientDashboard.GlobalPluses',
        'clientDashboard.FloorplansOrPhotoses'
    ],
    views: [
        'clientDashboard.GlobalPlusDisp',
        'clientDashboard.GlobalPlusList',
        'clientDashboard.GlobalPlusView',
        'clientDashboard.GlobalPlusViewAnother',
        'clientDashboard.GlobalPlusViewFloorplansOrPhotos',
        'clientDashboard.GlobalPlusViewNavigationBarPreference'
    ],
    refs: [
        {
            ref: 'disp',
            selector: 'globalPlusDisp'
        },
        {
            ref: 'left',
            selector: 'globalPlusList'
        },
        {
            ref: 'right',
            selector: 'globalPlusView'
        }
    ],
    init: function(application) {
        var me = this;
        me.control({
            'globalPlusList': {
                // Ext.selection.Model.selectionchange(Ext.selection.Model, Ext.data.Model[], eOpts)
                selectionchange: me.onGlobalPlusListSelectionChange
            }
        });
    },
    show: function() {
        var me = this;
        var view = me.getDisp();
        view.show();
    },
    hide: function() {
        var me = this;
        var view = me.getDisp();
        view.hide();
    },
    /**
     * @private
     */
    onGlobalPlusListSelectionChange: function(dataview, selections, eOpts) {
        var me = this;
        if (selections && selections[0]) {
            var data = selections[0].raw;
            var viewRight = me.getRight();
            viewRight.setSelectionModel(data);
        }
    },
    my: {}
});