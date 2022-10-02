/**
 * 
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalWebcamsDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalWebcamsDisp',
    hidden: true,
    id: 'globalWebcams',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'globalWebcamsList',
            width: 225
        },
        {
            xtype: 'globalWebcamsView'
        }
    ]
});