Ext.define('mds.view.clientPhotoViewer.annotations.shapes.Text', {
    extend: 'mds.view.clientPhotoViewer.annotations.shapes.Base',
    shapeAttributes: ['x', 'y', 'width', 'height', 'stroke', 'text', 'aX0', 'aY0', 'aX1', 'aY1', 'stroke-width', 'style'],
    nBaseSprites: 2,
    fontSize: 30,
    defaultStemLength: 80,
    defaultWidth:460,
	defaultHeight:90,
    initConfig:function(config){
        this.callParent(arguments);
        
        var arrowSprite=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.Arrow', {
        	draggable: !this.readOnly,
        	x0: config.aX0,
        	y0: config.aY0,
        	x1: config.aX1,
        	y1: config.aY1,
        	"stroke-width": config["stroke-width"],
        	"stroke": config.stroke,
        	"stroke-dasharray":this.drawComponent.styleSettings[config["style"]]
        });
        this.add("base0", arrowSprite);
        var me=this;
        
        if (!this.readOnly)
        	Ext.override(arrowSprite.dd, {onMouseUp:function(){me.afterMove();}});
        
        var sX0=config.aX0, sY0=config.aY0;
        if (config.aY0<=config.y){
        	this.stemPosition=0;
        	sY0=config.y;
        }else if (config.aX0>=config.x+config.width){
        	this.stemPosition=1;
        	sX0=config.x+config.width;
        }else if (config.aY0>=config.y+config.height){
        	this.stemPosition=2;
        	sY0=config.y+config.height;
        }else{
        	this.stemPosition=3;
        	sX0=config.x;
        }
        
        var stemSprite=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.Line', {
        	draggable: !this.readOnly,
        	x0: sX0,
        	y0: sY0,
        	x1: config.aX0,
        	y1: config.aY0,
        	"stroke-width": config["stroke-width"],
        	"stroke": config.stroke,
        	"stroke-dasharray":this.drawComponent.styleSettings[config["style"]]
        });
        this.add("base1", stemSprite);

        var dcBounds=this.drawComponent.el.getPageBox();
        var borderStyle=(config.style=="normal"?"solid":config.style);
        this.textBox=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.TextBox', {
        	value: config.text,
        	borderStyle: borderStyle,
        	borderWeight: config["stroke-width"],
        	borderColour: config.stroke,
        	shape: this,
        	draggable: !this.readOnly,
        	disabled: this.readOnly
        });
        this.textBox.render(Ext.getBody());
        this.textBox.setWidth(config.width);
        this.textBox.setHeight(config.height);
        this.textBox.setXY([config.x, config.y]);
        this.currText=config.text;

        var textBounds=this.textBox.el.getBox();
        var shape=this;
        
        if (!this.readOnly){
            Ext.override(this.textBox.dd,
            	{
            		onDrag:function(e){shape.isSelected=true; shape.spriteGroupMove(shape.textBox.dd, shape.textBox, e)},
            		onMouseDown: function(e, target){if (me.editingText) return; return this.callParent(arguments);},
            		onMouseUp: function(e){shape.textBox.prevOffset=undefined; if (me.editingText) return; return this.callParent(arguments);},
            		onMouseMove: function(e, target){if (shape.editingText) return; this.callParent(arguments);}
            	}
            ); 
        
            this.textBox.dd.addListener('mouseup', function(dd, e){
            	if (this.lastXY[0]==this.startXY[0] && this.lastXY[1]==this.startXY[1])
            		shape.textBox.fireEvent("click", shape.textBox);
            	else
            		shape.afterMove();
            });
        }
        
        this.drawComponent.addListener("move", shape.textBox.refresh, shape.textBox);
        
        this.show(true);
        this.fixArrowIntersection();
    },
    getAttribute:function(shapeAttributeName){
    	if (shapeAttributeName=="text"){
    		return this.textBox.value;	
    	}else if (shapeAttributeName=="stroke" || shapeAttributeName=="stroke-width"){
    	    return this.getByKey("base0").attr[shapeAttributeName];
    	}else if (shapeAttributeName=="x" || shapeAttributeName=="y" || shapeAttributeName=="width" || shapeAttributeName=="height"){
    		var textBounds=this.textBox.getUnscaledRelativeBox();
    		return Math.round(textBounds[shapeAttributeName]);
    	}else if (shapeAttributeName=="style"){
    		for (var key in this.drawComponent.styleSettings){
        		if (this.getByKey("base0").attr["stroke-dasharray"]==this.drawComponent.styleSettings[key]){return key;}
        	}
    	}else if (shapeAttributeName=="aX0"){return Math.round(this.getByKey("base0").x0);}
    	else if (shapeAttributeName=="aY0"){return Math.round(this.getByKey("base0").y0);}
    	else if (shapeAttributeName=="aX1"){return Math.round(this.getByKey("base0").x1);}
    	else if (shapeAttributeName=="aY1"){return Math.round(this.getByKey("base0").y1);}
    	return undefined;
    },
    resize:function(newX, newY, newWidth, newHeight){
        var stem=this.getByKey("base1"), textBounds=this.textBox.getUnscaledRelativeBox();
        
    	this.textBox.setXY([newX, newY]);
    	this.textBox.setHeight(newHeight);
        this.textBox.setWidth(newWidth);

        this.fixStemCoords();
    },
    deselect:function(){
    	if (!this.isSelected)
    		return;
    	this.textBox.blur();
    	if (this.textBox.value!=this.currText){
    		this.fireEvent("datachanged");
    		this.currText=this.textBox.value;
    	}
    	this.callParent(arguments);
    },
    getType:function(){
    	return "text";
    },  
    isTooSmall:function(){
    	return false;
    },
    getDefaultConfig:function(){
    	var xy=this.drawComponent.descaledXY;
    	var tw=Ext.getCmp("annotationsTW");
    	var x=xy[0]-this.defaultWidth/2, y=xy[1]-this.defaultHeight/2;
    	var stemCoords=this.getStemSideCoordinates(3, x, y, this.defaultWidth, this.defaultHeight, tw.getStrokeWidth());

    	return {x: x, y:y, width: this.defaultWidth, height:this.defaultHeight, stroke: tw.getStrokeColour(),
    		text:"",
    		'aX1':xy[0], 'aY1':xy[1], 'aX0':stemCoords.x1, 'aY0':stemCoords.y1,
    		'stroke-width':tw.getStrokeWidth(), 'style':tw.getStrokeStyle()
    	};
    },
    translate:function(dx, dy){
    	var maxX=mds.app.getController("clientPhotoViewer.Controller").getImageWidth(), maxY=mds.app.getController("clientPhotoViewer.Controller").getImageHeight();
    	var arrow=this.getByKey("base0"), stem=this.getByKey("base1"), textBounds=this.textBox.getUnscaledRelativeBox();
    	
    	if (textBounds.x+dx<0 || (textBounds.x+dx+textBounds.width)>maxX || textBounds.y+dy<0 || (textBounds.y+dy+textBounds.height)>maxY){return;}
    	
    	this.textBox.setXY([textBounds.x+dx, textBounds.y+dy]);
    	stem.setAttributes({
    		x0:Math.min(maxX, Math.max(0, stem.x0+dx)), y0:Math.min(maxY, Math.max(0, stem.y0+dy)),
    		x1:Math.min(maxX, Math.max(0, stem.x1+dx)), y1:Math.min(maxY, Math.max(0, stem.y1+dy))
    	}, true);
    	arrow.setAttributes({x0: stem.x1, y0:stem.y1}, true);
    	
    	this.fixArrowIntersection();
    },
    fixStemCoords:function(){
        var textBounds=this.textBox.getUnscaledRelativeBox(), stem=this.getByKey("base1"), arrow=this.getByKey("base0"), dx=textBounds.x-textBounds.x,
        		dy=textBounds.y-textBounds.y, maxX=mds.app.getController("clientPhotoViewer.Controller").getImageWidth(),
        		maxY=mds.app.getController("clientPhotoViewer.Controller").getImageHeight(), stemAttr={};;
        
        //When box is resized, we must ensure that the stem remains attached to the box
         
        if (((this.stemPosition==0 || this.stemPosition==2) && (stem.x0<textBounds.x || stem.x0>textBounds.x+textBounds.width)) ||
            ((this.stemPosition==1 || this.stemPosition==3) && (stem.y0<textBounds.y || stem.y0>textBounds.y+textBounds.height))){
            stemAttr=this.getStemSideCoordinates(this.stemPosition, textBounds.x, textBounds.y, textBounds.width, textBounds.height, stem.attr["stroke-width"]);
        }else{
        	var stemLength=Math.getLineLength([stem.x0, stem.y0], [stem.x1, stem.y1]);
        	if (this.stemPosition===0){ //top
            	stemAttr.y0=textBounds.y;
            	if (Math.getLineLength([stem.x0, stemAttr.y0], [stem.x1, stem.y1])<stemLength && stemAttr.y0-stem.y1<this.defaultStemLength){
            		stemAttr.y1=Math.max(0, stemAttr.y0-this.defaultStemLength);
            	}
            }else if (this.stemPosition===1){ //right
            	stemAttr.x0=textBounds.right;
            	if (Math.getLineLength([stemAttr.x0, stem.y0], [stem.x1, stem.y1])<stemLength && stem.x1-stemAttr.x0<this.defaultStemLength){
            		stemAttr.x1=Math.min(maxX, stemAttr.x0+this.defaultStemLength);
            	}
            }else if (this.stemPosition===2){ //bottom
            	stemAttr.y0=textBounds.bottom;
            	if (Math.getLineLength([stem.x0, stemAttr.y0], [stem.x1, stem.y1])<stemLength && stem.y1-stemAttr.y0<this.defaultStemLength){
            		stemAttr.y1=Math.min(maxY, stemAttr.y0+this.defaultStemLength);
            	}
            }else if (this.stemPosition===3){ //left
            	stemAttr.x0=textBounds.x;
            	if (Math.getLineLength([stemAttr.x0, stem.y0], [stem.x1, stem.y1])<stemLength && stemAttr.x0-stem.x1<this.defaultStemLength){
            		stemAttr.x1=Math.max(0, stemAttr.x0-this.defaultStemLength);
            	}
            }
        }
    	stem.setAttributes(stemAttr, true);
        this.fixArrowIntersection();
        this.refreshSelectionSprites();
    },
    getStemSideCoordinates:function(position, x, y, width, height, strokeWidth){
    	var offsetStemX=x+width/2-strokeWidth/2;
    	var offsetStemY=y+height/2+strokeWidth/2;
    	if (position===0){return {x0:offsetStemX, y0:y, x1:offsetStemX, y1:y-this.defaultStemLength};} //top
    	if (position===1){return {x0:x+width, y0:offsetStemY, x1:x+width+this.defaultStemLength, y1:offsetStemY};} //right
    	if (position===2){return {x0:offsetStemX, y0:y+height, x1:offsetStemX, y1:y+height+this.defaultStemLength};} //bottom
    	if (position===3){return {x0:x, y0:offsetStemY, x1:x-this.defaultStemLength, y1:offsetStemY};} //left
    },
    moveStemToSide:function(position, x, y, width, height, strokeWidth, moveXY1){
    	this.stemPosition=position;
    	var coordinates=this.getStemSideCoordinates(position, x, y, width, height, strokeWidth);
    	var attr={
    	    x0: coordinates.x0,
    	    y0: coordinates.y0
    	};
    	if (moveXY1){
    		attr.x1=coordinates.x1;
    		attr.y1=coordinates.y1;
    	}
    	this.getByKey("base1").setAttributes(attr, true);
    },
    arrowIntersectsSide:function(position){
    	var arrow=this.getByKey("base0"), textBounds=this.textBox.getUnscaledRelativeBox(), width=textBounds.width, height=textBounds.height, x=textBounds.x, y=textBounds.y,
    			strokeWidth=arrow.attr["stroke-width"];
    	var sideXY0=[x, y], sideXY1=[x+width, y]; //top
    	if (position===1){sideXY0=[x+width, y+height];} //right
    	if (position===2){sideXY0=[x, y+height]; sideXY1=[x+width, y+height];} //bottom
    	if (position===3){sideXY1=[x, y+height];} //left
    	return Math.segmentsIntersect(sideXY0, sideXY1, [arrow.x0, arrow.y0], [arrow.x1, arrow.y1]);
    },
    fixArrowIntersection:function(){
    	var arrow=this.getByKey("base0"), stem=this.getByKey("base1"), textBounds=this.textBox.getUnscaledRelativeBox();
    	var width=textBounds.width, height=textBounds.height, x=textBounds.x, y=textBounds.y, strokeWidth=arrow.attr["stroke-width"];
     
    	var intersectsTop=this.arrowIntersectsSide(0), intersectsRight=this.arrowIntersectsSide(1),
    	    intersectsBottom=this.arrowIntersectsSide(2), intersectsLeft=this.arrowIntersectsSide(3);
    	    
        if (intersectsLeft && intersectsTop){
        	if (arrow.x1 <= x){this.moveStemToSide(3, x, y, width, height, strokeWidth, true);}
        	else{this.moveStemToSide(0, x, y, width, height, strokeWidth, true);}
        }else if (intersectsRight && intersectsTop){
        	if (arrow.x1 >= (x+width)){this.moveStemToSide(1, x, y, width, height, strokeWidth, true);}
        	else{this.moveStemToSide(0, x, y, width, height, strokeWidth, true);}
        }else if (intersectsLeft && intersectsBottom){
        	if (arrow.x1 <= x){this.moveStemToSide(3, x, y, width, height, strokeWidth, true);}
        	else{this.moveStemToSide(2, x, y, width, height, strokeWidth, true);}
        }else if (intersectsRight && intersectsBottom){
        	if (arrow.x1 >= (x+width)){this.moveStemToSide(1, x, y, width, height, strokeWidth, true);}
        	else{this.moveStemToSide(2, x, y, width, height, strokeWidth, true);}
        }else if (intersectsTop && intersectsBottom){
        	if (arrow.y1 <= y){this.moveStemToSide(0, x, y, width, height, strokeWidth, true);}
        	else{this.moveStemToSide(2, x, y, width, height, strokeWidth, true);}
        }else if (intersectsRight && intersectsLeft){
        	if (arrow.x1 <= x){this.moveStemToSide(3, x, y, width, height, strokeWidth, true);}
        	else{this.moveStemToSide(1, x, y, width, height, strokeWidth, true);}
        }
        arrow.setAttributes({x0:stem.x1, y0:stem.y1, x1:arrow.x1, y1:arrow.y1}, true);
        
        this.fireEvent("datachanged");
    },
    afterMove:function(){
    	var stem=this.getByKey("base1"), arrow=this.getByKey("base0"), textBounds=this.textBox.getUnscaledRelativeBox();
    	//if arrow point is under the rectangle, move the rectangle
    	if (arrow.x1>=textBounds.x && arrow.x1<=(textBounds.x+textBounds.width) && arrow.y1>=textBounds.y && arrow.y1<=(textBounds.y+textBounds.height)){
    		//horizontal movement: move smallest amount to uncover arrow, or away from the side of the photo if there isn't space
    		var leftDiff=arrow.x1-textBounds.x, rightDiff=(textBounds.x+textBounds.width)-arrow.x1;
    		var dx=leftDiff+this.defaultStemLength;
    		if (Math.min(rightDiff, leftDiff)==rightDiff && textBounds.x-(rightDiff+this.defaultStemLength)>0){
            	dx=0-rightDiff-this.defaultStemLength;
    		}
    		
    		this.translate(dx, 0);
    		this.refreshSelectionSprites();
    		this.fireEvent("datachanged");
    	}
    },
    refreshSelectionSprites:function(staticPoint){ //create selection sprites (eg. bounding box, resize handles) or move&show existing ones
    	var resizeHandle0=this.getByKey("resizeHandle0");
    	var bbox=this.textBox.getRelativeBox();
    	var arrow=this.getByKey("base0");
    	var scale=this.drawComponent.getScale();
    	var me=this;
    	if (!resizeHandle0){
    	    for (var i=0; i<8; i++){
                var resizeHandle=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.resizeHandle', {boundingBox: bbox, position:i});
                this.add("resizeHandle"+i, resizeHandle);
                Ext.override(resizeHandle.dd, {onMouseUp:function(){me.afterMove();}});
            } 
    	    var handle0=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.pointHandle', {x: arrow.x0*scale, y:arrow.y0*scale, pointNumber:0});
    	    this.add("pointHandle0", handle0);
    	    var handle1=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.pointHandle', {x: arrow.x1*scale, y:arrow.y1*scale, pointNumber:1});
    	    this.add("pointHandle1", handle1);
    	    var me=this;
    	    Ext.override(handle1.dd, {onMouseUp:function(){me.afterMove();}});
    	}else{
    	    for (var j=0; j<8; j++){
                this.getByKey("resizeHandle"+j).refreshPosition(bbox);
            }
    	    var handle0=this.getByKey("pointHandle0"), handle1=this.getByKey("pointHandle1");
    	    if (staticPoint!==0){
    		    handle0.setAttributes({x:arrow.x0*scale, y:arrow.y0*scale}, true);
    		    handle0.show(true);
    		}
    		if (staticPoint!==1){
    		    handle1.setAttributes({x:arrow.x1*scale, y:arrow.y1*scale}, true);
        		handle1.show(true);
    		}	
    	}
    },
    removeSelectionSprites:function(){	//hide selection sprites
        for (var i=0; i<8; i++){
        	var handle=this.getByKey("resizeHandle"+i);
        	if (handle)
        		handle.hide(true);
        	else
        		return;
        }
        for (var i=0; i<2; i++){
            this.getByKey("pointHandle"+i).hide(true);
        }   
    },
    changePointOnDragHandle:function(spriteDD, sprite, event){
        var xy=this.drawComponent.getRelativeDescaledXYFromMouseEvent(event);
        this.movePointHandle(sprite.pointNumber, xy[0], xy[1]);
        this.refreshSelectionSprites();
    },
    movePointHandle:function(pointNumber, x, y){
        var maxX=mds.app.getController("clientPhotoViewer.Controller").getImageWidth();
        var maxY=mds.app.getController("clientPhotoViewer.Controller").getImageHeight();
        if (x<0){x=0;}
        
        else if (x>maxX){x=maxX;}
        if (y<0){y=0;}
        else if (y>maxY){y=maxY;}
        
        var arrow=this.getByKey("base0");
        var x0=arrow.x0, y0=arrow.y0, x1=arrow.x1, y1=arrow.y1;
    	if (pointNumber===0){
    		var textBounds=this.textBox.getUnscaledRelativeBox();
    		//disallow stem handle from going inside box
    		if (this.stemPosition==0 && y>textBounds.y){y=textBounds.y;}
    		if (this.stemPosition==1 && x<textBounds.x+textBounds.width){x=textBounds.x+textBounds.width;}
    		if (this.stemPosition==2 && y<textBounds.y+textBounds.height){y=textBounds.y+textBounds.height;}
    		if (this.stemPosition==3 && x>textBounds.x){x=textBounds.x;}
    		
    		//restrict horizontal stems to horizontal resizing and vice versa
    		if (this.stemPosition===0 || this.stemPosition==2){
    			y0=y;
    		}else { //horizontal
    			x0=x;
    		}
    	}else{
    	    x1=x;
    	    y1=y;
    	}
        arrow.setAttributes({
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1
    	}, true);
        
        if (pointNumber===0){
        	this.getByKey("base1").setAttributes({
        		x1: x0,
        		y1: y0
        	}, true);
        }
        this.fixArrowIntersection();
    },
    setScale:function(scale){	//scale the base sprites of the shape
    	this.textBox.refresh();
    	this.callParent(arguments);
    },
    destroy:function(){
        this.drawComponent.removeListener("move", this.textBox.refresh, this.textBox);
    	this.textBox.destroy();
    	this.callParent(arguments);
    },
    setStrokeWidth:function(newValue){
    	this.getByKey("base1").setAttributes({"stroke-width": newValue}, true);
    	this.textBox.setBorderWeight(newValue);
    	this.callParent(arguments);
    },
    setStrokeStyle:function(newValue){
    	this.getByKey("base1").setAttributes({"stroke-dasharray": this.drawComponent.styleSettings[newValue]}, true);
    	var borderStyle=(newValue=="normal"?"solid":newValue);
    	this.textBox.setBorderStyle(borderStyle);
    	this.callParent(arguments);
    },
    setColour:function(colour){  //set the stroke colour of the shape
    	this.textBox.setBorderColour(colour);
    	this.callParent(arguments);
    }
});
