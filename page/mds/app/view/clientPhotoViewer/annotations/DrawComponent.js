Ext.define('mds.view.clientPhotoViewer.annotations.DrawComponent', {
    extend: 'Ext.draw.Component',
    id: 'annotationsDC',
    alias: 'widget.annotationsDC',
    viewBox: false,
    floating: true,
    shadow: false,
    style: "position: absolute;", //border: 2px solid red;", //red border is so that while testing, it is easy to see that the draw component is properly positioned
    hidden: true,
    shapeInCreation: null,
    readOnly: true,
    active: false, //whether the mouse is inside the draw area
    styleSettings:{
    	normal: "",
    	dotted: "5,5",
    	dashed: "10,10"
    },
    listeners:{
    	mousedown:function(e){ //handles deselection and shape creation
    	    //I've put e.preventDefault() in each mouse event handler because it stops the default browser behaviour for events; for example, trying to drag the draw component around
    	    e.preventDefault();
    	    var xy=this.getRelativeDescaledXYFromMouseEvent(e); //this gets the photo coordinates
    	    this.descaledXY=xy;
    	    
    	    //on photo click, deslect all shapes
	        this.deselectAll(); 
    	    
	        //if the mode is select and the user is dragging around the mouse on the canvas, transfer the event to the overlay.
	        //this allows the photo to be moved.
	        var mode=Ext.getCmp("annotationsTW").getControlMode();
    	    if (mode=="select"){ 
    	        this.isDragging=true;
    	    	Ext.getCmp("overlayCenter").dd.onMouseDown(e, Ext.getCmp("overlayCenter").el);
    	    	return false;
    	    }else{ //shape
    	    	var uppercaseMode=mode.substring(0, 1).toUpperCase()+mode.substring(1); //had to change names of files to uppercase
    	    	this.shapeInCreation=Ext.create('mds.view.clientPhotoViewer.annotations.shapes.'+uppercaseMode);
    	    	this.shapeInCreationClickXY=xy;
    	        this.shapeInCreationPrevXY=xy;
    	    }
    	    return false;
    	},
    	mouseenter:function(e){ //track whether draw area is active; also used for dragging overlay
    	    e.preventDefault(); 
    	    if (this.isDragging){ 
    	        Ext.getCmp("overlayCenter").dd.onMouseOver(e, Ext.getCmp("overlayCenter").el);
    	    }
    	    return false;
    	},
    	mouseleave:function(e){ //track whether draw area is active; also used for dragging overlay
    	    e.preventDefault(); 
    	    if (this.isDragging){ 
    	        Ext.getCmp("overlayCenter").dd.onMouseOut(e, Ext.getCmp("overlayCenter").el);
    	    }
    	    return false;
    	},  
    	mousemove:function(e){ //handles sizing a shape being created; also used for dragging overlay
    	    e.preventDefault(); 
    	    if (this.isDragging){
    	        Ext.getCmp("overlayCenter").dd.onMouseMove(e, Ext.getCmp("overlayCenter").el);
    	        mds.app.fireEvent('overlayCDrag', Ext.getCmp("overlayCenter").el);
    	        return false;
    	    }
    	    
    	    if (this.shapeInCreation){
    	    	var xy=this.getRelativeDescaledXYFromMouseEvent(e);
    	    	var dx=(xy[0]-this.shapeInCreationPrevXY[0]);
        	    var dy=(xy[1]-this.shapeInCreationPrevXY[1]);
        	    this.shapeInCreationPrevXY=xy;
        	    
        	    var mode=Ext.getCmp("annotationsTW").getControlMode();
        	    if (mode=="ellipse" || mode=="rectangle"){
        	    	var clickDX=xy[0]-this.shapeInCreationClickXY[0];
            	    var clickDY=xy[1]-this.shapeInCreationClickXY[1];
            	    
            	    var direction=1; //northeast
            	    if (clickDX>=0 && clickDY>=0){
            	    	direction=3; //southeast
            	    }else if (clickDX<=0 && clickDY>=0){
            	    	direction=5; //southwest
            	    }else if (clickDX<=0 && clickDY<=0){
            	    	direction=7; //northwest
            	    }
            		this.shapeInCreation.resizeShape(dx*this.getScale(), dy*this.getScale(), direction);
        	    }else if (mode=="line" || this.shapeInCreation && mode=="arrow"){
        	        this.shapeInCreation.movePointHandle(1, xy[0], xy[1]);
        	    }else if (mode=="text"){
        	    	this.shapeInCreation.translate(dx, dy)
        	    }
    	    }  
    	    return false;
    	},
    	//handles new shape creation; also used for dragging overlay
    	//shape is only created if it isn't 'too small' as defined by shape.isTooSmall()-- this avoids creating shapes on click
    	mouseup:function(e){
    	    e.preventDefault(); 
    	    if (this.isDragging){
    	        Ext.getCmp("overlayCenter").dd.onMouseUp(e, Ext.getCmp("overlayCenter").el);
    	        this.isDragging=false;
    	    	return false;
    	    }
    	    if (this.shapeInCreation!==null){
    	        if (this.shapeInCreation.isTooSmall()){
    	            this.shapeInCreation.destroy();   	
    	        }else{
    	        	var selectButton=Ext.getCmp("annotationsSelectButton");
        	        selectButton.fireEvent("click", selectButton);
        	        
        	        var tw=Ext.getCmp("annotationsTW");
        	        
    	            var newAnnotation=Ext.create("mds.model.clientPhotoViewer.Annotation", {ShareTypeID:tw.ShareTypeID, MemberUIDArray:[]});
    	            newAnnotation.setShape(this.shapeInCreation);
    	            
    	            Ext.getStore("clientPhotoViewer.Annotations").add(newAnnotation);
    	            this.shapeInCreation.select(e);
    	        }
    	        if (typeof(this.shapeInCreation.afterMove)=="function"){
    	        	this.shapeInCreation.afterMove();
    	        }
    	        
    	        this.shapeInCreation=null;
    	    }
    	    return false;
    	},
    	//handles the following commands:
    	//delete: delete selected shape
    	//enter: edit text of selected text shape annotation
    	keypress:function(e){
    		if (e.getTarget().tagName=="TEXTAREA")
    			return;
    			
    		e.preventDefault(); 
    		var key=e.getKey();
    	    var i;
    	    var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
    	    var count=annotationsStore.count();
    	    var annotation;
    	    var selectedShape=null;
    	    for (i=0; i<count; i++){
    	        annotation=annotationsStore.getAt(i);
    	    	if (annotation.shape.isSelected){
    	    		selectedShape=annotation.shape;
    	    		break;
    	    	}
    	    }
    	    if (selectedShape===null){return;}
    	    selectedShape.handleKeyPress(e, i);
    	},
    	//transfer mousewheel event for zooming photo
    	el: {
            mousewheel: function(e,t){
            	mds.app.fireEvent('mouseWheelZoom', this, e, t);
            }
        },
        colourchange:function(colourValue){
            var selectedShape=this.getSelectedShape();
            if (selectedShape){
            	selectedShape.setColour(colourValue);
            }
        },
        strokewidthchange:function(newValue){
            var selectedShape=this.getSelectedShape();
            if (selectedShape && newValue!=selectedShape.getAttribute("stroke-width")){
            	selectedShape.setStrokeWidth(newValue);
            }
        },
        strokestylechange:function(newValue){
            var selectedShape=this.getSelectedShape();
            if (selectedShape && newValue!=selectedShape.getAttribute("style")){
            	selectedShape.setStrokeStyle(newValue);
            }
        },
        sharetypechange:function(ShareTypeID, MemberUIDArray){
        	var model=this.getSelectedModel();
        	if (model){
        		if (model.get("ShareTypeID")!=ShareTypeID)
        			model.set("ShareTypeID", ShareTypeID);
        	    if (model.get("MemberUIDArray").join(",")!=MemberUIDArray.join(","))
        	    	model.set("MemberUIDArray", MemberUIDArray.slice());
        	}
        },
        modechange:function(mode){
        	if (mode=="select"){this.surface.el.dom.style.cursor="default";}
            else{this.surface.el.dom.style.cursor="crosshair";}    
        }
    },
    getRelativeDescaledXYFromMouseEvent:function(e){ //get the coordinates as though on the full-sized photograph
        var bounds=this.el.getPageBox();
        var xy=[];
        xy[0]=(e.browserEvent.clientX-bounds.left)/this.scale;
        xy[1]=(e.browserEvent.clientY-bounds.top)/this.scale;
        return xy;
    },
    getRelativeRealXYFromMouseEvent:function(e){
        var bounds=this.el.getPageBox();
        var xy=[];
        xy[0]=(e.browserEvent.clientX-bounds.left);
        xy[1]=(e.browserEvent.clientY-bounds.top);
        return xy;
    },
    getAmountMouseEventIsOutsideXBounds:function(e){
        var xy=this.getRelativeRealXYFromMouseEvent(e);
        if (xy[0]<0){return xy[0];}
        if (xy[0]>this.getWidth()){return xy[0]-this.getWidth();}
        return 0;
    },
    getAmountMouseEventIsOutsideYBounds:function(e){
        var xy=this.getRelativeRealXYFromMouseEvent(e);
        if (xy[1]<0){return xy[1];}
        if (xy[1]>this.getHeight()){return xy[1]-this.getHeight();}
        return 0;
    },
    getSelectedShape:function(){ //get selected shape
        var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
        var count=annotationsStore.count();
        for (var i=0; i<count; i++){
            var annotation=annotationsStore.getAt(i);
        	if (annotation.shape.isSelected){
        		return annotation.shape;
        	}
        }
        return null;
    },
    getSelectedModel:function(){ //get selected shape
        var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
        var count=annotationsStore.count();
        for (var i=0; i<count; i++){
            var annotation=annotationsStore.getAt(i);
        	if (annotation.shape.isSelected){
        		return annotation;
        	}
        }
        return null;
    },
    refreshScale:function(imageCmp, newWidth, newHeight){ //change scale, ie. when photo is zoomed
    	this.setSize(newWidth, newHeight);
    	try{this.alignTo("pvImage", "tl-tl");}catch(e){}
    	var imageFullWidth=mds.app.getController("clientPhotoViewer.Controller").getImageWidth();
    	this.scale=imageCmp.getWidth()/imageFullWidth;
    	var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
        var count=annotationsStore.count();
    	for (var i=0; i<count; i++){
    	    annotationsStore.getAt(i).shape.setScale(this.scale);
    	}
    },
    getScale:function(){ //get draw scale
    	return this.scale;
    },
    destroyShapes:function(){ //clear out the shapes that are in the annotations store-- remove from store and from surface; destroy objects
    	this.fireEvent("beforedestroy");
    	
        var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
        while (annotationsStore.count()){
            annotationsStore.getAt(0).shape.destroy();
            annotationsStore.removeAt(0);
        }
        
        this.fireEvent("afterdestroy");
    },
    deselectAll:function(ignoredShape){ //deselect all shapes
        var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
        var count=annotationsStore.count();
        for (var i=0; i<count; i++){
        	var annotation=annotationsStore.getAt(i);
        	if (!ignoredShape || annotation.shape!=ignoredShape)
        		annotation.shape.deselect();
  		}
    },
    show:function(){
    	this.callParent(arguments);
    	if (this.readOnly)
    		this.el.dom.style.pointerEvents='none';
    	else
    		this.el.dom.style.pointerEvents='';
    	this.fireEvent("aftershow", this);
    },
    hide:function(){
    	this.callParent(arguments);
    	var annotationsStore=Ext.getStore("clientPhotoViewer.Annotations");
    	var count=annotationsStore.count();
    	for (var i=0; i<count; i++){
            var annotation=annotationsStore.getAt(i);
            if (annotation.get("Type")=="text")
            	annotation.shape.textBox.hide();
        }
    },
    setReadOnly:function(readOnly){
    	this.readOnly=readOnly;
    }
});

//this fixes a bug where cx and cy cannot be specified when scaling a sprite
Ext.draw.Surface.override({
    scale: function(sprite) {
        sprite.attr.scaling.centerX = sprite.attr.scaling.cx;
        sprite.attr.scaling.centerY = sprite.attr.scaling.cy;
        this.callParent(arguments);
    }
});

//Bad things can happen after a sprite is destroyed, because Ext is seemingly still trying to animate it... these overrides are a band-aid; not fixing the root of the problem :(
Ext.dom.Element.override({
    animate:function(){
        if (!this.dom){return this;}
        return this.callParent(arguments);
	},
	setVisible:function(visible, animate) {
		if (!this.dom){return this;}
		return this.callParent(arguments);
	}
});

Ext.dom.AbstractElement.override({
    setStyle:function(){
        if (!this.dom){return this;}
        return this.callParent(arguments);
  }
});
//@ sourceURL=annotationDC.js
