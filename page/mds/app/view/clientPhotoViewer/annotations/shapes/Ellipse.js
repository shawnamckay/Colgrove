Ext.define('mds.view.clientPhotoViewer.annotations.shapes.Ellipse', {
    extend: 'mds.view.clientPhotoViewer.annotations.shapes.Base',
    shapeAttributes: ['x', 'y', 'radiusX', 'radiusY', 'stroke', 'stroke-width', 'style'],
    initConfig:function(config){
        this.callParent(arguments);
        config.type="ellipse";
        
        config.draggable=!this.readOnly;
        config.fill="none";
        config["stroke-dasharray"]=this.drawComponent.styleSettings[config["style"]];
        var baseShape=Ext.create('Ext.draw.Sprite', config);
        this.add("base0", baseShape);
        this.show(true);
    },
    resize:function(newX, newY, newWidth, newHeight){
        var ellipse=this.getAt(0);
        var oldWidth=ellipse.attr.radiusX*2;
        var oldHeight=ellipse.attr.radiusY*2;
        
        var widthChange=oldWidth-newWidth;
        var heightChange=oldHeight-newHeight;
        
        ellipse.setAttributes({
            x: newX+newWidth/2,
            y: newY+newHeight/2,
            radiusX: newWidth/2,
            radiusY: newHeight/2
         }, true);
    },
    getRealLeft:function(){
        return (this.getBBox()).x/this.drawComponent.getScale();
    },
    getRealRight:function(){
        return (this.getBBox().x+this.getBBox().width)/this.drawComponent.getScale();
    },
    getRealTop:function(){
        return (this.getBBox()).y/this.drawComponent.getScale();
    },
    getRealBottom:function(){
        return (this.getBBox().y+this.getBBox().height)/this.drawComponent.getScale();
    },
    getDefaultConfig:function(){
    	var xy=this.drawComponent.descaledXY;
    	var tw=Ext.getCmp("annotationsTW");
    	return {x: xy[0], y:xy[1], radiusX: 1, radiusY: 1, stroke: tw.getStrokeColour(), "stroke-width":tw.getStrokeWidth(), style:tw.getStrokeStyle()};
    }
});
//@ sourceURL=annotationEllipse.js
