Ext.define("mds.view.clientPhotoViewer.annotations.tools.PropertyWindow", {
    extend: 'Ext.window.Window',
    closeAction: 'hide',
    hidden: true,
    
    listeners: {
    	afterrender:function(){
        	this.alignTo("annotationsTW", "tl-bl");
     	}
    }
});
