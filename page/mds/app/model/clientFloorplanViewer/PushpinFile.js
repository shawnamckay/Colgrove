
Ext.define('mds.model.clientFloorplanViewer.PushpinFile', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'DocumentUID',  type: 'string'},
        {name: 'DocumentType',  type: 'number'},
        {name: 'DocumentSymbol',  type: 'string'},
        {name: 'DocumentShortName',  type: 'string'},
        {name: 'DocumentDescription',  type: 'string'},
        {name: 'DocumentFilename',  type: 'string'},
        {name: 'DocumentURL',  type: 'string'},
        {name: 'DocumentFileSize',  type: 'number'},
        {name: 'DocumentMimeType',  type: 'string'},
        {name: 'DocumentCreator',  type: 'number'},
        {name: 'DocumentCreatorName',  type: 'string'},
        {name: 'DocumentCreationDate',  type: 'date'},
        {name: 'DocumentLastEditedDate',  type: 'date'},
        {name: 'ShareTypeID',  type: 'int'},
        {name: 'MemberList',  type: 'string'}
    ],
    idProperty: 'DocumentUID'
});
