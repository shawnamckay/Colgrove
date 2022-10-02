Ext.define('mds.view.clientPhotoViewer.annotations.sprites.resizeHandle', {
    extend: 'Ext.draw.Sprite',
    draggable:true,
    bboxExcluded:true,
    invertX:false,
    invertY:false,
    constructor:function(config){
        this.initConfig(config);
        this.callParent(arguments);
        this.addListener( //setting the cursor on mouseover event because the draggable property changes the cursor property after render
            "mouseover",
            function(){ 
                var cursorStyles=['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];
        		this.setStyle('cursor', cursorStyles[this.position]);
            },
            this,
            {single:true} //only need to call this once to set the style
        );
	},
	initConfig:function(config){
		var xy=this.getPositionXY(config.position, config.boundingBox);
	    config.x=xy[0];
	    config.y=xy[1];
	    config.width=7;
	    config.height=7;
	    delete config.boundingBox;

	    config.type='rect';
	    config.stroke='black';
	    config.fill='white';
	    config["stroke-width"]=1;
	    this.callParent(arguments);
	},
	getPositionXY:function(position, bbox){
	    var bbx=bbox.x, bby=bbox.y, bbw=bbox.width, bbh=bbox.height, hw=7;
		if (position===0){//top
		    return [bbx+(bbw/2)-(hw/2),bby-hw/2];
		}else if (position==1){//top-right
		    return [bbx+bbw-hw/2,bby-hw/2];
		}else if (position==2){//right
		    return [bbx+bbw-hw/2,bby+(bbh/2)-(hw/2)];
		}else if (position==3){//bottom-right
		    return [bbx+bbw-hw/2,bby+bbh-hw/2];
		}else if (position==4){//bottom
		    return [bbx+(bbw/2)-(hw/2),bby+bbh-hw/2];
		}else if (position==5){//bottom-left
		    return [bbx-hw/2,bby+bbh-hw/2];
		}else if (position==6){//left
		    return [bbx-hw/2,bby+(bbh/2)-(hw/2)];
		}else{ //top-left
		    return [bbx-hw/2,bby-hw/2];
		}
	},
	refreshPosition:function(bbox){
		var xy=this.getPositionXY(this.position, bbox);
		this.setAttributes({x:xy[0], y:xy[1]}, true);
		this.show(true);
	},
	getPosition:function(shape){
	    var oppositeHandle=shape.getByKey("resizeHandle"+((this.position+4)%8));
	    var handleToRight=shape.getByKey("resizeHandle"+((this.position+2)%8));
	    var handleToLeft=shape.getByKey("resizeHandle"+((this.position+6)%8));

	    xPositions=[this.getBBox().x, oppositeHandle.getBBox().x, handleToRight.getBBox().x, handleToLeft.getBBox().x];
	    yPositions=[this.getBBox().y, oppositeHandle.getBBox().y, handleToRight.getBBox().y, handleToLeft.getBBox().y];

	    if (this.position===0 || this.position===4){        
	        if (yPositions[0]===yPositions[1]){return this.position;}
	    	if (yPositions[0]<yPositions[1]){return 0;}
	    	return 4;
	    }
	    if (this.position===6 || this.position===2){
	        if (xPositions[0]===xPositions[1]){return this.position;}
	    	if (xPositions[0]<xPositions[1]){return 6;}
	    	return 2;
	    }
	    for (var i=1; i<4; i++){
	    	if (xPositions[i]==xPositions[0] && yPositions[i]==yPositions[0]){
	    		return this.position;
	    	}
	    }
	    var leftmostX=Ext.Array.min(xPositions), rightmostX=Ext.Array.max(xPositions), uppermostY=Ext.Array.min(yPositions), lowermostY=Ext.Array.max(yPositions);
	    if (xPositions[0]==rightmostX && yPositions[0]==uppermostY){return 1;}
	    if (xPositions[0]==rightmostX && yPositions[0]==lowermostY){return 3;}
	    if (xPositions[0]==leftmostX && yPositions[0]==lowermostY){return 5;}
	    if (xPositions[0]==leftmostX && yPositions[0]==uppermostY){return 7;} 
	}
});
    