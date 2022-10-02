Ext.define('mds.model.clientWebcamLive.ConvertedAlbum', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'AlbumUID',
        type: 'string'
    }, {
        name: 'MemberName',
        type: 'string',
        defaultValue: ""
    }, {
        name: 'AlbumName',
        type: 'string',
        convert: function(value, record){
            if (record.get("MemberName")) return value+" ("+record.get("MemberName")+")";
            return value;
        }
    }, {
        name: 'IsSystemAlbum',
        type: 'boolean',
        defaultValue: false
    }]
});