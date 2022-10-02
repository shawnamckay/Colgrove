Ext.define('mds.store.clientPhotoList.FlatPhotoCategories', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoList.PhotoCategory',
    data: [],
    populate: function(root){
        for ( var i=0; i<root.childNodes.length; i++){
            var photoGroupCategoryNode=root.childNodes[i];
            var photoCategory=photoGroupCategoryNode.copy();
            var children=[];
            for ( var j=0; j<photoGroupCategoryNode.childNodes.length; j++){
                if (photoGroupCategoryNode.childNodes[j].get("count")!==0){
                    children.push(photoGroupCategoryNode.childNodes[j].getData());
                }
            }
            photoCategory.set("children", children);
            if (photoCategory.get("type")=="U"&&photoCategory.get("photoURL")!==""){ //My Photos
                children.push(photoCategory.getData());
                this.add(photoCategory);
            } else if (children.length!==0){
                this.add(photoCategory);
            }
        }
    },
    load: function(){
        this.removeAll();
        this.populate(Ext.getStore("clientPhotoList.PhotoCategories").getRootNode());
        this.fireEvent("load");
    }

});