Ext.define('mds.model.clientPhotoList.Album', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'AlbumUID',
        type: 'string',
        defaultValue: ""
    }, {
        name: 'AlbumName',
        type: 'string'
    }, {
        name: 'AlbumDescription',
        type: 'string',
        defaultValue: ""
    }, {
        name: 'photos',
        type: 'array',
        defaultValue: []
    }, {
        name: 'ShareTypeID',
        type: "int",
        defaultValue: 1
    }, {
        name: 'MemberArray',
        type: 'array',
        defaultValue: []
    }],
    idProperty: "AlbumUID",
    proxy: {
        type: 'ajax',
        reader: {
            root: 'data',
            messageProperty: 'message'
        }
    }
});