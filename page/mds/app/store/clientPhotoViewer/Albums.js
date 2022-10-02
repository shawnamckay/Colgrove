Ext.define('mds.store.clientPhotoViewer.Albums', {
    extend: 'Ext.data.Store',
    fields: ['AlbumUID', 'AlbumName', 'IsSystemAlbum'],
    proxy: {
        type: 'ajax',
        url: 'index.cfm?fuseaction=aClientPhotoViewer.getAccessibleAlbums',
        reader: {
            type: 'json'
        }
    },
    filters: [{
        property: 'IsSystemAlbum',
        value: 0
    }, function(record){
        var pageAlbumUID=(Ext.Object.fromQueryString(document.location.search)).AlbumUID;
        return (pageAlbumUID&&pageAlbumUID==record.get("AlbumUID")?false:true);
    }],
    hasNonSystemAlbums: function(){
        return (this.count()?true:false);
    }
});