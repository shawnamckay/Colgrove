/**
 * CONTROLLER
 */
Ext.define('mds.controller.clientDashboard.AbstractDashboardController', {
    extend: 'Ext.app.Controller',
    onDispShow: function() {
    },
    onProjectListSelectionChange: function(dataview, selections, options) {
        var me = this;
        if (selections && selections[0] && selections[0].raw) {
            var data = selections[0].raw;
            window.location.href = '../index.htm?ProjectUID=' + data.ProjectUID;
        }
    },
    onDashboardpreference: function(model) {
        var store = mds.app.getStore('clientNavigation.MemberDashboardPreference');
        if (store){
            store.loadData([model]);
            store.sync();
        }
    },
    show: function() {
        var me = this;
        var view = me.getDisp();
        if (view)
            view.show();
    },
    hide: function() {
        var me = this;
        var view = me.getDisp();
        if (view)
            view.hide();
    }
});
//@ sourceURL=AbstractDashboardController.js