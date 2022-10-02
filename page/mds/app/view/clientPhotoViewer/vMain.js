
Ext.define('mds.view.clientPhotoViewer.vMain', {
    extend: 'Ext.container.Container'
    ,xtype : 'pvMainView'
    ,id: 'pvMainView'
    ,layout: {type: 'vbox', pack: 'center'}
    ,width:'100%'
    ,config:{
        items: [
            {
                id : 'topToolBarContainer'
                ,xtype: 'container'
                ,width: '100%'
                ,items: [{
                    xtype: 'pvToolBarView'
                }]
            },
            {
                id : 'photoContainer'
                ,xtype: 'container'
                ,layout:'fit'
                ,flex:1
                ,width: '100%'
                ,items: [
                    {xtype: 'pvPhotoOverlay'},
                    {
                        xtype:'container'
                        ,id:'overlayAnnotation'
                        ,floating: true
                        ,shadow:false
                        ,listeners: {
                            click : {
                                fn: function(e, t) {
                                    var mainController = mds.app.getController('clientPhotoViewer.Controller');
                                    mainController.disableSlideshow();
                            		var btn=Ext.getCmp("overlayAnnotation");
                            		btn.fireEvent("click", btn);
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseenter : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('HoverIn');
                                    Ext.fly(t).removeCls('HoverOut');
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseleave : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('HoverOut');
                                    Ext.fly(t).removeCls('HoverIn');
                                },
                                element: 'el',
                                scope: this
                            }
                        }
                    },
                    {
                        xtype:'container'
                        ,id:'overlayRefresh'
                        ,floating: true
                        ,shadow:false                        
                        ,listeners: {
                            click : {
                                fn: function(e, t) {
                                    var mainController = mds.app.getController('clientPhotoViewer.Controller');
                                    mainController.disableSlideshow();
                                    mainController.refreshPhotoContainer();
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseenter : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('HoverIn');
                                    Ext.fly(t).removeCls('HoverOut');
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseleave : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('HoverOut');
                                    Ext.fly(t).removeCls('HoverIn');
                                },
                                element: 'el',
                                scope: this
                            }
                        }
                    },
                    {
                        xtype:'container'
                        ,id:'overlayZoomOut'
                        ,floating: true
                        ,shadow:false                        
                        ,listeners: {
                            click : {
                                fn: function(e, t) {
                                    mds.app.fireEvent('zoomClick', this, e, t);
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseenter : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('zoomHoverIn');
                                    Ext.fly(t).removeCls('zoomHoverOut');
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseleave : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('zoomHoverOut');
                                    Ext.fly(t).removeCls('zoomHoverIn');
                                },
                                element: 'el',
                                scope: this
                            }
                        }
                    },
                    {
                        xtype:'container'
                        ,id:'overlayZoomIn'
                        ,floating: true
                        ,shadow:false                                                
                        ,listeners: {
                            click : {
                                fn: function(e, t) {
                                    mds.app.fireEvent('zoomClick', this, e, t);
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseenter : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('zoomHoverIn');
                                    Ext.fly(t).removeCls('zoomHoverOut');
                                },
                                element: 'el',
                                scope: this
                            },
                            mouseleave : {
                                fn: function(e, t) {
                                    Ext.fly(t).addCls('zoomHoverOut');
                                    Ext.fly(t).removeCls('zoomHoverIn');
                                },
                                element: 'el',
                                scope: this
                            }
                        }
                    }                    
                    ,{xtype: 'pvPhotoView'}
                ]
            },
            {
                xtype: 'container'
                ,id: 'mainContainerStrip'
                ,height: 10
                ,style: 'width:100%'
            },
            //To disable the scrollbar of photoThumbContainer, the parent container must be disabled
            //So, put it inside a container so that photoThumbContainer/its scrollbar can be disabled without disabling all of pvMainView
            {
            	xtype: 'container'
            	,id: 'photoThumbContainerWrapper'
            	,width:'100%'
            	,items:[{
                    id : 'photoThumbContainer'
                    ,xtype: 'container'
                    ,width: '100%'
                    ,height: 100
                    ,layout: {type: 'auto'}
                    ,overflowY:'hidden'
                    ,overflowX:'auto' //for horizontal scroll
                    ,style: {'white-space': 'nowrap'} //forces horizontal scroll by not allowing content to wrap
                    ,items:[{
                        xtype: 'pvPhotoThumbs'
                    }]
                    ,listeners: {
                        scroll: {
                            element: 'el'
                            ,fn: function(e, t) {mds.app.fireEvent('thumbScroll', this, e, t);}
                            ,scope:this
                        },
                        mousedown: {
                            element: 'el'
                            ,fn: function(a,b,c) {mds.app.getController('clientPhotoViewer.Controller')._manualScroll = true;}
                            ,scope:this
                        },
                        mouseup: {
                            element: 'el'
                            ,fn: function(a,b,c) {
                                    if(!mds.app.getController('clientPhotoViewer.Controller')._thumbsLoading){
                                        mds.app.getController('clientPhotoViewer.Controller')._manualScroll = false;
                                    }                                
                                }
                            ,scope:this
                        }
                    }
                }]
            }
        ]
    }
});