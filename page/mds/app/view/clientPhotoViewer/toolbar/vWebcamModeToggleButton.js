Ext.define('mds.view.clientPhotoViewer.toolbar.vWebcamModeToggleButton', {
    id: 'webcamModeToggle',
    alias: 'widget.webcamModeToggle',
    cls: 'webcamSpecific',
    extend: 'Ext.container.Container',
    layout: {
        type: 'hbox'
    },
    defaults: {
        xtype: 'button',
        disabled: true
    },
    items: [{
        text: 'Archive',
        id: 'gotoArchive'
    }, {
        text: 'Timelapse',
        id: 'gotoTimelapse'
    }],
    listeners: {
        afterrender: function(){
            var fuseaction=mdslib.getFuseaction();
            if (fuseaction!='aClientWebcam.timelapse') Ext.getCmp("gotoTimelapse").enable();
            if (fuseaction!='aClientPhotoViewer.view') Ext.getCmp("gotoArchive").enable();

        }
    }
});