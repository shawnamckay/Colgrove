Ext.define('mds.view.clientPhotoViewer.annotations.shapes.Rectangle', {
    extend: 'mds.view.clientPhotoViewer.annotations.shapes.Base',
    shapeAttributes: ['x', 'y', 'width', 'height', 'stroke', 'stroke-width', 'style'],
    initConfig:function(config){
        this.callParent(arguments);
        config.type="rect";
        config.draggable=!this.readOnly;
        config.fill="none";
        config["stroke-dasharray"]=this.drawComponent.styleSettings[config["style"]];
        var baseShape=Ext.create('Ext.draw.Sprite', config);
        this.add("base0", baseShape);
        this.show(true);
    },
    getDefaultConfig:function(){
    	var xy=this.drawComponent.descaledXY;
    	var tw=Ext.getCmp("annotationsTW");
    	return {x: xy[0], y:xy[1], width: 1, height: 1, stroke: tw.getStrokeColour(), "stroke-width":tw.getStrokeWidth(), style:tw.getStrokeStyle()};
    },
    getType:function(){
    	return "rectangle";
    }
});
    