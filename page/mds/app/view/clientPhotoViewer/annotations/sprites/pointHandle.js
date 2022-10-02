Ext.define('mds.view.clientPhotoViewer.annotations.sprites.pointHandle', {
    extend: 'Ext.draw.Sprite',
    draggable:true,
    bboxExcluded:true,
    config:{
        type: "ellipse",
        fill: "white",
        stroke: "black",
        radiusX: 4,
        radiusY: 4
    },
    constructor:function(config){
        this.initConfig(config);
        this.callParent(arguments);
        this.addListener( //setting the cursor on mouseover event because the draggable property changes the cursor property after render
            "mouseover",
            function(){ 
        		this.setStyle('cursor', 'pointer');
            },
            this,
            {single:true} //only need to call this once to set the style
        );
	},
    initConfig:function(config){
        config.type="ellipse";
        config.fill="white";
        config.stroke="black";
        config.radiusX=4;
        config.radiusY=4;
    	this.callParent(arguments);
    }
    
});
    