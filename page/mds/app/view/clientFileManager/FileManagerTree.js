Ext.define('mds.view.clientFileManager.FileManagerTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.fmTree',
    id: 'fmTree',
    store: 'clientFileManager.ProjectFolders',
    displayField: 'DocumentFilename',
    useArrows: true,
    
    viewConfig: {
        plugins: { 
        	ptype: 'treeviewdragdrop',
        	dropGroup: 'reParent',
            enableDrag: false,
            enableDrop: true,
        	containerScroll: true,
        	appendOnly: true
        },
        listeners: {
            beforedrop: function(node, data, overModel, dropPos, dropFunc, opts) {
            	if (overModel.get('isFolder'))
    	    	{
    	    		this.droppedRecords = data.records;
    	    		data.records = [];
    	    	} else {
    	    	    this.droppedRecords = [];
    	    	    data.records = [];
    	    	}
            },
            drop: function(node, data, overModel, dropPos, opts) {
                Ext.iterate(this.droppedRecords, function(record) {
                    record.set('DocumentParent', overModel.get('DocumentID'));
                    record.set('DocumentIsDeleted', false);
                });
                this.up('fmTree').fireEvent ('dropsuccess');
                this.droppedRecords = undefined;
            },
            nodedragover: function(targetNode, position, dragData){
    	    	if (!targetNode.get('isFolder'))
    	    	{
    	    	    return false;
    	    	} else {
    	    	    var isGoodParent = true;
                    Ext.iterate(dragData.records, function(record) {
                        if (targetNode.get('DocumentID') == record.get('DocumentID') || targetNode.get('DocumentParent') == record.get('DocumentID')) {
                            isGoodParent = false;
                        }
                    });
                    return isGoodParent;
    	    	}
        	}
        }
    },

    rootVisible: true

});
