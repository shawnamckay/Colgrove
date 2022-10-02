
Ext.define('mds.view.clientPhotoViewer.overlay.vPhotoOverlay', {
    extend: 'Ext.container.Container'
    ,xtype: 'pvPhotoOverlay'
    ,id:'photoContainerOverlay'
    ,floating: true
    ,shadow:false
    ,layout:{type:'hbox'}
    ,config:{
        items: [{
            xtype:'pvLeftOverlay'
        },{
            xtype:'container'
            ,id:'overlayCenter'
            ,style:{cursor:'move',background:'#ffffff',opacity:0,width:'1px',filter:'alpha(opacity=0)'} // IE bug fix for mouse actions: apply background and opacity
            ,draggable:true
            ,listeners: {
                el: {
                    mousemove: function(e,t){
                        mds.app.fireEvent('overlayCDrag', this, e, t);
                    },
                    mouseup: function(e,t){
                        mds.app.fireEvent('overlayCDragMouseUp', this, e, t);
                    },
                    mousedown: function(e,t){
                        mds.app.fireEvent('overlayCDragMouseDown', this, e, t);
                    },
                    dblclick:function(e,t){
                        mds.app.fireEvent('overlayCDblClick', this, e, t);
                    }
                }
            }
        },{
            xtype:'pvRightOverlay'
        }]
    },
    listeners: {
        el: {
            mousewheel: function(e,t){
                mds.app.fireEvent('mouseWheelZoom', this, e, t);
                }
        }
    }
});