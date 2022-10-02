Ext.define('mds.view.clientPhotoViewer.annotations.tools.ToolWindow', {
    extend: 'Ext.window.Window',
    id: 'annotationsTW',
    alias: 'widget.annotationsToolWindow',
    closeAction: 'hide',
    draggable: true,
    resizable: false,
    width: 39,
    defaultType: 'button',
    constructor:function(){
    	this.callParent(arguments);
    	Ext.create("mds.view.clientPhotoViewer.annotations.tools.ColorpickerWindow");
    	Ext.create("mds.view.clientPhotoViewer.annotations.tools.StrokeWidthWindow");
    	Ext.create("mds.view.clientPhotoViewer.annotations.tools.StrokeStyleWindow");
    },
    defaults:{
        width: 40,
        height: 40,
        scale: 'large',
        listeners:{
            click:function(btn){
                if (btn.pressed) return;
            	  
                btn.toggle();
        	    var toolWindow=Ext.getCmp('annotationsTW');
                toolWindow.setMode(btn.controlMode);
                for (var i=0; i<toolWindow.items.length; i++){
          	        var btnI=toolWindow.items.getAt(i);
          	            if (btnI!=btn && btnI.pressed){
          	                btnI.toggle();
          	                break;
          	            }
                } 
            }
        }
    },
    items: [
        {
          id: "annotationsSelectButton",
          icon: 'mds/module/clientPhotoViewer/image/btn/select.png',
          tooltip: 'Selection Tool',
          controlMode: 'select'
        },
        {
            xtype: "component",
            autoEl: "div",
            html: "<hr/>",
            height: 10
        },
        {
            icon: 'mds/module/clientPhotoViewer/image/btn/line.png',
            controlMode: 'line',
            tooltip: 'Line Tool'
        },
        {
            icon: 'mds/module/clientPhotoViewer/image/btn/arrow.png',
            controlMode: 'arrow',
            tooltip: 'Arrow Tool'
        },
        {
            icon: 'mds/module/clientPhotoViewer/image/btn/square.png',
            controlMode: 'rectangle',
            tooltip: 'Rectangle Tool'
        },
        {
          icon: 'mds/module/clientPhotoViewer/image/btn/circle.png',
          title: 'circle',
          controlMode: 'ellipse',
          tooltip: 'Ellipse Tool'
        },
        {
        	icon: 'mds/module/clientPhotoViewer/image/btn/fonts.png',
        	controlMode: 'text',
            tooltip: 'Text Callout Tool'
        },
        {
            xtype: "component",
            autoEl: "div",
            html: "<hr/>",
            height: 10
        },
        {
        	id: "strokeWidthBtn",
        	icon: 'mds/module/clientPhotoViewer/image/btn/lineWidth.png',
            tooltip: 'Stroke Width',
        	listeners:{
            	el:{
            	    click: function(){
        	    		Ext.getCmp("annotationsStrokeWidthWindow").show();
            	 	}	
        	    }
        	}
        },
        {
        	id: "strokeStyleBtn",
        	icon: 'mds/module/clientPhotoViewer/image/btn/lineStyle.png',
            tooltip: 'Stroke Style',
        	listeners:{
            	el:{
            	    click: function(){
        	    		Ext.getCmp("annotationsStrokeStyleWindow").show();
            	 	}	
        	    }
        	}
        },
        {
        	id: "strokeColourSample",
        	icon: 'mds/module/clientPhotoViewer/image/btn/lineColor.png',
            tooltip: 'Stroke Color',
        	listeners:{
            	el:{
            	    click: function(){
        	    		Ext.getCmp("annotationsColorpickerWindow").show();
            	 	}	
        	    }
        	}
        },
        {
            xtype: "component",
            autoEl: "div",
            html: "<hr/>",
            height: 10
        }
    ],
    setMode:function(mode){
        this.controlMode=mode;
        this.fireEvent("modechange", this.controlMode);
    },
    getControlMode:function(){
      return this.controlMode;
    },
    getStrokeColour:function(){
        return this.strokeColour;
    },
    getStrokeWidth:function(){
        return this.strokeWidth;
    },
    getStrokeStyle:function(){
    	if (this.strokeStyle===undefined)
    		this.strokeStyle="normal";
        return this.strokeStyle;
    },
    listeners:{
        beforeshow:function(){
    	    this.setDefaults();
            Ext.EventManager.on(document, 'click', this.checkClick, this);
        },
        hide:function(){
        	Ext.EventManager.un(document, 'click', this.checkClick, this);
        },
        afterrender:function(){  	
        	 var toolWindow=this;
        	 Ext.getCmp("annotationsColorpicker").addListener("select", function(picker, colour){
            	toolWindow.fireEvent("colourchange", "#"+colour);
            });
            Ext.getCmp("annotationsStrokeStyle").addListener("change", function(selector, newValue){
            	if (newValue!="")
            		toolWindow.fireEvent("strokestylechange", newValue);
            });
            Ext.getCmp("annotationsStrokeWidth").addListener("change", function(selector, newValue){
            	toolWindow.fireEvent("strokewidthchange", newValue);
            });
        },
        colourchange:function(colourValue){
        	this.strokeColour=colourValue;
        	if (Ext.getCmp("strokeColourSample").el)
        		Ext.getCmp("strokeColourSample").el.dom.style["background-color"]=colourValue;
        },
        strokestylechange:function(newValue){
        	this.strokeStyle=newValue;
        },
        strokewidthchange:function(newValue){
        	this.strokeWidth=newValue;
        }
    },
    checkClick:function(event){
    	var colourWindow=Ext.getCmp("annotationsColorpickerWindow");
    	var colourButton=Ext.getCmp("strokeColourSample");
    	var strokeWidthWindow=Ext.getCmp("annotationsStrokeWidthWindow");
    	var strokeWidthButton=Ext.getCmp("strokeWidthBtn");
    	var strokeStyleWindow=Ext.getCmp("annotationsStrokeStyleWindow");
    	var strokeStyleButton=Ext.getCmp("strokeStyleBtn");
    	
    	var target=event.getTarget();
    	if (!target) return;

    	if (!event.within(colourWindow.getEl()) && !event.within(colourButton.getEl())){
    		colourWindow.hide();
    	}
    	if (!event.within(strokeWidthWindow.getEl()) && !event.within(strokeWidthButton.getEl()) && !event.within(Ext.getCmp("annotationsStrokeWidth").getEl()) && target.tagName!="LI"){
    		strokeWidthWindow.hide();
    	}
    	if (!event.within(strokeStyleWindow.getEl()) && !event.within(strokeStyleButton.getEl()) && !event.within(Ext.getCmp("annotationsStrokeStyle").getEl()) && target.tagName!="IMG" && (!target.src || target.src.indexOf("lineTool")==-1)){
    		strokeStyleWindow.hide();
    	}
    },
    setDefaults:function(){    	
    	var colorpicker=Ext.getCmp("annotationsColorpicker");
    	colorpicker.select('FF6600');
        colorpicker.fireEvent("select", colorpicker, 'FF6600');
    	Ext.getCmp("annotationsStrokeWidth").setValue(4);
    	Ext.getCmp("annotationsStrokeStyle").setValue("normal");
    	
    	this.strokeWidth=4;
    	this.strokeStyle="normal";
    	this.strokeColour="#FF6600";
    	
    	this.fireEvent("settingdefaults");

        var firstBtn=this.items.getAt(2);
        firstBtn.toggle();
        this.setMode(firstBtn.controlMode);
    }
});
//@ sourceURL=annotationTW.js