Ext.define('mds.view.clientPhotoList.PhotoCategory.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.photoCategoryTree',
    id: 'photoCategoryTree',
    store: 'clientPhotoList.PhotoCategories',
    rootVisible: false,
    useArrows: true,
    frame: false,
    border: false,
    hideHeaders:true,
    cls: 'no-leaf-icons no-parent-icons sideNavPanel',
    setUpDroppableNodes:function(userCanShare, root){
		if (root===undefined)
			root=this.store.getRootNode();
		
	    var dom=this.getView().getNode(root);
	    if (dom){
    		if (this.nodeIsValidPhotoDropTarget(root, userCanShare))
    			this.setUpDroppableNode(root);	
    		else
    			Ext.fly(dom).addCls("invalidPhotoDropTarget");
	    }
    			
    	for (var i=0; i<root.childNodes.length; i++){
            this.setUpDroppableNodes(userCanShare, root.childNodes[i]);
        }
    },
    setUpDroppableNode:function(node){
		var view=this.getView();
		var dom=view.getNode(node);
		dom.id="categoryNode_"+node.get("id");
		Ext.fly(dom).addCls("photoDropTarget");
		var ddTarget=new Ext.dd.DDTarget(dom.id, 'photosDDGroup');
    },
    endDrag:function(root){
    	Ext.select("#photoCategoryTree .photoDragTarget").each(function(i){Ext.fly(i.dom).removeCls("photoDragEnabledCategories");});
    	Ext.select("#photoCategoryTree .x-grid-row:not(.photoDragTarget)").each(function(i){Ext.fly(i.dom).removeCls("photoDragDisabledCategories");});
    },
    nodeIsValidPhotoDropTarget:function(node, userCanShare){
    	//My Albums / Project Team Album and user can share
    	return ((node.get("parentId")=="Y" || (node.get("parentId")=="P" && userCanShare))?true:false);
    }
});
//@ sourceURL=photoCategoryTree.js