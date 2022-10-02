
Ext.define('mds.model.clientFileManager.ProjectFile', {
    extend: 'Ext.data.Model',
    requires: ['mds.model.clientFileManager.Pushpin'],
    requires: ['mds.model.clientFileManager.Version'],
    fields: [
        {name: 'DocumentUID',  type: 'string'},
        {name: 'DocumentID',  type: 'number'},
        {name: 'ProjectID',  type: 'number'},
        {name: 'DocumentType',  type: 'number'},
        {name: 'DocumentParent',  type: 'number'},
        {name: 'DocumentSymbol',  type: 'string'},
        {name: 'DocumentShortName',  type: 'string'},
        {name: 'DocumentDescription',  type: 'string'},
        {name: 'DocumentFilename',  type: 'string'},
        {name: 'DocumentURL',  type: 'string', convert:function(value, record){
        	return "../images/projects/"+record.get("ProjectID")+"/UDEFuploads/udefdocuments/"+record.get("DocumentUID")+"/"+record.get("DocumentFilename");
        }},
        {name: 'DocumentFileSize',  type: 'number'},
        {name: 'DocumentMimeType',  type: 'string'},
        {name: 'DocumentTypeName',  type: 'string'},
        {name: 'DocumentCreator',  type: 'number'},
        {name: 'DocumentCreatorName',  type: 'string'},
        {name: 'DocumentLastEditorName',  type: 'string'},
        {name: 'DocumentCreationDate',  type: 'date'},
        {name: 'DocumentLastEditedDate',  type: 'date'},
        {name: 'DocumentIsDeleted',  type: 'boolean'},
        {name: 'PushpinCount',  type: 'number'},
        {name: 'VersionCount',  type: 'number'},
        // {name: 'Pushpins',  type: 'struct'},
        {name: 'ShareTypeID',  type: 'int'},
        {name: 'MemberList',  type: 'string'},
        {name: 'expanded',  type: 'boolean', convert: function ( value, record ) { return true}},
        {name: 'leaf',  type: 'boolean', convert: function ( value, record ) { return !record.get('DocumentMimeType') == 'folder' } },
        {name: 'isFolder',  type: 'boolean', convert: function ( value, record ) { return record.get('DocumentMimeType') == 'folder' } }
    ],
    hasMany:[
        {
           model:'mds.model.clientFileManager.Pushpin',
           name: 'getPushpinStore',
           associationKey: 'Pushpins'
        },
        {
           model:'mds.model.clientFileManager.Version',
           name: 'getVersionStore',
           associationKey: 'Versions'
        }
    ],
    idProperty: 'DocumentUID'
});
