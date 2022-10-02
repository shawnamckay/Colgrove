Ext.define('mds.store.clientFloorplanOverview.Locations', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientPhotoList.Location',
  data: [],
  constructor:function(){
    var me=this;
    var floorplanStore=Ext.getStore("clientFloorplanOverview.Floorplans");
    floorplanStore.addListener("load", function(){me.load();}, this, {single: true});
    return this.callParent(arguments);
  },
  load:function(){
    this.removeAll(false);
    var floorplanStore=Ext.getStore("clientFloorplanOverview.Floorplans");
    for (var i=0; i<floorplanStore.count(); i++){
      var locationI=floorplanStore.getAt(i).get("FloorplanDescription");
      if (locationI=="")
    	  continue;
      if (Ext.getStore("clientFloorplanOverview.Locations").find("Location", locationI)==-1){
        this.add({Location:locationI});
      }
    }
    this.fireEvent("load");
    this.fireEvent("refresh");
  }
});