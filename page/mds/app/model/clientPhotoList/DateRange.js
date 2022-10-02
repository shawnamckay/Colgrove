Ext.define('mds.model.clientPhotoList.DateRange', {
  extend: 'Ext.data.Model',
  fields:[
    { name:'Label', type:'string' },
    { name:'StartDate', type:'date' },
    { name:'EndDate', type:'date' }
  ],
  idProperty:'Label'
});