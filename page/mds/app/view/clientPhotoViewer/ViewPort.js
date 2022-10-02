Ext.define('mds.view.clientPhotoViewer.ViewPort', {
    requires:['mds.view.clientWebcamLive.CloseButton'],
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    items: [{
        id: 'viewPortContainer',
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            id: 'topNavBar',
            height: 29,
            items:[
                {
                    xtype: 'viewerclosebutton',
                    margin: "5 15 0 0"
                }
            ]
            //items: [{
            //    xtype: 'closeButtonLink',
            //    margin: "5 15 0 0"
            //}]
        }, {
            id: 'viewPortInnerContainer',
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                id: 'viewportLeftStrip',
                width: 12,
                style: 'height:100%'
            }, {
                id: 'mainContainer',
                xtype: 'pvMainView',
                flex: 1,
                minWidth: 800
            }, {
                xtype: 'container',
                id: 'viewportRightStrip',
                width: 12,
                style: 'height:100%'
            }, {
                xtype: 'pvSideBar'
            }, {
                xtype: 'container',
                id: 'viewportRightStrip2',
                width: 12,
                style: 'height:100%'
            }]
        }, {
            xtype: 'container',
            id: 'viewportBottomStrip',
            height: 12,
            style: 'width:100%'
        }]
    }]
});