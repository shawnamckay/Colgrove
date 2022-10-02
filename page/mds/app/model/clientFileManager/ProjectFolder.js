
Ext.define('mds.model.clientFileManager.ProjectFolder', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'DocumentUID',  type: 'string'},
        {name: 'DocumentID',  type: 'string'},
        {name: 'DocumentType',  type: 'number'},
        {name: 'DocumentParent',  type: 'number'},
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
        {name: 'DocumentIsDeleted',  type: 'boolean'},
        {name: 'expanded',  type: 'boolean'},
        {name: 'leaf',  type: 'boolean'},
        {name: 'isFolder',  type: 'boolean', convert: function ( value, record ) { return record.get('DocumentMimeType') == 'folder' } }
    ],
    idProperty: 'DocumentUID'
});
