
Ext.define('mds.view.clientPhotoViewer.vPhoto', {
    extend: 'Ext.container.Container'
    ,id : 'photoViewContainer'
    ,xtype : 'pvPhotoView'
    ,layout:{type:'vbox',align:'stretch'}
    ,config:{
        items: [
            {
                xtype: 'container'
                ,id: 'pvPhotoViewInner'
                ,style:{overflow:'hidden',position:'relative'}
                ,width:'100%'
                ,height:'100%'
                ,flex:1
                ,items:[{
                    xtype: 'image'
                    ,id: 'pvImage'
                    ,style:{position:'relative'}
                    ,draggable:true
                    ,listeners: {
                        load : {
                            fn: function(e, t) {
                                mds.app.fireEvent('imgLoad', this, e, t);
                            },
                            element: 'el',
                            scope: this
                        }
                    }
                },
                {
                    xtype: 'annotationsDC'
                }]
            }
        ]
    }
});