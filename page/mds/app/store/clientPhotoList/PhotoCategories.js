Ext.define('mds.store.clientPhotoList.PhotoCategories', {
    extend: 'Ext.data.TreeStore',
    model: 'mds.model.clientPhotoList.PhotoCategory',
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aClientPhotoList.getPhotoCategoryTree&ProjectUID='+(Ext.Object.fromQueryString(document.location.search)).ProjectUID
    },
    root: {
        text: 'All Photos',
        expanded: true,
        loaded: true,
        type: "X",
        id: "",
        cls: "photoCategoryRoot"
    },
    getUserAlbumDataArray: function(){
        var myAlbumsNode=this.getRootNode().findChild("value", "My Albums", true);
        if (!myAlbumsNode) return;

        var dataArray=[];

        for ( var i=0; i<myAlbumsNode.childNodes.length; i++){
            var nodeData=myAlbumsNode.childNodes[i].getData();
            if (nodeData.type=="A"){ //if user-created album
                dataArray.push({
                    AlbumUID: nodeData.id,
                    AlbumName: nodeData.value
                });
            }
        }
        return dataArray;
    },
    getNode: function(type, text, node){
        if (typeof (node)==="undefined"){
            node=this.getRootNode();
        }
        if (node.raw.type==type&&(typeof (text)==="undefined"||text==node.raw.text)){ return node; }
        for ( var i=0; i<node.childNodes.length; i++){
            var matchingNode=this.getNode(type, text, node.childNodes[i]);
            if (matchingNode!=null){ return matchingNode; }
        }
        return null;
    },
    getAlbumNode: function(AlbumUID, node){
        if (typeof (node)==="undefined"){
            node=this.getRootNode();
        }
        if ((node.raw.type=="A"||node.raw.type=="S")&&AlbumUID==node.raw.id){ return node; }
        for ( var i=0; i<node.childNodes.length; i++){
            var matchingNode=this.getAlbumNode(AlbumUID, node.childNodes[i]);
            if (matchingNode!=null){ return matchingNode; }
        }
        return null;
    },
    getNodePath: function(type, album, node, path){
        var targetNodeID=type+(album?"-"+album:"");
        if (typeof (node)==="undefined"){
            node=this.getRootNode();
        }
        if (typeof (path)==="undefined"){
            path=""
        }
        var path=path+("/"+node.get("nodeID"));
        if (node.get("nodeID")==targetNodeID){ return path; }

        for ( var i=0; i<node.childNodes.length; i++){
            var deeperPath=this.getNodePath(type, album, node.childNodes[i], path);
            if (deeperPath!=null){ return deeperPath; }
        }
        return null;
    },
    addBranchLocations: function(node){
        if (!node.childNodes.length) return node.get("locations");
        else{
            var nodeLocations=[];
            for ( var i=0; i<node.childNodes.length; i++){
                var childLocations=this.addBranchLocations(node.childNodes[i]);
                nodeLocations=Ext.Array.union(nodeLocations, childLocations);
            }
            node.set("locations", nodeLocations);
            return nodeLocations;
        }
    },
    getNodeByToken: function(token, node){
        if (node===undefined) node=this.getRootNode();

        var splitToken=token.split("_");
        var nodeID;
        if (splitToken.length<2||splitToken[1]=="") nodeID=splitToken[0];
        else nodeID=splitToken[0]+"-"+splitToken[1];

        if (node.get("nodeID")==nodeID) return node;

        for ( var i=0; i<node.childNodes.length; i++){
            var result=this.getNodeByToken(token, node.childNodes[i]);
            if (result!=null) return result;
        }
        return null;
    },
    listeners:{
        load:function(photoCategoriesStore){
            var node=photoCategoriesStore.getNode("S", "My Favorites");
            if (!node) return;
            var photoGroup=Ext.create('mds.model.clientPhotoList.PhotoGroup', {
                IsSystemAlbum: 1,
                AlbumUID: node.get("id")
            });
            var favouritesStore=Ext.getStore('clientPhotoList.PhotoGroups').createPhotoStore(photoGroup);
            photoCategoriesStore.favouritesStore=favouritesStore;

            var token=Ext.History.getToken();
            var onFavs=false;
            if (token){
                var splitToken=(token).split("_");
                var splitId=favouritesStore.storeId.split("_");
                if (splitToken[0]=="S"&&splitToken[1]==splitId[1]) onFavs=true;
            }
            if (!onFavs) favouritesStore.load();            
        }
    }
});
//@ sourceURL=photoListPhotoCategoriesStore.js