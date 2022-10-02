//this is the base shape class that the other shapes inherit
//a shape is something that you can add as an annotation-- a rectangle, line, etc.
//these are sprite groups, because a shape can be comprised of multiple base sprites,
//and can also be grouped with other visual components, eg. resize handles
Ext.define('mds.view.clientPhotoViewer.annotations.shapes.Base', {
    extend: 'Ext.draw.CompositeSprite',
    //(override me)-- the attributes that are needed to create the shape and which are saved to the database
    //order matters, because Attr0, Attr1, etc. in the DB is based on the order here
    shapeAttributes: [],
    nBaseSprites: 1, //override me if more than one base sprite (base sprites are part of the annotation and don't include resize handles etc.)
    isSelected: false,
    constructor: function(config) {
    	this.drawComponent=Ext.getCmp('annotationsDC');
    	if (typeof(config)=="undefined"){config=this.getDefaultConfig();}
        this.surface=this.drawComponent.surface;
    	this.callParent(arguments);
    	
    	if (typeof(config.model)!=="undefined"){	//load config from an annotation model
    		var model=config.model;
    		config={};
    		for (var i=0; i<this.shapeAttributes.length; i++){
    			config[this.shapeAttributes[i]]=model.get("Attr"+i);
    		}
    		this.readOnly=(model.get("ReadOnly") || this.drawComponent.readOnly);
    	}
    	this.initConfig(config);
	},
    initConfig:function(config){
        this.callParent(arguments);
        for (var i=0; i<this.shapeAttributes.length; i++){ //notification if required attributes were not supplied
        	var property=this.shapeAttributes[i];
        	if (typeof(config[property])==="undefined"){
        		throw("Property '"+property+"' required");
        	}
        }
    },
    add:function(key, sprite){	//add a sprite to this shape (and draw it)
        var me=this;
        me.callParent(arguments);
        me.surface.add(sprite);
        sprite.show(true);

        if (key.indexOf("base")!=-1){
        	if (!this.readOnly)
        		sprite.addListener("click", this.select, this);
        	var scale=this.drawComponent.getScale();
        	sprite.setAttributes({scale:{x: scale, y: scale, cx: 0, cy: 0}}, true);
        }
        
        if (this.readOnly)
        	return;
        	
        if (sprite.dd && key.indexOf("resizeHandle")!=-1){
            Ext.override(sprite.dd, {onDrag:function(e){me.resizeShapeOnDragHandle(sprite.dd, sprite, e);}});
        }else if (sprite.dd && key.indexOf("pointHandle")!=-1){
            Ext.override(sprite.dd, {onDrag:function(e){me.changePointOnDragHandle(sprite.dd, sprite, e);}});
        }else if (sprite.dd!==undefined){
            Ext.override(sprite.dd, {onDrag:function(e){me.spriteGroupMove(sprite.dd, sprite, e);}});
        } 	
    },
    remove:function(key){	//remove sprite from this shape (and remove from surface)
        var sprite=this.getByKey(key);
        if (!sprite){return;}
        this.removeAtKey(key);
        this.surface.remove(sprite, true);
    },
    //select shape
    select:function(sprite, e){
        if (this.isSelected || Ext.getCmp("annotationsTW").getControlMode()!="select"){return;}
        var oldShape=this.drawComponent.getSelectedShape();
        this.drawComponent.deselectAll(this);
        this.isSelected=true;
        this.refreshSelectionSprites();
        
        if (oldShape)
        	this.drawComponent.fireEvent("shapesync", this, oldShape);
        else
            this.drawComponent.fireEvent("shapeselect", this);
    },
    deselect:function(){	//deselect shape
        this.isSelected=false;
        this.removeSelectionSprites();  
    },
    refreshSelectionSprites:function(){ //create selection sprites (eg. bounding box, resize handles) or move&show existing ones
    	var resizeHandle0=this.getByKey("resizeHandle0");
    	var bbox=this.getBBox();
    	if (!resizeHandle0){
    	    for (var i=0; i<8; i++){
                var resizeHandle=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.resizeHandle', {boundingBox: bbox, position:i});
                this.add("resizeHandle"+i, resizeHandle);
            }   
    	}else{
    	    for (var j=0; j<8; j++){
                this.getByKey("resizeHandle"+j).refreshPosition(bbox);
            }   
    	}
    },
    removeSelectionSprites:function(){	//hide selection sprites
        for (var i=0; i<8; i++){
        	var handle=this.getByKey("resizeHandle"+i);
        	if (handle)
        		handle.hide(true);
        }
    },
    spriteGroupMove:function(spriteDD, sprite, event){ //when one of the draggable sprites in this shape is moved, move all of the sprites in this shape
        var xy=event.getXY(),
        	dxDY=[0,0],
        	dc=Ext.getCmp("annotationsDC"),
        	scale=dc.getScale();
        	
        var prev=spriteDD.prev;
        if (prev){
        	dxDY[0]=xy[0]-prev[0],
            dxDY[1]=xy[1]-prev[1];
            prev[0]=xy[0];
            prev[1]=xy[1];
        }else{
        	//special case used on drag of text boxes, which aren't sprites
        	var offset=spriteDD.getOffset();
        	if (sprite.prevOffset){
        		dxDY[0]=offset[0]-sprite.prevOffset[0],
                dxDY[1]=offset[1]-sprite.prevOffset[1];
                sprite.prevOffset=offset;
        	}else{
        		dxDY=offset;
        		sprite.prevOffset=offset;
        	}
        } 
        //if mouse is out of bounds, allow shape to be dragged to the edge of the surface, but don't allow it to be moved inwards away from the surface
        var amountXIsOutOfBounds=dc.getAmountMouseEventIsOutsideXBounds(event);
        var amountYIsOutOfBounds=dc.getAmountMouseEventIsOutsideYBounds(event);
        if ((amountXIsOutOfBounds<0 && dxDY[0]>0) || (amountXIsOutOfBounds>0 && dxDY[0]<0)){dxDY[0]=0;}
        if ((amountYIsOutOfBounds<0 && dxDY[1]>0) || (amountYIsOutOfBounds>0 && dxDY[1]<0)){dxDY[1]=0;}
        
        dxDY[0]=dxDY[0]/scale;
        dxDY[1]=dxDY[1]/scale;
        
        //disallow any part of the sprite from going outside of the draw component
        var shiftPositionLeft=((dxDY[0]<0)?true:false);
        var shiftPositionUp=((dxDY[1]<0)?true:false);
    	this.adjustdxDYToStayInBounds(dxDY, shiftPositionLeft, shiftPositionUp);
        if (dxDY[0]===0 && dxDY[1]===0){
        	return;
        }
        this.translate(dxDY[0], dxDY[1]);
        this.refreshSelectionSprites();
        this.fireEvent("datachanged");
    },
    translate:function(dx, dy){ //shift the shape by dx on the x-axis and dy on the y-axis. override for shapes that must be moved in a different way
        for (var i=0; i<this.nBaseSprites; i++){
        	var spriteI=this.getAt(i);
        	var attributes={};
    	    attributes.x=spriteI.attr.x+dx;
    	    attributes.y=spriteI.attr.y+dy;
        	spriteI.setAttributes(attributes, true);
        }
    },
    resizeShapeOnDragHandle:function(spriteDD, sprite, event){ //handle the event of resizing a shape with a resize handle
        var xy=event.getXY();
        var dx=xy[0]-spriteDD.prev[0];
        var dy=xy[1]-spriteDD.prev[1];  
        spriteDD.prev=xy;
        //if mouse is out of bounds, allow shape to be dragged to the edge of the surface, but don't allow it to be moved inwards away from the surface
        var amountXIsOutOfBounds=this.drawComponent.getAmountMouseEventIsOutsideXBounds(event);
        var amountYIsOutOfBounds=this.drawComponent.getAmountMouseEventIsOutsideYBounds(event);
        if ((amountXIsOutOfBounds<0 && dx>0) || (amountXIsOutOfBounds>0 && dx<0)){dx=0;}
        if ((amountYIsOutOfBounds<0 && dy>0) || (amountYIsOutOfBounds>0 && dy<0)){dy=0;}
        this.resizeShape(dx, dy, sprite.getPosition(this));
    },
    //resize shape by dx/dy in given direction--- direction starts with 0 in north position and progresses clockwise
    //using a direction disallows, for example, resizing height when an east resize handle is pulled
    resizeShape:function(mouseDX, mouseDY, direction){ //
        var changeWidth=true, changeHeight=true, shiftPositionLeft=true, shiftPositionUp=true, negativeDXIsIncrease=true, negativeDYIsIncrease=true,
             scale=this.drawComponent.getScale();
             
        //interpret how to resize the shape based on which handle is being dragged (or which is being emulated)
        if (direction===0){ //top handle
            changeWidth=false;
        }else if (direction==1){ //top-right handle
            shiftPositionLeft=false;
            negativeDXIsIncrease=false;
        }else if (direction==2){ //right handle
            changeHeight=false;
            shiftPositionLeft=false;
            negativeDXIsIncrease=false;
        }else if (direction==3){ //bottom-right handle
        	shiftPositionUp=false;
        	shiftPositionLeft=false;
        	negativeDXIsIncrease=false;
        	negativeDYIsIncrease=false;
        }else if (direction==4){ //bottom handle
            changeWidth=false;
            shiftPositionUp=false;
            negativeDYIsIncrease=false;
        }else if (direction==5){ //bottom-left handle
        	shiftPositionUp=false;
        	negativeDYIsIncrease=false;
        }else if (direction==6){ //left handle
            changeHeight=false;
        }
        
        //ignore change that isn't relevant for the resize direction
        if (!changeWidth){mouseDX=0;}
        if (!changeHeight){mouseDY=0;}
        var photoDXDY=[mouseDX/scale, mouseDY/scale];

        this.adjustdxDYToStayInBounds(photoDXDY, shiftPositionLeft, shiftPositionUp); //don't allow shape to be reszied out of bounds
        
        var realTop=this.getRealTop(), realRight=this.getRealRight(), realBottom=this.getRealBottom(), realLeft=this.getRealLeft(), realWidth=this.getRealWidth();
        var widthIncrease=photoDXDY[0], heightIncrease=photoDXDY[1];
        if (negativeDXIsIncrease){widthIncrease=widthIncrease*-1;}
        if (negativeDYIsIncrease){heightIncrease=heightIncrease*-1;}     
        var newWidth=this.getRealWidth()+widthIncrease;
        var newHeight=this.getRealHeight()+heightIncrease;
        var newX=(shiftPositionLeft?realLeft+photoDXDY[0]:realLeft);
        var newY=(shiftPositionUp?realTop+photoDXDY[1]:realTop);

        //handle a reverse of direction
        if (newWidth<0){
            newWidth=Math.abs(newWidth);
        	if (shiftPositionLeft){
        	    newX=realRight;
        	}else{
        		newX=realLeft-newWidth;
        	}
        }
        if (newHeight<0){
            newHeight=Math.abs(newHeight);
        	if (shiftPositionUp){
        	    newY=realBottom;
        	}else{
        		newY=realTop-newHeight;
        	}
        }
        
        //special case for text-- don't allow to make smaller than 70x70
        if (this.getType()==="text" && (newWidth<70 || newHeight<70)){return;}
        
        //move handles
        var heightHandles=null;
        var widthHandles=null;
        if (changeHeight){
            if (shiftPositionUp){heightHandles=[0, 2, 1, 6, 7];}
            else {heightHandles=[2, 3, 4, 5, 6];}
        }
        if (changeWidth){
            if (shiftPositionLeft){widthHandles=[0, 4, 5, 6, 7];}
            else {widthHandles=[0, 1, 2, 3, 4];}
        }
        var handleMappings={};
        for (var i=0; i<8; i++){
            var handle=this.getByKey("resizeHandle"+i);
            if (!handle){break;}
            handleMappings[i]=handle.getPosition(this);
        }
        
        for (var i=0; i<8; i++){
            var handle=this.getByKey("resizeHandle"+i);
        	if (!handle){break;}
        	var position=handleMappings[i];
        	    
        	var handleDX=((widthHandles && widthHandles.indexOf(position)!=-1)?photoDXDY[0]*scale:0);
        	var handleDY=((heightHandles && heightHandles.indexOf(position)!=-1)?photoDXDY[1]*scale:0);
        	if (!handleDX && !handleDY){continue;}
        	
        	//midway handles move half as much
        	if (position===0 || position===4){handleDX=handleDX/2;}
        	if (position===2 || position===6){handleDY=handleDY/2;}
        	  
        	handle.setAttributes({
                x: handle.attr.x + handleDX,
                y: handle.attr.y + handleDY
            }, true);
        }

        //resize shape and move selection box if applicable
        this.resize(newX, newY, newWidth, newHeight);
        var selectionBox=this.getByKey("selectionBox");
        if (selectionBox){
            var bbox=this.getBBox();
            selectionBox.setAttributes({
                x: bbox.x,
                y: bbox.y,
                width: bbox.width,
                height: bbox.height
             }, true);
             selectionBox.show();
        }
        this.fireEvent("datachanged");
    },
    setScale:function(scale){	//scale the base sprites of the shape
        for (var i=0; i<this.nBaseSprites; i++){
            this.getAt(i).setAttributes({
                scale:{
                	x: scale,
                	y: scale,
                	cx: 0,
                	cy: 0
                }
            }, true);
        }
        if (this.isSelected){this.refreshSelectionSprites();}
    },
    getWidth:function(){
        return (this.getBBox()).width;
    },
    getHeight:function(){
        return (this.getBBox()).height;
    },
    getRealWidth:function(){
        if (Ext.Array.contains(this.shapeAttributes, "width")){return this.getAttribute("width");}
        if (Ext.Array.contains(this.shapeAttributes, "radiusX")){return this.getAttribute("radiusX")*2;}
        if (this.nBaseSprites==1 && typeof(this.getAt(0).attr.width)!="undefined"){return this.getAt(0).attr.width;}
        return (this.getBBox()).width/this.drawComponent.getScale();
    },
    getRealHeight:function(){
        if (Ext.Array.contains(this.shapeAttributes, "height")){return this.getAttribute("height");}
        if (Ext.Array.contains(this.shapeAttributes, "radiusY")){return this.getAttribute("radiusY")*2;}
        if (this.nBaseSprites==1 && typeof(this.getAt(0).attr.height)!="undefined"){return this.getAt(0).attr.height;}
        return (this.getBBox()).height/this.drawComponent.getScale();
    },
    getRealLeft:function(){
        if (Ext.Array.contains(this.shapeAttributes, "x")){return this.getAttribute("x");}
        if (Ext.Array.contains(this.shapeAttributes, "x0") && Ext.Array.contains(this.shapeAttributes, "x1")){return Math.min(this.getAttribute("x0"), this.getAttribute("x1"));}
        if (this.nBaseSprites==1 && typeof(this.getAt(0).attr.x)!="undefined"){return this.getAt(0).attr.x;}
        return (this.getBBox()).x;
    },
    getRealRight:function(){
        if (Ext.Array.contains(this.shapeAttributes, "x0") && Ext.Array.contains(this.shapeAttributes, "x1")){return Math.max(this.getAttribute("x0"), this.getAttribute("x1"));}
        return this.getRealLeft()+this.getRealWidth();
    },
    getRealTop:function(){
        if (Ext.Array.contains(this.shapeAttributes, "y")){return this.getAttribute("y");}
        if (Ext.Array.contains(this.shapeAttributes, "y0") && Ext.Array.contains(this.shapeAttributes, "y1")){return Math.min(this.getAttribute("y0"), this.getAttribute("y1"));}
        if (this.nBaseSprites==1 && typeof(this.getAt(0).attr.y)!="undefined"){return this.getAt(0).attr.y;}
        return (this.getBBox()).y;
    },
    getRealBottom:function(){
        if (Ext.Array.contains(this.shapeAttributes, "y0") && Ext.Array.contains(this.shapeAttributes, "y1")){return Math.max(this.getAttribute("y0"), this.getAttribute("y1"));}
        return this.getRealTop()+this.getRealHeight();
    },
    isTooSmall:function(){ //whether the shape is too small to warrant creation-- ie. if the user just clicks the surface, don't want to make a tiny rectangle
    	return ((this.getWidth()<=10 || this.getHeight()<=10)?true:false);
    },
    setColour:function(colour){  //set the stroke colour of the shape
    	for (var i=0; i<this.nBaseSprites; i++){
    	    var sprite=this.getAt(i);
    	    sprite.setAttributes({stroke:colour}, true);
    	}
    	this.fireEvent("datachanged");
    },
    getType:function(){ //the "type" of this shape, which is saved to the DB-- override where needed
    	return this.getAt(0).type;
    },
    //the attributes that are saved to the DB-- each name should be in this.shapeAttributes
    getAttribute:function(shapeAttributeName){
        var baseShape=this.getAt(0);
        var attr=baseShape.attr;
        if (!attr){attr=baseShape;}
        var attribute=attr[shapeAttributeName];
        if (shapeAttributeName=="width" || shapeAttributeName=="height" || shapeAttributeName=="x" || shapeAttributeName=="y" ||
            shapeAttributeName=="radiusX" || shapeAttributeName=="radiusY"){
        	attribute=Math.round(attribute);
        }else if (shapeAttributeName=="style"){
        	for (var key in this.drawComponent.styleSettings){
        		if (attr["stroke-dasharray"]==this.drawComponent.styleSettings[key]){return key;}
        	}
        }        
    	return attribute;
    },
    adjustdxDYToStayInBounds:function(dxDY, shiftPositionLeft, shiftPositionUp){
        var realTop=this.getRealTop(), realRight=this.getRealRight(), realBottom=this.getRealBottom(), realLeft=this.getRealLeft();
        
        var maxX=mds.app.getController("clientPhotoViewer.Controller").getImageWidth(), maxY=mds.app.getController("clientPhotoViewer.Controller").getImageHeight();
          
        var newX=((shiftPositionLeft)?realLeft+dxDY[0]:realLeft), newY=((shiftPositionUp)?realTop+dxDY[1]:realTop),
            newRight=((!shiftPositionLeft)?realRight+dxDY[0]:realRight), newBottom=((!shiftPositionUp)?realBottom+dxDY[1]:realBottom);

        //If shape would go out of bounds of the draw component, change dxDY (value is passed back by reference)
        if (newX<0){
        	dxDY[0]=0-realLeft;
        	dxDY[0]=Math.ceil(dxDY[0]);
        }else if (newRight>maxX){
        	dxDY[0]=maxX-realRight;
        	dxDY[0]=Math.floor(dxDY[0]);
        }
        if (newY<0){
        	dxDY[1]=0-realTop;
        	dxDY[1]=Math.ceil(dxDY[1]);
        }else if (newBottom>maxY){
        	dxDY[1]=maxY-realBottom;
        	dxDY[1]=Math.floor(dxDY[1]);
        }
    },
    resize:function(newX, newY, newWidth, newHeight){
        for (var i=0; i<this.nBaseSprites; i++){
            this.getAt(i).setAttributes({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight
             }, true);
        }
    },
    handleKeyPress:function(e, shapeIndex){
    	 var key=e.getKey();
    	 if (key==Ext.EventObject.DELETE){
    		 var store=Ext.getStore("clientPhotoViewer.Annotations");
    		 store.removeAt(shapeIndex);
    		 store.fireEvent("delete");
    	 }
    },
    setStrokeWidth:function(newValue){
    	this.getAt(0).setAttributes({"stroke-width": newValue}, true);
    	this.fireEvent("datachanged");
    },
    setStrokeStyle:function(newValue){
    	this.getAt(0).setAttributes({"stroke-dasharray": this.drawComponent.styleSettings[newValue]}, true);
    	this.fireEvent("datachanged");
    }
});

Ext.draw.CompositeSprite.override({ //overrides a method that was looping forever for me
    destroy: function(){
        var me = this,
            surface = me.getSurface(),
            item;
            
        if (surface) {
            while (me.getCount() > 0) {
                item=me.removeAt(0);
                surface.remove(item, false);
                item.destroy();
            }
        }
        me.clearListeners();
    }
});
//@ sourceURL=annotationShapeBase.js