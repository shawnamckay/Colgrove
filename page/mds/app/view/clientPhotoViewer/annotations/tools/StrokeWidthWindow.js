Ext.define("mds.view.clientPhotoViewer.annotations.tools.StrokeWidthWindow", {
    extend: 'mds.view.clientPhotoViewer.annotations.tools.PropertyWindow',
    id: 'annotationsStrokeWidthWindow',
    title: 'Stroke Width',
    items:[
        {
            xtype: "rangeCombo",
    	    id: "annotationsStrokeWidth",
    	    fieldLabel: "",
    	    width: 150,
    	    min: 1,
    	    max: 50,
    	    unit: "px",
    	    margin: 2
       }
    ],
    constructor:function(){
    	this.callParent(arguments);
		this.addListener("show", function(){
    		var widthSelector=Ext.getCmp("annotationsStrokeWidth");
    		
            if (!widthSelector.getValue())
            	widthSelector.setValue(4);
            	
        });
    }
});
