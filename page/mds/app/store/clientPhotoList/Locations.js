Ext.define('mds.store.clientPhotoList.Locations', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientPhotoList.Location',
  data: [],
  bannedLocations: [],
  allLocations: [],
  storeIsLoading: true,
  constructor:function(){
    Ext.getStore("clientPhotoList.PhotoCategories").addListener("load", function(){this.load();}, this, {single:true});
    return this.callParent(arguments);
  },
  load:function(){
	this.addFilter(new Ext.util.Filter({
	      id: 'location',
	      filterFn:function(Location){
	      	  var store=Ext.getStore("clientPhotoList.Locations");
	      	  return (Ext.Array.indexOf(store.bannedLocations, Location.get("Location"))==-1?true:false);
    	  }
	}));
	var photoCategoryStore=Ext.getStore("clientPhotoList.PhotoCategories");
	var rootNode=photoCategoryStore.getRootNode();
	photoCategoryStore.addBranchLocations(rootNode);
    var locations=rootNode.get("locations");
    for (var i=0; i<locations.length; i++){
    	if (locations[i]=="") continue;
    	
    	var floorplan=Ext.create('mds.model.clientPhotoList.Location', {Location:locations[i]});
    	this.add(floorplan);
    	this.allLocations.push(locations[i]);
    }
    this.storeIsLoading=false;
    this.fireEvent("load");
  },
  isLoading:function(){
	  return this.storeIsLoading;
  }
});
//@ sourceURL=photoListLocationsStore.js