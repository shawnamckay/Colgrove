Ext.define('mds.view.clientPhotoViewer.annotations.sprites.Arrow', {
    extend: 'mds.view.clientPhotoViewer.annotations.sprites.Line',
    initConfig:function(config){
	    this.strokeWidth=config["stroke-width"];   
	    this.callParent(arguments);
	},
    makePath:function(){
    	var strokeWidth=((this.strokeWidth===undefined)?this.attr["stroke-width"]:this.strokeWidth);
    	
        var theta=Math.getLineAngle([this.x0, this.y0], [this.x1, this.y1]); 
        var arrowLength=Math.sqrt(Math.pow(this.y0-this.y1, 2)+Math.pow(this.x0-this.x1, 2));
        var arrowHeadLength=strokeWidth*10;
        var arrowHeadWidth=arrowHeadLength/2;
        var arrowShaftLength=Math.max(0, arrowLength-arrowHeadLength);
        
        var arrowShaftStartPoint, arrowHeadBasePoint, arrowCorner1Point, arrowCorner2Point;
        
        var arrowShaftStartPoint=Math.getRotatedPoint([this.x0, this.y0], [this.x0+arrowLength-arrowHeadLength-arrowShaftLength, this.y0], theta);
    	var arrowHeadBasePoint=Math.getRotatedPoint([this.x0, this.y0], [this.x0+arrowLength-arrowHeadLength, this.y0], theta);
        var arrowCorner1Point=Math.getRotatedPoint([this.x0, this.y0], [this.x0+arrowLength-arrowHeadLength, this.y0-arrowHeadWidth/2], theta);
        var arrowCorner2Point=Math.getRotatedPoint([this.x0, this.y0], [this.x0+arrowLength-arrowHeadLength, this.y0+arrowHeadWidth/2], theta);

        var path=[
            "M", arrowShaftStartPoint[0], arrowShaftStartPoint[1],
            "L", arrowHeadBasePoint[0], arrowHeadBasePoint[1],
            "L", arrowCorner1Point[0], arrowCorner1Point[1],
            "L", this.x1, this.y1,
            "L", arrowCorner2Point[0], arrowCorner2Point[1],
            "L", arrowHeadBasePoint[0], arrowHeadBasePoint[1],
            "Z"
        ];
        return path.join(" ");
    },
    setAttributes:function(attrs, redraw){
    	if (attrs["stroke-width"]!=undefined){
    		this.strokeWidth=attrs["stroke-width"];
    		if (attrs.x0===undefined){attrs.x0=this.x0;}
    		if (attrs.y0===undefined){attrs.y0=this.y0;}
    		if (attrs.x1===undefined){attrs.x1=this.x1;}
    		if (attrs.y1===undefined){attrs.y1=this.y1;}
        }
    	this.callParent(arguments);
    }
});