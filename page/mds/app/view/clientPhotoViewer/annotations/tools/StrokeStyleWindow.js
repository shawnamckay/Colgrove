Ext.define("mds.view.clientPhotoViewer.annotations.tools.StrokeStyleWindow", {
    extend: 'mds.view.clientPhotoViewer.annotations.tools.PropertyWindow',
    id: 'annotationsStrokeStyleWindow',
    title: 'Stroke Style',
    items:[
        {
    	   xtype: "imageCombo",
    	   id: "annotationsStrokeStyle",
    	   fieldLabel: "",
    	   width: 150,
    	   margin: 2,
    	   data:[
    	         {
    	        	 src:"mds/module/clientPhotoViewer/image/comboImg/lineTool-normal.gif",
    	        	 value:"normal"
    	         },
    	         {
    	        	 src:"mds/module/clientPhotoViewer/image/comboImg/lineTool-dashed.gif",
    	        	 value:"dashed"
    	         },
    	         {
    	        	 src:"mds/module/clientPhotoViewer/image/comboImg/lineTool-dotted.gif",
    	        	 value:"dotted"
    	         }
    	   ]
       }
    ],
    constructor:function(){
		this.callParent(arguments);
		this.addListener("show", function(){
    		var styleSelector=Ext.getCmp("annotationsStrokeStyle");
    		
            if (!styleSelector.getValue())
            	styleSelector.setValue("normal");
            
            this.alignTo("annotationsTW", "tl-bl");
        });
    }
});
