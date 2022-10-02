Ext.define('mds.view.clientPhotoList.widget.PrintSelectionWindow', {
    extend: 'Ext.window.Window',
    id: 'printSelectionWindow',
    config:{
		action: 'print'
    },
    title: 'Select Export Layout',
    modal: true,
    resizable: false,
    layout:{
		type: 'hbox',
		pack:'stretch'
    },    
    closeAction: 'hide',
    defaults:{
    	xtype: 'panel',
        layout: {
    		type: 'vbox',
    		align:'center'
    	},
    	style: "cursor: pointer"
    },
    items:[
        {
        	title: 'Standard View',
        	items:[
        	       {
        	    	   xtype: 'label',
        	    	   text: 'Image & Details Only',
        	    	   margin: 10
        	       },
        	       {
        	    	   xtype: 'image',
        	    	   src: 'mds/image/pdftype_standard.png',
        	    	   width: 274,
        	    	   height: 265,
        	    	   margin: "0 10px 10px 10px"
        	       }
        	]
        },
        {
        	title: '4-View&trade;',
        	items:[
        	       {
        	    	   xtype: 'label',
        	    	   text: 'Siteplan / Floorplan Locator, Image & Details',
        	    	   margin: 10
        	       },
        	       {
        	    	   xtype: 'image',
        	    	   src: 'mds/image/pdftype_4view.png',
        	    	   width: 247,
        	    	   height: 265,
        	    	   margin: "0 0 10px 0"
        	       }
        	]
        }
    ],
    listeners:{
    	afterrender:function(printSelectionWindow){
    		printSelectionWindow.items.getAt(0).el.addListener("click", function(){printSelectionWindow.fireEvent("choosetype", "standard", printSelectionWindow);});
    	    printSelectionWindow.items.getAt(1).el.addListener("click", function(){printSelectionWindow.fireEvent("choosetype", "4view", printSelectionWindow);}); 
    	}
    }
});