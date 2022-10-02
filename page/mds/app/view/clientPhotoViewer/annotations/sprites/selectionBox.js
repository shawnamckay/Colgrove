Ext.define('mds.view.clientPhotoViewer.annotations.sprites.selectionBox', {
    extend: 'Ext.draw.Sprite',
    constructor:function(config){
        this.initConfig(config);
        this.callParent(arguments); 
	},
	bboxExcluded:true,
	initConfig:function(config){
	    config.x=config.boundingBox.x;
	    config.y=config.boundingBox.y;
	    config.width=config.boundingBox.width;
	    config.height=config.boundingBox.height;
	    delete config.boundingBox;
	    config.type='rect';
	    config.stroke='white';
	    if (typeof(config["stroke-width"])==="undefined"){config["stroke-width"]=1;}
	    config.draggable=true;
	    this.callParent(arguments);
	},
	resize:function(dx, dy, shiftPositionLeft, shiftPositionUp){
	    var attr=(this.attr?this.attr:this);
	    var newX=attr.x;
        var newY=attr.y;
        if (shiftPositionLeft){newX-=dx};
        if (shiftPositionUp){newY-=dy};
        var newWidth=attr.width+dx;
        var newHeight=attr.height+dy;
        
        this.setAttributes({
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY
        }, true);
    }
});