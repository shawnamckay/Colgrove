
Ext.define('mds.view.clientPhotoViewer.sidebar.vFloorPlan', {
    extend: 'Ext.container.Container'
    ,xtype: 'pvFloorPlan'
    ,id:'pvFloorPlan'
    ,hidden:true
    ,layout:{type:'vbox',align:'stretch'}
    ,height:260
    ,width:262
    ,config:{
        items: [{
            xtype:'container'
            ,id: 'floorplanContainer'
            ,flex:1
            ,style:{position:'relative'}
            ,items: [
                {
                    xtype: 'image'
                    ,id: 'pvFloorplanImg'
                }
            ]
        }
        ]
    }
});