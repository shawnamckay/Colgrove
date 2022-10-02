
Ext.define('mds.view.clientPhotoViewer.overlay.vLeftOverlay', {
    extend: 'Ext.container.Container'
    ,xtype: 'pvLeftOverlay'
    ,id:'overlayLeft'
    ,height:'100%'
    ,listeners: {
        click : {
            fn: function(e, t) {
                mds.app.fireEvent('clickLeftOverlay', this, e, t);
            },
            element: 'el',
            scope: this
        },
        mouseenter : {
            fn: function(e, t) {
                Ext.fly(t).addCls('mousein');
                Ext.fly(t).removeCls('mouseout');
            },
            element: 'el',
            scope: this
        },
        mouseleave : {
            fn: function(e, t) {
                Ext.fly(t).addCls('mouseout');
                Ext.fly(t).removeCls('mousein');
            },
            element: 'el',
            scope: this
        }
    }
});