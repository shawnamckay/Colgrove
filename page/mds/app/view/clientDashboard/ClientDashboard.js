/**
 * 
 */
Ext.define('mds.view.clientDashboard.ClientDashboard', {
    extend: 'Ext.container.Container',
    alias: 'widget.clientDashboard',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    flex: 11,
    overflowY: 'auto',
    items: [
        {xtype: 'globalFeedDisp'},
        {xtype: 'globalMapViewerDisp'},
        {xtype: 'globalFavouritesDisp'},
        {xtype: 'globalWebcamsDisp'},
        {xtype: 'globalVideosDisp'},
        {xtype: 'globalPlusDisp'}
    ]
});
