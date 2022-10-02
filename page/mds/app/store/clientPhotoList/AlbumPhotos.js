Ext.define('mds.store.clientPhotoList.AlbumPhotos', {
  extend: 'mds.store.clientPhotoList.Photos',
  photoGroupIDName:"AlbumUID",
  sorters:[
    {
      property:"PhotoDate",
      direction:"DESC"
    }  
  ],
  sortOnLoad:true,
  sortOnFilter:true,
  removePhoto:function(photo, onSuccessCallback){
	  var me=this;
	  mdslib.doAjaxRequest({
	    	url: "index.cfm?fuseaction=aClientPhotoList.removeMultipleFromAlbum",
	    	params:{
		  		data:Ext.encode([
    	  		    {
    	  		    	AlbumUID: this.sourceID,
    	  		    	mixedPhotoArray: [photo.get("id")]
    	  		    }
	  		])},
	    	successCallback:function(data){
	    		var component=Ext.getStore('clientPhotoList.PhotoGroups').getComponent(me, photo);
    	        if (component){
    	          component.destroy();
    	          Ext.getCmp('photoVerticalLoadingScroller').forceUpdateLayout();
    	        }
    	        me.remove(photo);
    	        onSuccessCallback();
	    	}
	    });
  },
  addPhoto:function(photo, onSuccessCallback){
	if (this.getById(photo.get("id")))
		return;
    var me=this;
    mdslib.doAjaxRequest({
    	url: "index.cfm?fuseaction=aClientPhotoList.updateAlbum",
    	params:{
    		ProjectUID: (Ext.Object.fromQueryString(document.location.search)).ProjectUID,
    		AlbumUID: me.sourceID,
    		photos: photo.get("id")
    	},
    	successCallback:function(data){
    		me.add(photo);
    		if (onSuccessCallback)
    			onSuccessCallback();
    	}
    });
  },
  setDateRange:function(){
   this.addFilter(this.dateFilter);
  },
  clearDateRange:function(){
    this.removeFilter('date');
  },
  setLocationFilter:function(){
    this.addFilter(this.locationFilter);
  },
  clearLocationFilter:function(){
    this.removeFilter('location');
  },
  refreshLocationFilter:function(){
    if (Ext.getStore('clientPhotoList.PhotoGroups').locationArray.length!=0){
      this.addFilter(this.locationFilter);
    }
  },
  dateFilter:new Ext.util.Filter({
    id: 'date',
    filterFn:function(photo){
      var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
      var photoDate=photo.get("PhotoDate");
      if (!photoGroupStore.startDate || !photoGroupStore.endDate)
        return true;
      return ((photoGroupStore.startDate<=photoDate && photoGroupStore.endDate>=photoDate)
                ?true:false);
    }
  }),
  locationFilter:new Ext.util.Filter({
    id: 'location',
    filterFn:function(photo){
      var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
      var photoLocation=photo.get("Location");
      for (var i=0; i<photoGroupStore.locationArray.length; i++){
        if (photoGroupStore.locationArray[i]==photoLocation)
          return true;
      }
      return false;
    }
  }),
  sort:function(){
    Ext.log("Sorting Photo Store "+this.storeId);
    this.callParent(arguments);
  },
  getNode:function(){
	  var node=this.callParent(arguments);
	  if (!node)		  
	      node=Ext.getStore("clientPhotoList.PhotoCategories").getNodeByToken("S"+this.storeId.substring(1));
	  return node;
  }
});