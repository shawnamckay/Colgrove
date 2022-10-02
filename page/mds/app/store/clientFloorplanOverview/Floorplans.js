Ext.define('mds.store.clientFloorplanOverview.Floorplans', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientFloorplanOverview.Floorplan',
  proxy:{
    type: 'jsonp',
    url: 'index.cfm?fuseaction=aClientFloorplanOverview.getFloorplans&ProjectUID='+(Ext.Object.fromQueryString(document.location.search)).ProjectUID
  },
  autoLoad:true,
  locationNames:[],
  locationFilter:new Ext.util.Filter({
      id: "locationFilter",
      filterFn:function(item){
        return (Ext.Array.contains(Ext.getStore("clientFloorplanOverview.Floorplans").locationNames, item.get("FloorplanDescription"))?true:false);
      }
  }),
  filterShootType:function(shootType){
      this.removeFilter("shootType");
      if (shootType!="All Shoot Types"){
          var shootTypeFilter=new Ext.util.Filter({
    	      id: "shootType",
    	      filterFn:function(item){
              	return ((item.get("ProjectShootTypeLabel")==shootType)?true:false);
              }
    	  });
    	  this.addFilter(shootTypeFilter);
      }
	  this.refreshFilters();
  },
  filterLocation:function(location){
      this.locationNames.push(location);
	  this.addFilter(this.locationFilter);
	  this.refreshFilters();
  },
  unfilterLocation:function(location){
      Ext.Array.remove(this.locationNames, location);
      if (this.locationNames.length===0){
    	  this.removeFilter("locationFilter");
      }
	  this.refreshFilters();
  },
  clearLocationFilters:function(){
      this.locationNames=[];
      this.removeFilter("locationFilter");
	  this.refreshFilters();
  }
  
});