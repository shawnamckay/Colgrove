Ext.define('mds.model.clientPhotoViewer.Comment', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'commentType',              type: 'string'},
        {name: 'commentThreadID',          type: 'numeric'},
        {name: 'commentEntryID',           type: 'numeric'},
        {name: 'commentEntryShareTypeID',  type: 'numeric'},
        {name: 'commentEntryMemberName',   type: 'string'},
        {name: 'commentEntryText',         type: 'string'},
        {name: 'commentEntryDateTime',     type: 'tzadate'},
        {name: 'commentMemberShareList',   type: 'string'},
        {name: 'projectUID',               type: 'string'},
        {name: 'photoID',                  type: 'numeric', defaultValue:0},
        {name: 'UDEFphotoUID',             type: 'string', defaultValue:''},
        {name: 'webcamphotoUID',           type: 'string', defaultValue:''},
        {name: 'memberCanEdit',            type: 'boolean', defaultValue:0},
        {name: 'commentIsDeleted',         type: 'boolean', defaultValue:0}
    ],
    belongsTo: 'clientPhotoViewer.Photo',
    proxy: {
        type: 'ajax',
        reader : {
          root:'data',
          messageProperty : 'message'
        }
    }
});