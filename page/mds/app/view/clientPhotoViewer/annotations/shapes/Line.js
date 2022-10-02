Ext.define('mds.view.clientPhotoViewer.annotations.shapes.Line', {
    extend: 'mds.view.clientPhotoViewer.annotations.shapes.Base',
    shapeAttributes: ['x0', 'y0', 'x1', 'y1', 'stroke', 'stroke-width', 'style'],
    x1Index: 10, //the index of x1 after splitting the draw path on ' '
    initLineConfig:function(config){
    	for (var i=0; i<this.shapeAttributes.length; i++){
        	var property=this.shapeAttributes[i];
        	if (typeof(config[property])==="undefined"){
        		throw("Property '"+property+"' required");
        	}
        }
        var lineConfig={
        	x0:config.x0-0,
        	y0:config.y0-0,
        	x1:config.x1-0,
        	y1:config.y1-0,
            draggable: !this.readOnly,
            stroke: config.stroke,
            "stroke-width":config["stroke-width"],
            "stroke-dasharray":this.drawComponent.styleSettings[config["style"]]
        };
        return lineConfig;
    },
    initConfig:function(config){
        var lineConfig=this.initLineConfig(config);
        var baseShape=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.Line', lineConfig);
        this.add("base0", baseShape);
        this.show(true);
    }, 
    refreshSelectionSprites:function(staticPoint){	//either add point handles or move the existing ones to the correct position
    	var handle0=this.getByKey("pointHandle"+0);
    	var handle1=this.getByKey("pointHandle"+1);
    	var scale=Ext.getCmp("annotationsDC").getScale();	
  	
    	var x0=this.getAttribute("x0")*scale;
    	var y0=this.getAttribute("y0")*scale;
    	var x1=this.getAttribute("x1")*scale;
    	var y1=this.getAttribute("y1")*scale;

    	if (!handle0){
    		handle0=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.pointHandle', {x: x0, y:y0, pointNumber:0});
    		handle1=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.pointHandle', {x: x1, y:y1, pointNumber:1});
    		this.add("pointHandle0", handle0);
        	this.add("pointHandle1", handle1);
    	}else{
    		if (staticPoint!==0){
    		    handle0.setAttributes({x:x0, y:y0}, true);
    		    handle0.show(true);
    		}
    		if (staticPoint!==1){
    		    handle1.setAttributes({x:x1, y:y1}, true);
        		handle1.show(true);
    		}	
    	}
    },
    removeSelectionSprites:function(){
        for (var i=0; i<2; i++){
        	var handle=this.getByKey("pointHandle"+i);
        	if (handle)
        		handle.hide(true);
        }
    },
    getType:function(){
    	return "line";
    },
    getAttribute:function(shapeAttributeName){
    	var line=this.getAt(0), attr=line.attr;
    	if (shapeAttributeName=="stroke"){return attr.stroke;}
    	if (shapeAttributeName=="stroke-width"){return attr["stroke-width"];}
    	if (shapeAttributeName=="style"){
    		for (var key in this.drawComponent.styleSettings){
        		if (attr["stroke-dasharray"]==this.drawComponent.styleSettings[key]){return key;}
        	}
    	}
    	return Math.round(line[shapeAttributeName]);
    },
    changePointOnDragHandle:function(spriteDD, sprite, event){
        var xy=this.drawComponent.getRelativeDescaledXYFromMouseEvent(event);
        this.movePointHandle(sprite.pointNumber, xy[0], xy[1]);
        this.refreshSelectionSprites(Math.abs(sprite.pointNumber-1));
    },
    movePointHandle:function(pointNumber, x, y){
        var maxX=mds.app.getController("clientPhotoViewer.Controller").getImageWidth();
        var maxY=mds.app.getController("clientPhotoViewer.Controller").getImageHeight();
        if (x<0){x=0;}
        
        else if (x>maxX){x=maxX;}
        if (y<0){y=0;}
        else if (y>maxY){y=maxY;}
        
        var x0=this.getAttribute("x0");
	    var y0=this.getAttribute("y0");
	    var x1=this.getAttribute("x1");
	    var y1=this.getAttribute("y1");
    	if (pointNumber===0){
    	    x0=x;
    	    y0=y;
    	}else{
    	    x1=x;
    	    y1=y;
    	}
        this.getAt(0).setAttributes({
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1
    	}, true);
    	this.fireEvent("datachanged");
    },
    isTooSmall:function(){
    	return (this.getWidth()>5?false:true);
    },
    setColour:function(colour){
        this.getAt(0).setAttributes({stroke:colour}, true);
    	this.fireEvent("datachanged");
    },
    translate:function(dx, dy){
        var line=this.getAt(0);
    	line.setAttributes({x0:line.x0+dx, y0:line.y0+dy, x1:line.x1+dx, y1:line.y1+dy}, true);
    },
    getDefaultConfig:function(){
    	var xy=this.drawComponent.descaledXY;
    	var tw=Ext.getCmp("annotationsTW");
    	return {x0: xy[0], x1: xy[0], y0:xy[1], y1:xy[1], stroke: tw.getStrokeColour(), "stroke-width":tw.getStrokeWidth(), style:tw.getStrokeStyle()};
    }
});
    