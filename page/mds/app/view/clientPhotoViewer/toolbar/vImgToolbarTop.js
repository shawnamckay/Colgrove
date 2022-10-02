Ext.define('mds.view.clientPhotoViewer.toolbar.vImgToolbarTop', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['mds.view.clientPhotoViewer.toolbar.vWebcamModeToggleButton'],
    xtype: 'pvToolBarView',
    id: 'pvToolBarView',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    disabled: true,
    config: {
        items: [{
            xtype: 'button',
            id: 'viewPhotosAction',
            text: 'View',
            icon: 'mds/image/icon/open_photoviewer.png',
            tooltip: 'View selected photos',
            hidden: !config.SHOWPHOTOVIEWERTOOLBARACTIONS,
            margin: "0 3 0 20"
        }, {
            text: 'Save',
            xtype: 'button',
            id: 'saveBtn',
            icon: 'mds/image/icon/disk_blue.png',
            tooltip: 'Save selected photos to computer',
            margin: "0 10 0 3",
            hidden: !config.SHOWPHOTOVIEWERSAVETOCOMPUTER
        }, {
            text: 'Print',
            id: 'printPhotosAction',
            icon: 'mds/image/icon/printer_blue.png',
            tooltip: 'Print selected photos',
            hidden: !config.SHOWPHOTOVIEWERTOOLBARACTIONS,
            margin: "0 8 0 3"
        },{
            text: 'Email',
            id: 'emailPhotosAction',
            icon: 'mds/image/icon/email_link.png',
            tooltip: 'Email selected photos',
            hidden: !config.SHOWPHOTOVIEWERTOOLBARACTIONS,
            margin: "0 8 0 3"
        },{
            text: 'Annotation Mode is OFF',
            id: 'annotateBtn',
            icon: 'mds/image/icon/pencil_go.png',
            tooltip: 'Turn annotation mode on/off',
            enableToggle: true,
            disabled: true,
            hidden: !config.ANNOTATIONSDEMO,
            margin: "0 3 0 3"
        }, '->', {
            xtype: 'button',
            text: 'Slideshow',
            id: 'slideshowButton',
            iconCls: 'slideshowStart'
        }, '-', 
        
        {
            xtype: 'dateLocationToggle',
            id: 'dateLocationToggleButton',
            cls: 'floorplanSpecific',
            disabled: true,
            hidden: true,
            items: [
                {
                    id: 'tbDateBtn',
                    text: 'Date',
                    width: 58,
                    height: 22
                },
                {
                    id: 'tbLocationBtn',
                    text: 'Location',
                    width: 75,
                    height: 22
                }
            ],
            listeners: {
                click: {
                    fn: function(e, t){
                        var locationCmp = Ext.getCmp('tbLocationBtn');
                        var locationIsSelected = locationCmp.hasCls('x-sbtn-selected');
                        var dateCmp = Ext.getCmp('tbDateBtn');
                        var dateIsSelected = dateCmp.hasCls('x-sbtn-selected');
                        var retOb = {};

                        if (t.parentNode.disabled)
                            return;
                        
                        if (locationIsSelected) {
                            dateCmp.addCls('x-sbtn-selected');
                            locationCmp.removeCls('x-sbtn-selected');
                            retOb.newState = 'Date';
                        } else {
                            locationCmp.addCls('x-sbtn-selected');
                            dateCmp.removeCls('x-sbtn-selected');
                            retOb.newState = 'Location';
                        }

                        if (!Ext.getCmp('dateLocationToggleButton').isDisabled()){
                            mds.app.fireEvent('dateLocationToggleButton', this, e, retOb);
                        }
                    },
                    element: 'el',
                    scope: this
                }
            }
        },
        /*{
            xtype: 'container',
            tpl: new Ext.XTemplate('<span>Location </span>'),
            data: {},
            cls: 'modeToggleLabel floorplanSpecific',
            id: 'modeToggleLabelLocation',
            disabled: true,
            hidden: true
        }, {
            xtype: 'container',
            id: 'toolbarModeToggleButton',
            width: 50,
            cls: 'floorplanSpecific',
            disabled: true,
            hidden: true,
            tpl: new Ext.XTemplate('<div {modeSelection:this.modeSelection}></div>', {
                modeSelection: function(value){
                    if (value=='location') return 'class="toggleLocation"';
                    else if (value=='date') return 'class="toggleDate"';
                }
            }),
            data: {
                'modeSelection': 'location'
            },
            listeners: {
                click: {
                    fn: function(e, t){
                        if (!Ext.getCmp('toolbarModeToggleButton').isDisabled()){
                            mds.app.fireEvent('toolBarModeToggleButton', this, e, t);
                        }
                    },
                    element: 'el',
                    scope: this
                }
            }
        }, {
            xtype: 'container',
            tpl: new Ext.XTemplate('<span> Date</span>'),
            data: {},
            disabled: true,
            hidden: true,
            cls: 'modeToggleLabel floorplanSpecific',
            id: 'modeToggleLabelDate'
        }, */
        {
            xtype: 'webcamModeToggle',
            cls: 'webcamSpecific',
            hidden: true
        }, '']
    }
});