Ext.define('mds.model.clientPhotoList.Photo', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'UDEFPhotoUID',
        type: 'auto'
    }, {
        name: 'WebcamPhotoUID',
        type: 'auto'
    }, {
        name: 'PhotoID',
        type: 'auto'
    }, {
        name: 'id',
        type: 'string',
        convert: function(value, record){
            if (record.get("PhotoID")) return 'P'+record.get("PhotoID");
            else if (record.get("UDEFPhotoUID")) return 'U'+record.get("UDEFPhotoUID");
            else if (record.get("WebcamPhotoUID")) return 'W'+record.get("WebcamPhotoUID");
            throw ("Invalid photo data");
        }
    }, {
        name: 'ImageURL',
        type: 'string'
    }, {
        name: 'PhotoDate',
        type: 'tzadate'
    }, {
        name: 'Location',
        type: 'string'
    }, {
        name: 'HasAnnotations',
        type: 'numeric'
    }, {
        name: 'CommentCount',
        type: 'numeric'
    }, {
        name: 'HasFloorplan',
        type: 'numeric'
    }, {
        name: 'PhotoNumber',
        type: 'numeric',
        defaultValue: null
    }, {
        name: 'ShareTypeID',
        type: 'numeric',
        defaultValue: null
    }, {
        name: 'MemberUIDs',
        type: 'array',
        defaultValue: null
    }, {
        name: 'ShootUID',
        type: 'string',
        defaultValue: null
    }],
    idProperty: 'id'
});
//@ sourceURL=photoListPhoto.js
