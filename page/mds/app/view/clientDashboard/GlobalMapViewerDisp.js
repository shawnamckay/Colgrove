/**
 * Global means "of my account", so that "of all projects in my account".
 * This GlobalMapViewer shows all the projects in my account.
 */
Ext.define('mds.view.clientDashboard.GlobalMapViewerDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalMapViewerDisp',
    hidden: true,
    id: 'mapViewer',
    flex: 11,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'mapViewerProjectList',
            width: 225
        },
        {
            xtype: 'mapViewerNokiaMap',
            flex: 11
        }
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});