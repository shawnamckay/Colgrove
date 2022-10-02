Ext.define('mds.store.clientPhotoList.FlatUserAlbums', {
    extend: 'Ext.data.Store',
    fields: ['AlbumUID', 'AlbumName'],
    data: [],
    autoLoad: false,
    constructor: function(){
        Ext.getStore("clientPhotoList.PhotoCategories").addListener("append", function(store, node, index){
            this.addNode(node);
        }, this);
        return this.callParent(arguments);
    },
    addNode: function(node){
        if ((node.parentNode.get("value")=="My Albums"&&node.get("type")=="A")||(node.parentNode.get("value")=="Project Team Albums")){
            this.add({
                AlbumUID: node.get("id"),
                AlbumName: node.get("value")
            });
        }
    },
    hasNonSystemAlbums: function(){
        return (this.count()?true:false);
    }
});