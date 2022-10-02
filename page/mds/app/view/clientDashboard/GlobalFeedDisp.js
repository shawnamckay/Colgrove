/**
 * 
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalFeedDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalFeedDisp',
    hidden: true,
    id: 'globalFeedDisp',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'globalFeedList',
            width: 225
        },
        {
            xtype: 'globalFeedView'
        }
    ]
});