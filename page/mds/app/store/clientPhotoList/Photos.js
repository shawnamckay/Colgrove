Ext.define('mds.store.clientPhotoList.Photos', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientPhotoList.Photo',
  config:{
    id:undefined, //id to lookup store
    sourceID:undefined //id for requesting data
  }, 
  proxy:{
    type: 'jsonp',
    url: 'index.cfm?fuseaction=aClientPhotoList.getPhotos&ProjectUID='+(Ext.Object.fromQueryString(document.location.search)).ProjectUID
  },
  constructor:function(){
    this.callParent(arguments);
    var photoProxy=this.getProxy();
    photoProxy.setExtraParam(this.photoGroupIDName, this.sourceID);
    this.photoIndex=0;
  },
  autoLoad:false,
  idProperty:"PhotoID",
  photoGroupIDName:"ShootUID",
  photoIndex:0,
  getNextPhoto:function(){
    if (this.photoIndex>=this.count()) return null;
    return this.getAt(this.photoIndex++);
  },
  reset:function(){
    this.photoIndex=0;
  },
  contains:function(PhotoID){
    return (this.getById(PhotoID)!=null);
  },
  destroyStore:function(keepNode){
	  if (!keepNode){
		  var node=this.getNode();
		  if (node){
			  node.parentNode.addNToCount(this.count()*-1);
			  node.remove();
		  }
	  }
	  this.callParent(arguments);
  },
  getNode:function(){
	  return Ext.getStore("clientPhotoList.PhotoCategories").getNodeByToken(this.storeId);
  },
  getComponentID:function(photo){ //needs to be updated after merge
	  return (this.storeId+"_"+photo.get("id"));  
  },
  listeners:{
	  load:function(store){
		store.loaded=true;
	  },
	  add:function(store, records, index){
		  var node=this.getNode();
		  if (node)
			  node.addNToCount(records.length);
	  },
	  bulkremove:function(store, records, indexes){
		  var node=store.getNode();
		  if (node)
			  node.addNToCount(records.length*-1);
	      for (var i=0; i<records.length; i++){
	    	  var compID=store.getComponentID(records[i]);
	    	  var dom=document.getElementById(compID);
	    	  if (dom){
	    		  if (Ext.select("#"+dom.parentNode.id+" .managedPhoto").elements.length===1)
	    			  dom.parentNode.parentNode.removeChild(dom.parentNode);
	    	      else
	    	    	  dom.parentNode.removeChild(dom);
	    	  }
	      }
	  }
  } 
});
//@ sourceURL=photoListPhotoStore.js