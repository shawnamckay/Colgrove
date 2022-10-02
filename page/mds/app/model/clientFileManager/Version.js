
Ext.define('mds.model.clientFileManager.Version', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'DocumentUID',  type: 'string'},
        {name: 'DocumentID',  type: 'number'},
        {name: 'DocumentType',  type: 'number'},
        {name: 'DocumentParent',  type: 'number'},
        {name: 'DocumentSymbol',  type: 'string'},
        {name: 'DocumentShortName',  type: 'string'},
        {name: 'DocumentDescription',  type: 'string'},
        {name: 'DocumentFilename',  type: 'string'},
        {name: 'DocumentURL',  type: 'string'},
        {name: 'DocumentFileSize',  type: 'number'},
        {name: 'DocumentMimeType',  type: 'string'},
        {name: 'DocumentTypeName',  type: 'string'},
        {name: 'DocumentCreator',  type: 'number'},
        {name: 'DocumentCreatorName',  type: 'string'},
        {name: 'DocumentLastEditorName',  type: 'string'},
        {name: 'DocumentCreationDate',  type: 'date'},
        {name: 'DocumentLastEditedDate',  type: 'date'},
        {name: 'DocumentIsDeleted',  type: 'boolean'},
        {name: 'expanded',  type: 'boolean', convert: function ( value, record ) { return true}},
        {name: 'leaf',  type: 'boolean', convert: function ( value, record ) { return !record.get('DocumentMimeType') == 'folder' } },
        {name: 'isFolder',  type: 'boolean', convert: function ( value, record ) { return record.get('DocumentMimeType') == 'folder' } }
    ],
    idProperty: 'DocumentUID'
});
