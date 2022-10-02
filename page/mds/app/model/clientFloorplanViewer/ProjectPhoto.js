
Ext.define('mds.model.clientFloorplanViewer.ProjectPhoto', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'UDEFPhotoUID',  type: 'string'},
        {name: 'UDEFPhotoOriginalFileName',  type: 'string'},
        {name: 'UDEFPhotoFileName',  type: 'string'},
        {name: 'PhotoURL',  type: 'string'},
        {name: 'ThumbURL',  type: 'string'},
        {name: 'MediumURL',  type: 'string'},
        {name: 'UDEFPhotoFileSize',  type: 'number'},
        {name: 'UploadedBy',  type: 'string'},
        {name: 'UDEFPhotoDate',  type: 'date'},
        {name: 'ShareTypeID',  type: 'int'},
        {name: 'MemberList',  type: 'string'}
    ],
    idProperty: 'UDEFPhotoUID'
});
