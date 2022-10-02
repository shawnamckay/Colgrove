Ext.define('mds.store.clientPhotoList.UDEFPhotos', {
  extend: 'mds.store.clientPhotoList.Photos',
  photoGroupIDName:"MemberUID",
  config:{
    id:undefined,
    sourceID:undefined,
    date:undefined //used to set additional lookup parameter
  },
  constructor:function(){
    this.callParent(arguments);
    var photoProxy=this.getProxy();
    photoProxy.setExtraParam("PhotoGroupDate", Ext.Date.format(this.date, 'Y-m-d'));
  }  
});