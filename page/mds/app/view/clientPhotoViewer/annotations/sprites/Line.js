Ext.define('mds.view.clientPhotoViewer.annotations.sprites.Line', {
    extend: 'Ext.draw.Sprite',
    constructor:function(config){
        this.initConfig(config);
        this.callParent(arguments); 
	},
	initConfig:function(config){
	    this.x0=config.x0-0;
	    this.y0=config.y0-0;
	    this.x1=config.x1-0;
	    this.y1=config.y1-0;
	    config.type="path",
	    config.path=this.makePath();   
	    this.callParent(arguments);
	},
	makePath:function(){
        path=[
              "M",
              this.x0,
              this.y0,
              "L",
              this.x1,
              this.y1,
              "Z"
        ];
        return path.join(" ");
    },
    setAttributes:function(attrs, redraw){
    	var changedPath=false;
    	if (attrs.x0!==undefined){this.x0=attrs.x0; delete attrs.x0; changedPath=true;}
    	if (attrs.y0!==undefined){this.y0=attrs.y0; delete attrs.y0; changedPath=true;}
    	if (attrs.x1!==undefined){this.x1=attrs.x1; delete attrs.x1; changedPath=true;}
    	if (attrs.y1!==undefined){this.y1=attrs.y1; delete attrs.y1; changedPath=true;}
    	if (changedPath){attrs.path=this.makePath();}
    	this.callParent(arguments);
    }
    
});