Ext.define('mds.view.clientPhotoViewer.annotations.sprites.TextBox', {
    extend: 'Ext.form.field.TextArea',
    naturalFontSize: 24,
    fieldCls: 'x-form-field annotationsTextBox',
    style: "position: absolute",
    setXY:function(xy, force){
		if (!force && this.unscaledXY && this.unscaledXY[0]==xy[0] && this.unscaledXY[1]==xy[1])
			return;
		var dc=this.shape.drawComponent, dcBounds=dc.el.getPageBox(), scale=dc.getScale();
		this.unscaledXY=[xy[0], xy[1]];
		this.setPagePosition(dcBounds.left+xy[0]*scale, dcBounds.top+xy[1]*scale);
    },
    setWidth:function(width, force){
    	if ((!force && this.unscaledWidth && this.unscaledWidth==width) || !width)
    		return;
    	this.unscaledWidth=width;
    	this.callParent([width*this.shape.drawComponent.getScale()]);
    },
    setHeight:function(height, force){
    	if ((!force && this.unscaledHeight && this.unscaledHeight==height) || !height)
    		return;
    	this.unscaledHeight=height;
    	this.callParent([height*this.shape.drawComponent.getScale()]);
    },
    setBorderWeight:function(weight){
    	this.borderWeight=weight;
    	this.refresh();
    },
    setBorderStyle:function(style){
    	this.borderStyle=style;
    	this.refresh();
    },
    setBorderColour:function(colour){
    	this.borderColour=colour;
    	this.refresh();
    },
    refresh:function(){
    	var scale=this.shape.drawComponent.getScale();
    	this.setWidth(this.unscaledWidth, true);
    	this.setHeight(this.unscaledHeight, true);
    	if (this.unscaledXY)
    		this.setXY(this.unscaledXY, true);
    	var textArea=this.el.dom.getElementsByTagName("textarea")[0];
    	textArea.style.border=this.borderWeight*scale+"px "+this.borderStyle+" "+this.borderColour;
    	textArea.style.color=this.borderColour;
    	textArea.style.fontSize=Math.round((this.naturalFontSize+(this.borderWeight-4)*1.5)*scale)+"pt";
    },
    getUnscaledRelativeBox:function(){
    	return {
    	    0:this.unscaledXY[0],
    	    1:this.unscaledXY[1],
            x:this.unscaledXY[0],
            y:this.unscaledXY[1],
            width: this.unscaledWidth,
            height: this.unscaledHeight,
            right: this.unscaledXY[0]+this.unscaledWidth,
            bottom: this.unscaledXY[1]+this.unscaledHeight
    	};
    },
    getRelativeBox:function(){
    	var box=this.el.getBox(), dc=this.shape.drawComponent, dcBounds=dc.el.getPageBox();
    	box[0]-=dcBounds.left;
    	box[1]-=dcBounds.top;
    	box.x-=dcBounds.left;
    	box.y-=dcBounds.top;
    	box.left=box.x;
    	box.top=box.y;
    	box.right-=dcBounds.left;
    	box.bottom-=dcBounds.top;
    	return box;
    },
    listeners:{
    	afterrender:function(me){
    	   var scale=this.shape.drawComponent.getScale();
    		var textArea=me.el.dom.getElementsByTagName("textarea")[0];
    		textArea.style.overflow="hidden";
    		this.refresh();
    		textArea.style.cursor="default";
    		var me=this;
    		this.el.dom.style.zIndex=this.shape.drawComponent.el.dom.style.zIndex-0+1;
    		this.el.addListener("mousemove", function(e){
    			this.shape.drawComponent.fireEvent("mousemove", e);
    		}, this);
    		this.el.addListener("mouseup", function(e){
    			this.shape.drawComponent.fireEvent("mouseup", e);
    		}, this);
    		this.el.dom.style.zIndex=this.shape.drawComponent.el.dom.style.zIndex;
    	},
    	blur:function(me){
    		var textArea=me.el.dom.getElementsByTagName("textarea")[0];
    		textArea.style.cursor="default";
    		this.shape.editingText=false;
    		textArea.scrollTop=0;
    	},
    	click:function(me){
    		if (!me.shape.isSelected){
    			me.shape.select();
    		}else{
    			var textArea=me.el.dom.getElementsByTagName("textarea")[0];
    			textArea.style.cursor="text";
    			textArea.focus();
    			this.shape.editingText=true;
    		}
    	}
    }
});