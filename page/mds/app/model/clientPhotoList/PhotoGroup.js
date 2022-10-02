Ext.define('mds.model.clientPhotoList.PhotoGroup', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'PhotoGroupDate',
        type: 'tzaDate'
    }, {
        name: 'FormattedDate',
        convert: function(v, rec){
            return Ext.util.Format.date(rec.data.PhotoGroupDate, "F j, o");
        }
    }, {
        name: 'Label'
    }, {
        name: 'ShootUID',
        defaultValue: null
    }, {
        name: 'AlbumUID',
        defaultValue: null
    }, {
        name: 'MemberUID',
        defaultValue: null
    }, {
        name: 'PhotoGroupType',
        type: "string",
        convert: function(v, record){
            var ShootUID=record.get("ShootUID");
            var AlbumUID=record.get("AlbumUID");
            var MemberUID=record.get("MemberUID");
            return (ShootUID?"S":(AlbumUID?"A":"U"));
        }
    }, {
        name: 'id',
        convert: function(v, record){
            var photoGroupType=record.get("PhotoGroupType");
            var id="";
            if (photoGroupType=="S"){
                id=record.get("ShootUID");
            } else if (photoGroupType=="A"){
                id=record.get("AlbumUID");
            } else if (photoGroupType=="U"){
                id=record.get("MemberUID");
            }
            return id;
        }
    }, {
        name: 'newestPhotoDate',
        type: 'date',
        convert: function(value, record){
            if (!value) return record.getData().PhotoGroupDate;
            var dsSplit=value.split(" ");
            if (dsSplit.length>4) dsSplit.pop();
            return new Date(dsSplit.join(" "));
        }
    }, {
        name: 'oldestPhotoDate',
        type: 'date',
        convert: function(value, record){
            if (!value) return record.getData().PhotoGroupDate;
            var dsSplit=value.split(" ");
            if (dsSplit.length>4) dsSplit.pop();
            return new Date(dsSplit.join(" "));
        }
    }, {
        name: 'Location',
        type: 'auto',
        defaultValue: null
    }, {
        name: 'Description',
        mapping: 'AlbumDescription',
        type: 'string',
        defaultValue: null
    }, {
        name: 'IsSystemAlbum',
        type: 'boolean',
        defaultValue: false
    }, {
        name: 'ShareTypeID',
        type: 'int',
        defaultValue: null
    }, {
        name: 'MemberArray',
        mapping: 'SerializedMemberList',
        convert: function(value, record){
            if (typeof (value)=="object") return value;
            return (!value?[]:value.split(","));
        }
    }, {
        name: 'userCanEditAlbum',
        type: 'boolean',
        defaultValue: false
    }],
    equals: function(photoGroup){
        return (this.get('PhotoGroupType')==photoGroup.get('PhotoGroupType')&&this.get('id')==photoGroup.get('id')&&this.get('PhotoGroupDate')==photoGroup.get('PhotoGroupDate'));
    },
    getIDName: function(){
        var type=this.get("PhotoGroupType");
        return (type=="S"?"ShootUID":(type=="A"?"AlbumUID":"MemberUID"));
    }

});
// @ sourceURL=photoGroup.js
