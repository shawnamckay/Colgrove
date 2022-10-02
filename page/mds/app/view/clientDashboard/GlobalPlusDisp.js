/**
 * Global means "of my account", so that "of all projects in my account".
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalPlusDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalPlusDisp',
    hidden: true,
    id: 'globalPlusDisp',
    flex: 11,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'globalPlusList',
            width: 225
        },
        {
            xtype: 'globalPlusView'
        }
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});