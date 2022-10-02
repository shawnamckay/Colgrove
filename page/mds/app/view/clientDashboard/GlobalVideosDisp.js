/**
 * 
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalVideosDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalVideosDisp',
    hidden: true,
    id: 'globalVideos',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'globalVideosList',
            width: 225
        },
        {
            xtype: 'globalVideosView'
        }
    ]
});